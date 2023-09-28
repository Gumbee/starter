import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleNativeStrategy extends PassportStrategy(Strategy, 'google-native') {
  constructor(config: ConfigService) {
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

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;

    const email = emails.length > 0 ? emails[0].value : undefined;
    const avatar = photos[0].value;
    const firstName = name.givenName;
    const lastName = name.familyName;

    return {
      id: 'asdiajsd',
      email,
      avatar,
      firstName,
      lastName,
      accessToken,
      refreshToken,
    };
  }
}
