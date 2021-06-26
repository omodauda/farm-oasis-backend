import { sequelize, Auth, User } from '../../database/models';
import UserService from '../../services/user';
import generateReferralCode from '../../helpers/referralCode';
import signToken from '../../helpers/jwt';
import { successMsg, errorMsg } from '../../utils/response';

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

        const token = await signToken(auth);

        const data = {
          token,
          authId: auth.id,
          isAdmin: auth.isAdmin,
          isVerified: auth.isVerified,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          confirmToken: auth.confirmToken,
          referralCode: user.referralCode,
        };

        return successMsg(res, 201, 'user registered sucessfully', data);
      });
      return result;
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }
}
