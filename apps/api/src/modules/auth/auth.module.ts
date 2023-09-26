import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookiesModule } from '@modules/cookies/cookies.module';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '@modules/user/user.module';
import { AccountsModule } from '@modules/accounts/accounts.module';

@Module({
  imports: [CookiesModule, UserModule, AccountsModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy],
})
export class AuthModule {}
