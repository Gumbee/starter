import { ERROR_CODES } from '@forge/common/errors';

type Keys = keyof typeof ERROR_CODES;
type Values = (typeof ERROR_CODES)[Keys];

// set the user type on the express request object
declare module '@nestjs/common' {
  class NotFoundException {
    constructor(args: { code: Values; message: string });
  }

  class InternalServerErrorException {
    constructor(args: { code: Values; message: string });
  }

  class UnauthorizedException {
    constructor(args: { code: Values; message: string });
  }

  class BadRequestException {
    constructor(args: { code: Values; message: string });
  }

  class ForbiddenException {
    constructor(args: { code: Values; message: string });
  }

  class ConflictException {
    constructor(args: { code: Values; message: string });
  }

  class UnprocessableEntityException {
    constructor(args: { code: Values; message: string });
  }

  class NotImplementedException {
    constructor(args: { code: Values; message: string });
  }

  class PayloadTooLargeException {
    constructor(args: { code: Values; message: string });
  }

  class GatewayTimeoutException {
    constructor(args: { code: Values; message: string });
  }

  class BadGatewayException {
    constructor(args: { code: Values; message: string });
  }

  class ServiceUnavailableException {
    constructor(args: { code: Values; message: string });
  }
}

export {};
