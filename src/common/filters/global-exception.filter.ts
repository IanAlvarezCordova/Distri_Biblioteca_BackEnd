import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger.service';
const requestIp = require('request-ip');

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Obtener el mensaje de la excepción
    let message: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    // Normalizar el mensaje de error
    let errorMessage: string;
    if (typeof message === 'string') {
      errorMessage = message;
    } else if (typeof message === 'object' && message !== null && 'message' in message) {
      errorMessage = (message as any).message;
      // Si message.message es un arreglo, unirlo en un solo string
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
    } else {
      errorMessage = 'Error interno del servidor';
    }

    const logMessage = {
      message: errorMessage,
      url: request.url,
      method: request.method,
      statusCode: status,
      stack: exception instanceof Error ? exception.stack : '',
      ip: requestIp.getClientIp(request) || 'IP_DESCONOCIDA',
    };

    this.logger.error(logMessage.message, logMessage);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}