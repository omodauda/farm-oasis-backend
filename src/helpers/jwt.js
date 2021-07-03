// import jwtr from '../utils/jwtr';
import jwt from 'jsonwebtoken';
import redisClient from '../utils/redis';

export function signToken(user) {
  return jwt.sign({
    iss: 'omodauda',
    sub: user.id,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export function signRefreshToken(user) {
  const refreshToken = jwt.sign({
    iss: 'omodauda',
    sub: user.id,
    iat: new Date().getTime(),
  }, process.env.JWT_REFRESH_SECRET, { expiresIn: '365d' });

  // eslint-disable-next-line no-unused-vars
  redisClient.get(user.id.toString(), (err, data) => {
    if (err) throw err;

    redisClient.set(user.id.toString(), JSON.stringify({ token: refreshToken }));
  });
  return refreshToken;
}

// eslint-disable-next-line consistent-return
export async function regenerateAccessToken(refreshToken) {
  // verify refreshToken
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  // verify if token is in store
  const token = redisClient.get(decoded.sub.toString(), (err, data) => {
    if (err) throw err;

    if (data === null) throw new Error('invalid request: token is not recognized');
    if (JSON.parse(data).token !== refreshToken) throw new Error('invalid request: token is not recognized');
  });
  if (token) {
    const user = {
      id: decoded.sub,
    };
    return signToken(user);
  }
}
