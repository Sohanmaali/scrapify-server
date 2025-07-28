import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { CustomExceptionFilter } from './cms/helper/custom-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Enable only specific log levels
  });

  app.use('/', express.static(join(process.cwd(), 'public')));
  app.useGlobalFilters(new CustomExceptionFilter());


  app.enableCors({
    origin: [
      '*',
      "https://scrapify-ui.vercel.app",
      "https://scrapify-admin-ui.vercel.app",
      'http://localhost:3003',
      'http://localhost:3005',
      'http://localhost:3000',
    
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


  const PORT = process.env.PORT || 5000; // Default to 3000 if PORT is not set

  const HOST = process.env.HOST || 'http://localhost'; // Default host


  await app.listen(process.env.PORT);
  console.log(`Server is running on ${HOST}:${PORT}/api`, 'Bootstrap');
}
bootstrap();
