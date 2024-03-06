import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookiesModule } from '@modules/cookies/cookies.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '@modules/user/user.module';
import { AccountModule } from '@modules/account/account.module';
import { GoogleNativeStrategy } from './strategies/google-native.strategy';
import { FrontendModule } from '@modules/frontend/frontend.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleSignInStrategy } from './strategies/google-signin.strategy';
import { GoogleSignUpStrategy } from './strategies/google-signup.strategy';
import { EntryCodeModule } from '@modules/entry-code/entry-code.module';

@Module({
  imports: [JwtModule, FrontendModule, CookiesModule, UserModule, AccountModule, EntryCodeModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleSignInStrategy, GoogleSignUpStrategy, GoogleNativeStrategy],
})
export class AuthModule {}
