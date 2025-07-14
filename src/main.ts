// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppLogger } from './common/logger.service';
import * as morgan from 'morgan'; // Cambiar a importación de estilo CommonJS

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLogger); // Obtener el logger

  // Configurar Morgan para registrar logs de acceso
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.log(message.trim()),
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(logger)); // Registrar el filtro

  app.enableCors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Aplicación escuchando en el puerto ${port}`);
}
bootstrap();