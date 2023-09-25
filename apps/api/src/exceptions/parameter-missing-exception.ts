import { BadRequestException } from '@nestjs/common';

export class ParameterMissingException extends BadRequestException {
  public static throwUnlessExist(...params: any[]) {
    if (!params.every((p) => !!p)) throw new ParameterMissingException(`A parameter which was needed is missing`);
  }

  public static throwIfExists(...params: any[]) {
    if (!params.every((p) => !p)) throw new ParameterMissingException(`A parameter which was provided was not allowed`);
  }
}
