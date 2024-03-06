import { AuthFlowException } from '@/exceptions/auth-flow-exception';
import { ApiError, ERROR_CODES, ErrorCode } from '@forge/common/errors';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let code: ErrorCode = ERROR_CODES.UNKNOWN_ERROR;
    let message = exception.message;

    if (exception instanceof AuthFlowException) {
      response.render('oauth', {
        error: {
          code: (exception as any).response?.code ?? ERROR_CODES.UNKNOWN_ERROR,
          message: (exception as any).response?.message ?? 'Something went wrong',
        },
        frontend: process.env.FRONTEND_URL,
      });

      return;
    } else if (exception instanceof HttpException) {
      code = (exception as any).response?.code ?? ERROR_CODES.UNKNOWN_ERROR;
      status = exception.getStatus();
      message = (exception as any).response?.message ?? exception.message;
    } else if (exception instanceof ApiError) {
      code = exception.code;
      message = exception.message;
      status = exception.status ?? 500;
    }

    response.status(status).json({
      status: status,
      code: code,
      message: process.env.NODE_ENV !== `production` ? message : undefined,
    });
  }
}
