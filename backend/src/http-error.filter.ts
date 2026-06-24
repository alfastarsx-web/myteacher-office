import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = exception instanceof HttpException ? exception.getResponse() : null;
    const message = typeof payload === 'object' && payload && 'message' in payload
      ? (payload as { message: string | string[] }).message
      : exception instanceof Error
        ? exception.message
        : 'Server error';

    response.status(status).json({
      error: Array.isArray(message) ? message.join(', ') : message
    });
  }
}
