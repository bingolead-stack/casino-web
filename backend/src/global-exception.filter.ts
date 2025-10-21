import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.error(exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    const str = JSON.stringify(message).toLowerCase();
    if (
      process.env.NODE_ENV === 'production' &&
      (str.includes('ubuntu') ||
        str.includes('prisma') ||
        str.includes('/') ||
        str.includes('sql') ||
        str.includes('postgre') ||
        str.includes('clientversion') ||
        str.includes('\\'))
    ) {
      message = 'Internal server error';
    }

    response.status(status).json(message);
  }
}
