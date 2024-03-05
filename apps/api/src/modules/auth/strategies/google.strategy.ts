import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { ERROR_CODES } from '@forge/common/errors';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.get('SELF_URL')}/v1/auth/oauth/google/callback`,
      scope: [`email`, `profile`],
      state: false,
      prompt: 'select_account',
      session: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    let account = await this.authService.findGoogleAccount(profile);

    if (!account) {
      account = await this.authService.createAccountFromGoogle(profile, accessToken, refreshToken, ['email', 'profile']);
    }

    if (!account?.user) {
      throw new NotFoundException({ code: ERROR_CODES.UNKNOWN_ERROR, message: 'User could not be created or found for some reason' });
    }

    return account.user;
  }
}
