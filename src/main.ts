import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { parse } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
     origin: ['http://localhost:5173', 'https://frontend-vehiculos-production.up.railway.app'], 
    //origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  

  await app.listen(parseInt(process.env.PORT || '3000'));
}
bootstrap();
