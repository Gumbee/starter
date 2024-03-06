import { AuthFlowException } from '@/exceptions/auth-flow-exception';
import { ERROR_CODES } from '@forge/common/errors';
import { Maybe, Optional } from '@forge/common/types';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserService } from '@modules/user/user.service';
import { EntryCodeService } from '@modules/entry-code/entry-code.service';
import { EntryCode, User } from '@forge/database';

type OAuthState = {
  entryCode: Optional<string>;
  name: Optional<string>;
};

@Injectable()
export class GoogleSignUpAuthGuard extends AuthGuard(`google-signup`) {
  @Inject()
  private auth: AuthService;
  @Inject()
  private users: UserService;
  @Inject()
  private entryCodes: EntryCodeService;

  async getAuthenticateOptions(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest() as Request;

    const state: OAuthState = {
      entryCode: req.query.entryCode as Optional<string>,
      name: req.query.name as Optional<string>,
    };

    return {
      state: Buffer.from(JSON.stringify(state)).toString('base64'),
    };
  }

  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest() as Request;

    return req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const stateQuery = (request as Request).query.state;
    const isPassback = !!request.query.code;

    const state: OAuthState = {
      entryCode: undefined,
      name: undefined,
    };

    if (stateQuery) {
      if (typeof stateQuery !== 'string')
        throw new AuthFlowException({
          code: ERROR_CODES.BAD_OAUTH_STATE,
          message: 'OAuth state is invalid',
          status: 400,
        });

      const pipedState = JSON.parse(Buffer.from(stateQuery, 'base64').toString('utf-8'));

      state.name = pipedState.name;
      state.entryCode = pipedState.entryCode;
    }

    // check if stuff is valid

    let entry: Maybe<EntryCode> = null;

    if (isPassback) {
      // don't signup accounts wihtout valid entry code or invite
      const { valid, entry: code } = await this.auth.isEntryValid({
        entryCode: state.entryCode,
      });

      entry = code;

      if (!valid) {
        throw new AuthFlowException({
          code: ERROR_CODES.INVALID_ENTRY,
          message: 'Invalid entry code or invite',
          status: 403,
        });
      }
    }

    const can = await super.canActivate(context);

    const user = request.user as Optional<User>;

    if (can && user) {
      await this.users
        .updateById(user.id, {
          name: state.name,
          entryCode: state.entryCode,
        })
        .catch(() => {
          // TODO: Critical error
        });

      if (state.entryCode) {
        await this.entryCodes.consumeEntryCode(state.entryCode).catch(() => {
          // TODO: error
        });
      }
    }

    return can as boolean;
  }

  handleRequest(err: any, user: any) {
    if (err && err instanceof AuthFlowException) {
      throw err;
    } else if (err) {
      throw new AuthFlowException({
        code: ERROR_CODES.UNAUTHORIZED,
        message: err.message ?? 'Unexpected error',
      });
    } else if (!user) {
      throw new AuthFlowException({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'User not found',
      });
    }

    return user;
  }
}
