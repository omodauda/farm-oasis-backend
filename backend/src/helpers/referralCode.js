import UserService from '../services/user';

// eslint-disable-next-line consistent-return
export default async function generateReferralCode(firstName, lastName) {
  let result = '';

  const capitalizeFirstTwoLetters = (string) => {
    result += string.split('', 2).join('').toUpperCase();
  };

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  capitalizeFirstTwoLetters(firstName);
  capitalizeFirstTwoLetters(lastName);
  result += randomNumber;

  const referralCodeExist = await UserService.referralCodeExist(result);

  if (!referralCodeExist) {
    return result;
  }

  generateReferralCode();
}
