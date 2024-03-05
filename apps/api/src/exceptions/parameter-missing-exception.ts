import { ERROR_CODES } from '@forge/common/errors';
import { BadRequestException } from '@nestjs/common';

export class ParameterMissingException extends BadRequestException {
  public static throwUnlessExist(...params: any[]) {
    if (!params.every((p) => !!p))
      throw new ParameterMissingException({ code: ERROR_CODES.BAD_PAYLOAD, message: `A parameter which was needed is missing` });
  }

  public static throwIfExists(...params: any[]) {
    if (!params.every((p) => !p))
      throw new ParameterMissingException({ code: ERROR_CODES.BAD_PAYLOAD, message: `A parameter which was not needed is present` });
  }
}
