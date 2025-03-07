import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      
      if (typeof response === 'object' && response !== null) {
        message = (response as any).message || message;
        error = (response as any).error || error;
      } else {
        message = response as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }
    
    this.logger.error(`${statusCode} - ${message}`, exception.stack);
    
    reply.status(statusCode).send({
      statusCode,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      error,
      message,
    });
  }
}