import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files from the `public` folder
  // app.use('/uploads', express.static('public/uploads'));
  app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')));

  app.enableCors({
    origin: [
      '*',
      'http://localhost:3003',
      'http://localhost:3000',

      'http://192.168.31.127:3003',
      "http://192.168.189.228:3000",
      "http://192.168.189.92:3000",
    ],
    
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

  await app.listen(process.env.PORT);
  console.log(`Server is running on Port ${process.env.PORT}`);
}
bootstrap();
