// src/common/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Global() // Hace que el módulo sea global
@Module({
  providers: [AppLogger],
  exports: [AppLogger], // Exporta AppLogger para que otros módulos lo usen
})
export class LoggerModule {}