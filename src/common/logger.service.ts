// src/common/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file'; // Importar directamente

@Injectable()
export class AppLogger implements LoggerService {
  private logger;

  constructor() {
    this.logger = createLogger({
      level: 'silly', // Nivel más bajo para capturar todo
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] : ${message}`)
      ),
      transports: [
        new transports.Console(), // Mostrar logs en consola
        new DailyRotateFile({
          filename: 'logs/aplicacion-%DATE%.log', // Archivos rotativos
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m', // Tamaño máximo por archivo
          maxFiles: '14d', // Mantener logs por 14 días
        }),
        new transports.File({
          filename: 'logs/error.log', // Archivo específico para errores
          level: 'error',
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} ${trace || ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}