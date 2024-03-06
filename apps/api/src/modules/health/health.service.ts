import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CanonLogger } from '@/observability';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Redis } from 'ioredis';

@Injectable()
export class HealthService {
  private readonly REDIS_ALIVE_KEY = 'redis-alive';
  private readonly REDIS_ALIVE_VALUE = 'true';

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private prisma: PrismaService,
  ) {}

  async getStatus() {
    const [redisAlive, dbAlive] = await Promise.all([this.redisAlive().catch((x) => false), this.dbAlive().catch((x) => false)]);

    return {
      redis: redisAlive,
      db: dbAlive,
    };
  }

  async isHealthy() {
    const { redis, db } = await this.getStatus();

    return redis && db;
  }

  async redisAlive() {
    const redisResponse = await this.redis.get(this.REDIS_ALIVE_KEY);

    if (redisResponse) {
      return redisResponse === this.REDIS_ALIVE_VALUE;
    }

    CanonLogger.log('Initializing Redis', {});

    await this.redis.set(this.REDIS_ALIVE_KEY, this.REDIS_ALIVE_VALUE);

    const inialisedRedisResponse = await this.redis.get(this.REDIS_ALIVE_KEY);

    return inialisedRedisResponse === this.REDIS_ALIVE_VALUE;
  }

  async dbAlive() {
    const result = await this.prisma.$queryRaw`SELECT 1`;

    return !!result;
  }
}
