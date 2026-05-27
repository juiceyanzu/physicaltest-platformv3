const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.connect().then(() => {
  console.log('Redis connected successfully');
});

const cache = {
  async get(key) {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key, value, ttl = 3600) {
    await client.set(key, JSON.stringify(value), { EX: ttl });
  },

  async del(key) {
    await client.del(key);
  },

  async exists(key) {
    return await client.exists(key);
  }
};

module.exports = cache;