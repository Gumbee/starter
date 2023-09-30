import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { AUTH_COOKIE_NAME } from '@logbook/common/constants';
import { ERROR_CODES } from '@logbook/common/errors';

const cookieExtractor = (req: Request) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies[AUTH_COOKIE_NAME];
  }

  return jwt;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, `jwt`) {
  constructor(
    config: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.get(`JWT_AUTH_SECRET`),
    });
  }

  async validate(payload: any) {
    if (!payload.sub) throw new UnauthorizedException({ code: ERROR_CODES.BAD_PAYLOAD, message: 'Payload sub missing' });

    const user = await this.userService.findById(payload.sub);

    if (!user) throw new UnauthorizedException({ code: ERROR_CODES.USER_NOT_FOUND, message: 'User not found' });

    return user;
  }
}
