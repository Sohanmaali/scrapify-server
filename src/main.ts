// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as express from 'express';
// import * as dotenv from 'dotenv';
// import { join } from 'path';
// import { CustomExceptionFilter } from '../src/cms/helper/custom-exception.filter';


// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use('/', express.static(join(process.cwd(), 'public', )));
//   app.useGlobalFilters(new CustomExceptionFilter());

//   app.enableCors({
//     origin: [
//       '*',
//       'http://localhost:3003',
//       'http://localhost:3000',

//       'http://192.168.31.127:3003',
//       "http://192.168.189.228:3000",
//       "http://192.168.189.92:3000",
//     ],
    
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   app.setGlobalPrefix('api');
//   app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

//   await app.listen(process.env.PORT);
//   console.log(`Server is running on Port ${process.env.PORT}`);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { CustomExceptionFilter } from '../src/cms/helper/custom-exception.filter';

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
      'http://localhost:3003',
      'http://localhost:3000',
      'http://192.168.31.127:3003',
      'http://192.168.189.228:3000',
      'http://192.168.189.92:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
   // Increase the body size limit
   app.use(bodyParser.json({ limit: '50mb' }));
   app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
 

  await app.listen(process.env.PORT);
  Logger.log(`Server is running on Port ${process.env.PORT}`, 'Bootstrap');
}
bootstrap();
