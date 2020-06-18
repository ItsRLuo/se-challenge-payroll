const IOredis = require('ioredis')

export const prRedis = new IOredis(
  {
    host: 'pr-redis',
    port: 6379
  }
)
