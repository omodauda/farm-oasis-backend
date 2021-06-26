import redis from 'redis';
import JWTR from 'jwt-redis';

const REDIS_PORT = process.env.REDISCLOUD_URL || 6379;
const redisClient = redis.createClient(REDIS_PORT);
const jwtr = new JWTR(redisClient);

export default function signToken(user) {
  return jwtr.sign({
    iss: 'omodauda',
    sub: user.id,
    iat: new Date().getTime(),
    expiresIn: '1d',
  }, process.env.JWT_SECRET);
}
