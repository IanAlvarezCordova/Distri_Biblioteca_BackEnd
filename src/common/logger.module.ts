// src/common/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { AppLogger } from './logger.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';


@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: AppLogger,
      useFactory: (configService: ConfigService) => new AppLogger(configService),
      inject: [ConfigService],
    },
  ],
  exports: [AppLogger],
})
export class LoggerModule {}