import { ERROR_CODES } from '@forge/common/errors';
import { HttpException } from '@nestjs/common';

type Keys = keyof typeof ERROR_CODES;
type Values = (typeof ERROR_CODES)[Keys];

export class AuthFlowException extends HttpException {
  constructor(args: { code: Values; message: string; status?: number }) {
    super(
      {
        code: args.code,
        message: args.message,
      },
      args.status ?? 401,
    );
  }
}
