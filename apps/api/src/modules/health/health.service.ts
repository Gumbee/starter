import { Injectable, Logger } from '@nestjs/common';
// import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

@Injectable()
export class HealthService {
  private readonly REDIS_ALIVE_KEY = 'redis-alive';
  private readonly REDIS_ALIVE_VALUE = 'true';

  // constructor(@InjectRedis() private readonly redis: Redis) {}

  isHealthy() {
    return true;
  }

  // async redisAlive() {
  //   const redisResponse = await this.redis.get(this.REDIS_ALIVE_KEY);
  //   Logger.log(`redisResponse: ${redisResponse}`, this.constructor.name);

  //   if (redisResponse) {
  //     return redisResponse === this.REDIS_ALIVE_VALUE;
  //   }

  //   Logger.log('initialising redis...', this.constructor.name);

  //   await this.redis.set(this.REDIS_ALIVE_KEY, this.REDIS_ALIVE_VALUE);

  //   const inialisedRedisResponse = await this.redis.get(this.REDIS_ALIVE_KEY);
  //   return inialisedRedisResponse === this.REDIS_ALIVE_VALUE;
  // }
}
