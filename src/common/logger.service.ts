// src/common/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { MongoTransport } from './mongo-transport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppLogger implements LoggerService {
  private logger;

  constructor(configService: ConfigService) {
    this.logger = createLogger({
      level: 'silly',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] : ${message}`)
      ),
      transports: [
        new transports.Console(),
        new DailyRotateFile({
          filename: 'logs/aplicacion-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new MongoTransport({
          mongoUri: configService.get('MONGO_URI') || 'mongodb+srv://ijalvarez:NY8ycD3BB4GQ7jwK@cluster0.gwreou4.mongodb.net/logs_biblioteca?retryWrites=true&w=majority',
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, meta?: any) {
    this.logger.error(message, meta);
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