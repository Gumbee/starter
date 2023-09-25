import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.get('SELF_URL')}/v1/auth/signin/google/callback`,
      scope: [`email`, `profile`],
      state: false,
      prompt: 'select_account',
      session: false,
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;

    const email = emails.length > 0 ? emails[0].value : undefined;
    const avatar = photos[0].value;

    return {
      id: 'asdiajsd',
      email,
      avatar,
      name,
    };
  }
}
