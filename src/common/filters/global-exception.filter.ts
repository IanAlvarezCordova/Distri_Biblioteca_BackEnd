// src/common/filters/global-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { AppLogger } from '../logger.service';
  
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
  
      let message: any =
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Error interno del servidor';
  
      // Para errores de validación: extraer array de mensajes
      let errorMessage: string | string[] = 'Error interno del servidor';
      if (typeof message === 'object' && message !== null && 'message' in message) {
        errorMessage = (message as any).message;
      } else if (typeof message === 'string') {
        errorMessage = message;
      }
  
      this.logger.error(
        `Error en ${request.method} ${request.url}: ${
          typeof errorMessage === 'string' ? errorMessage : errorMessage.join(', ')
        }`,
        exception instanceof Error ? exception.stack : '',
      );
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorMessage,
      });
    }
  }
  