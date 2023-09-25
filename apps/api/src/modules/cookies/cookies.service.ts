import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@logbook/database';
import { AUTH_COOKIE_OPTIONS } from './config/authCookie';
import { AUTH_COOKIE_NAME } from '@logbook/constants';

@Injectable()
export class CookiesService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  setUserTokenCookie(res: Response, user: User) {
    const payload = {
      sub: user.id,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
      },
    };

    const secret = this.config.get(`JWT_AUTH_SECRET`);

    res.cookie(AUTH_COOKIE_NAME, this.jwt.sign(payload, { secret }), AUTH_COOKIE_OPTIONS);
  }

  clearUserTokenCookie(res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
  }
}
