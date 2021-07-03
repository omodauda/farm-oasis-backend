import redis from 'redis';

const REDIS_PORT = process.env.REDISCLOUD_URL || 6379;
const redisClient = redis.createClient(REDIS_PORT);

const ENV = process.env.NODE_ENV;

if (ENV === 'development') {
  redisClient.on('connect', () => {
    console.log('redis client connected');
  });
}

export default redisClient;

// setup main redis main redis;
