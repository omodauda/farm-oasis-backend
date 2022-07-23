import { Auth, User as userModel } from '../../database/models';

export default class User {
  static async emailExist(email) {
    const response = await Auth.findOne({ where: { email } });
    return response;
  }

  static async referralCodeExist(referralCode) {
    const response = await userModel.findOne({ where: { referralCode } });
    return response;
  }

  static async userByAuthId(authId) {
    const response = await userModel.findOne({ where: { authId } });
    return response;
  }

  static async confirmEmail(id) {
    const response = await Auth.update({ isVerified: true }, {
      where: {
        id,
      },
    });
    return response;
  }
}
