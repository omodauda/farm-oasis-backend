import jwtr from '../utils/jwtr';

export default function signToken(user) {
  return jwtr.sign({
    iss: 'omodauda',
    sub: user.id,
    iat: new Date().getTime(),
    expiresIn: '1d',
  }, process.env.JWT_SECRET);
}
