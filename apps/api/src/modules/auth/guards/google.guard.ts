import { ExecutionContext, Injectable } from '@nestjs/common';
import { Optional } from '@logbook/types';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(private config: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}
