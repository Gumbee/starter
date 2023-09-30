import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { ERROR_CODES } from '@logbook/common/errors';

@Injectable()
export class GoogleNativeStrategy extends PassportStrategy(Strategy, 'google-native') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.get('SELF_URL')}/v1/auth/oauth/native/google/callback`,
      scope: [`email`, `profile`],
      state: false,
      prompt: 'select_account',
      session: false,
    });
  }

  authenticate(req: any, options?: any): void {
    options.req = req;

    super.authenticate(req, options);
  }

  authorizationParams(options?: any): any {
    if (!options.req?.query.code_challenge) throw new Error('No code challenge provided');

    const challenge = options.req.query.code_challenge;

    return {
      code_challenge: challenge,
      code_challenge_method: 'S256',
    };
  }

  tokenParams(options?: any): any {
    if (!options.req?.body.verifier) throw new Error('No code verifier provided');

    const verifier = options.req?.body.verifier;

    return {
      code_verifier: verifier,
    };
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
