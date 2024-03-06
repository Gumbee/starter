import { ERROR_CODES } from '@forge/common/errors';
import { BadRequestException } from '@nestjs/common';

export class ParameterMissingException extends BadRequestException {
  public static throwUnlessExists(param: any, name: string) {
    if (!param) throw new ParameterMissingException({ code: ERROR_CODES.BAD_PAYLOAD, message: `Missing parameter "${name}"` });
  }
}
