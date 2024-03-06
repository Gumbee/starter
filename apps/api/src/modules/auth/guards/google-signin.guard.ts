import { AuthFlowException } from '@/exceptions/auth-flow-exception';
import { CanonLogger } from '@/observability';
import { ERROR_CODES } from '@forge/common/errors';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleSignInAuthGuard extends AuthGuard(`google-signin`) {
  handleRequest(err: any, user: any) {
    if (err && err instanceof AuthFlowException) {
      throw err;
    } else if (err || !user) {
      CanonLogger.error('Unexpected Google Signin Auth Error', err);

      throw new AuthFlowException({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'User not found',
      });
    }

    return user;
  }
}
