import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppLogger } from './common/logger.service';
import * as morgan from 'morgan';
const requestIp = require('request-ip');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLogger);

  app.use(
    morgan(
      (tokens, req, res) => {
        const ip = requestIp.getClientIp(req) || 'IP_DESCONOCIDA';
        return [
          `[${ip}]`,
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens['response-time'](req, res) + 'ms',
          `"${tokens['user-agent'](req, res)}"`,
        ].join(' ');
      },
      {
        stream: {
          write: (message: string) => logger.log(message.trim()),
        },
        skip: (req, res) => req.method === 'OPTIONS' || res.statusCode === 304, // Ignorar OPTIONS y 304
      },
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(logger));

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.enableCors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});


  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Aplicación escuchando en el puerto ${port}`);
}
bootstrap();
