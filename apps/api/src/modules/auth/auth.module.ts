import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookiesModule } from '@modules/cookies/cookies.module';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '@modules/user/user.module';
import { AccountModule } from '@modules/account/account.module';
import { GoogleNativeStrategy } from './strategies/google-native.strategy';
import { FrontendModule } from '@modules/frontend/frontend.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule, FrontendModule, CookiesModule, UserModule, AccountModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy, GoogleNativeStrategy],
})
export class AuthModule {}
