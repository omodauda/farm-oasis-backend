import bcrypt from 'bcryptjs';
import { sequelize, Auth, User } from '../../database/models';
import UserService from '../../services/user';
import generateReferralCode from '../../helpers/referralCode';
import { signToken, signRefreshToken, regenerateAccessToken } from '../../helpers/jwt';
import { successMsg, errorMsg } from '../../utils/response';
import { sendVerificationEmail, sendResetTokenEmail } from '../../services/email';

export default class UserController {
  static async createUser(req, res) {
    try {
      const {
        email, password, firstName, lastName, phone,
      } = req.body;

      const Email = email.toLowerCase();
      const emailExist = await UserService.emailExist(Email);

      if (emailExist) {
        return errorMsg(res, 400, `email ${email} already exist`);
      }

      const confirmToken = Math.floor(Math.random() * 1000000) + 1;
      const referralCode = await generateReferralCode(firstName, lastName);

      const result = await sequelize.transaction(async (t) => {
        const auth = await Auth.create({ email, password, confirmToken }, { transaction: t });
        const user = await User.create({
          authId: auth.id,
          firstName,
          lastName,
          phone,
          referralCode,
        }, { transaction: t });

        await sendVerificationEmail(email, confirmToken);

        const token = signToken(auth);
        const refreshToken = signRefreshToken(auth);

        const data = {
          token,
          refreshToken,
          authId: auth.id,
          isAdmin: auth.isAdmin,
          isVerified: auth.isVerified,
          email: auth.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          referralCode: user.referralCode,
        };

        return successMsg(res, 201, 'user registered sucessfully', data);
      });
      return result;
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const Email = email.toLowerCase();
      const emailExist = await UserService.emailExist(Email);

      if (!emailExist) {
        return errorMsg(res, 400, `${email} is not registered`);
      }

      const isValidPassword = await bcrypt.compare(password, emailExist.password);
      if (!isValidPassword) {
        return errorMsg(res, 400, 'invaild password');
      }

      const { id: authId, isAdmin, isVerified } = emailExist;
      const user = await UserService.userByAuthId(authId);
      const token = signToken(emailExist);
      const refreshToken = signRefreshToken(emailExist);

      const data = {
        token,
        refreshToken,
        authId,
        isAdmin,
        isVerified,
        email: emailExist.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        referralCode: user.referralCode,
      };
      return successMsg(res, 200, 'login successful', data);
    } catch (error) {
      return errorMsg(res, 500, error.message);
    }
  }

  static async getUser(req, res) {
    const { id } = req.user;
    try {
      const auth = await Auth.findByPk(id, { include: User });
      const {
        id: authId, email, isAdmin, isVerified, User: user,
      } = auth;
      const {
        firstName, lastName, phone, referralCode,
      } = user;

      const data = {
        authId,
        isAdmin,
        isVerified,
        email,
        firstName,
        lastName,
        phone,
        referralCode,
      };
      return successMsg(res, 200, '', data);
    } catch (error) {
      return errorMsg(res, 400, 'internal server error');
    }
  }

  static async verifyUser(req, res) {
    const { id, isVerified } = req.user;
    if (isVerified) {
      return errorMsg(res, 400, 'user is already verified');
    }
    try {
      const { confirmToken } = req.body;

      if (req.user.confirmToken !== confirmToken) {
        return errorMsg(res, 400, 'invalid confirmation token');
      }
      await UserService.confirmEmail(id);
      return successMsg(res, 200, 'email successfully confirmed');
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }

  static async resendConfirmationToken(req, res) {
    const { id, isVerified, email } = req.user;
    try {
      if (isVerified) {
        return errorMsg(res, 400, 'user is already verified');
      }
      const newConfirmToken = Math.floor(Math.random() * 1000000) + 1;
      await Auth.update({ confirmToken: newConfirmToken }, {
        where: {
          id,
        },
      });
      await sendVerificationEmail(email, newConfirmToken);
      return successMsg(res, 200, 'check your email for new confirmation token');
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }

  static async forgetPassword(req, res) {
    const { email } = req.body;
    const Email = email.toLowerCase();
    try {
      const emailExist = await UserService.emailExist(Email);
      if (!emailExist) {
        return errorMsg(res, 400, `email ${email} is not registered`);
      }
      const resetToken = Math.floor(Math.random() * 1000000) + 1;
      await Auth.update({ resetToken }, {
        where: {
          email: emailExist.email,
        },
      });
      await sendResetTokenEmail(emailExist.email, resetToken);
      return successMsg(res, 200, 'check your email for password reset token');
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }

  static async resetPassword(req, res) {
    const { email, resetToken, newPassword } = req.body;
    try {
      const auth = await Auth.findOne({ where: { email } });

      if (auth.resetToken !== resetToken) {
        return errorMsg(res, 400, 'invalid reset token');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await Auth.update({ password: hashedNewPassword }, {
        where: {
          email,
        },
      });
      return successMsg(res, 200, 'password reset successful');
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }

  static async refreshAccessToken(req, res) {
    const { refreshToken } = req.body;
    try {
      const accessToken = await regenerateAccessToken(refreshToken);
      return successMsg(res, 200, 'new access token generated', accessToken);
    } catch (error) {
      return errorMsg(res, 500, error.message);
    }
  }
}
