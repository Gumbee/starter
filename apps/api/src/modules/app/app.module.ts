import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CookiesModule } from '@modules/cookies/cookies.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { HealthModule } from '@modules/health/health.module';
import { EmitterModule } from '@modules/emitter/emitter.module';
import { EntryCodeModule } from '@modules/entry-code/entry-code.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? ``),
        tls: ['127.0.0.1', 'localhost'].includes(process.env.REDIS_HOST ?? '127.0.0.1') ? undefined : {},
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000 * 10, // 10 minutes
          limit: 1, // 100 requests per 10 minutes
        },
      ],
      storage: new ThrottlerStorageRedisService({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? ``),
        tls: ['127.0.0.1', 'localhost'].includes(process.env.REDIS_HOST ?? '127.0.0.1') ? undefined : {},
      }),
    }),
    PrismaModule,
    AuthModule,
    EmitterModule,
    CookiesModule,
    HealthModule,
    EntryCodeModule,
  ],
})
export class AppModule {}
