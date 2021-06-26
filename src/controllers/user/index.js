import { sequelize, Auth, User } from '../../database/models';
import UserService from '../../services/user';
import generateReferralCode from '../../helpers/referralCode';

export default class UserController {
  static async createUser(req, res) {
    try {
      const {
        email, password, firstName, lastName, phone,
      } = req.body;

      const Email = email.toLowerCase();
      const emailExist = await UserService.emailExist(Email);

      if (emailExist) {
        return res
          .status(200)
          .json({
            status: 'success',
            message: `user with email ${email} already exist`,
          });
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

        const data = {
          authId: auth.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          confirmToken: auth.confirmToken,
          referralCode: user.referralCode,
        };

        return res
          .status(200)
          .json({
            status: 'success',
            message: 'user registered successfully',
            data,
          });
      });
      return result;
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'fail',
          error: error.message,
        });
    }
  }
}
