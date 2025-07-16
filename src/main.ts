import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppLogger } from './common/logger.service';
import * as morgan from 'morgan';
const requestIp = require('request-ip'); // ✅ Importar así si da error con import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLogger);

  app.use(
    morgan((tokens, req, res) => {
      const ip = requestIp.getClientIp(req) || 'IP_DESCONOCIDA';

      return [
        `[${ip}]`, // IP real
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res) + 'ms',
        `"${tokens['user-agent'](req, res)}"`,
      ].join(' ');
    }, {
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

  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  app.enableCors({
    origin: ['http://localhost:5173', 'https://enlace-produccion-frontend'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Aplicación escuchando en el puerto ${port}`);
}
bootstrap();
