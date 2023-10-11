import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CookiesModule } from '@modules/cookies/cookies.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    AuthModule,
    CookiesModule,
    HealthModule,
  ],
})
export class AppModule {}
