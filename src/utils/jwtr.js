import redis from 'redis';
// import JWTR from 'jwt-redis';

const REDIS_PORT = process.env.REDISCLOUD_URL || 6379;
const redisClient = redis.createClient(REDIS_PORT);
// const jwtr = new JWTR(redisClient);

// export default jwtr;

// setup main redis main redis;
