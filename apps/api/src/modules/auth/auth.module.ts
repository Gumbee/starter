import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookiesModule } from '@modules/cookies/cookies.module';

@Module({
  imports: [CookiesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
