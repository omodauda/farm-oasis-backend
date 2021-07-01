// import jwtr from '../utils/jwtr';
import jwt from 'jsonwebtoken';

export function signToken(user) {
  return jwt.sign({
    iss: 'omodauda',
    sub: user.id,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export function signRefreshToken(user) {
  return jwt.sign({
    iss: 'omodauda',
    sub: user.id,
    iat: new Date().getTime(),
  }, process.env.JWT_REFRESH_SECRET, { expiresIn: '365d' });
}

export async function regenerateAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = {
      id: decoded.sub,
    };
    return signToken(user);
  } catch (error) {
    throw new Error(error);
  }
}
