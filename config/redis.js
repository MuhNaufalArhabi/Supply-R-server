const Redis = require('ioredis');

// const redis = new Redis({
//     host: 'redis-16026.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
//     port: 16026,
//     password: 'fAupl4yvhWuGvVGgI9CapcvZdEhALGo6'

//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     password: process.env.REDIS_PASSWORD,
// });

const redis = new Redis()

module.exports = redis;