import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthNativeGuard extends AuthGuard('google-native') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}
