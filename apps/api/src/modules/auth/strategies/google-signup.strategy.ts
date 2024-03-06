import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { ERROR_CODES } from '@forge/common/errors';
import { UserService } from '@modules/user/user.service';
import { AuthFlowException } from '@/exceptions/auth-flow-exception';

@Injectable()
export class GoogleSignUpStrategy extends PassportStrategy(Strategy, 'google-signup') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.get('SELF_URL')}/v1/auth/oauth/signup/google/callback`,
      scope: [`email`, `profile`],
      state: false,
      prompt: 'select_account',
      session: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, rest: any): Promise<any> {
    const account = await this.authService.findGoogleAccount(profile);

    if (!account) {
      throw new AuthFlowException({
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
      // account = await this.authService.createAccountFromGoogle(profile, accessToken, refreshToken, ['email', 'profile']);
    } else {
      // throw new AuthFlowException({
      //   code: ERROR_CODES.USER_EXISTS,
      //   message: 'Account with this email address exists already.',
      //   status: 409,
      // });
    }

    const user = await this.userService.findById(account.user.id);

    if (!user) {
      throw new NotFoundException({ code: ERROR_CODES.UNKNOWN_ERROR, message: 'User could not be created or found for some reason' });
    }

    return user;
  }
}
