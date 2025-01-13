// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe, Logger } from '@nestjs/common';
// import * as express from 'express';
// import * as dotenv from 'dotenv';
// import { join } from 'path';
// import * as bodyParser from 'body-parser';
// import { CustomExceptionFilter } from '../src/cms/helper/custom-exception.filter';

// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     logger: ['error', 'warn'], // Enable only specific log levels
//   });

//   app.use('/', express.static(join(process.cwd(), 'public')));
//   app.useGlobalFilters(new CustomExceptionFilter());


//   app.enableCors({
//     origin: [
//       '*',
//       "https://scrapify-admin.vercel.app",
//       'http://localhost:3003',
//       'http://localhost:3005',
//       'http://localhost:3000',
//       'http://192.168.31.127:3003',
//       'http://192.168.111.92:3000',
//       'http://192.168.189.228:3000',
//       'http://192.168.189.92:3000',
//       'http://192.168.43.92:3000',
//       'http://192.168.43.92:3005',
//       'http://192.168.111.92:3005',
//       "http://192.168.210.92:3000",
//       "http://192.168.210.92:3005",
      
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   app.setGlobalPrefix('api');
//   app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
//    // Increase the body size limit
//    app.use(bodyParser.json({ limit: '50mb' }));
//    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
 

//    const PORT = process.env.PORT || 5000; // Default to 3000 if PORT is not set

//    const HOST = process.env.HOST || 'http://localhost'; // Default host


//   await app.listen(process.env.PORT);
//   console.log(`Server is running on ${HOST}:${PORT}/api`, 'Bootstrap');
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { CustomExceptionFilter } from './cms/helper/custom-exception.filter';
import { VercelRequest, VercelResponse } from '@vercel/node'; // Vercel-specific types

dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Enable only specific log levels
  });

  // Serve static files if needed
  app.use('/', express.static(join(process.cwd(), 'public')));
  app.useGlobalFilters(new CustomExceptionFilter());

  app.enableCors({
    origin: ['*', 'https://scrapify-admin.vercel.app', 'http://localhost:3003', 'http://localhost:3000'],
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

  // We don't need to call app.listen() for Vercel
  return app;
}

// Vercel handler export
export default async (req: VercelRequest, res: VercelResponse) => {
  const app = await bootstrap();  // Bootstrap NestJS application
  const expressApp = app.getHttpAdapter().getInstance();  // Get the express instance
  expressApp(req, res);  // Handle the request
};
