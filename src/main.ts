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
import { CustomExceptionFilter } from './cms/helper/custom-exception.filter'; // Adjust the import path as needed
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  // Ensure the public directory exists
  const publicDirPath = join(process.cwd(), 'public');
  if (!fs.existsSync(publicDirPath)) {
    fs.mkdirSync(publicDirPath);
  }

  // Path to the index.html file
  const indexPath = path.join(publicDirPath, 'index.html');

  // Check if index.html exists; if not, create it dynamically
  if (!fs.existsSync(indexPath)) {
    const htmlContent = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>My Application</title>
        </head>
        <body>
          <h1>Welcome to My NestJS Application</h1>
          <p>This is a dynamically generated index.html file.</p>
        </body>
      </html>`;

    // Write the content to the index.html file
    fs.writeFileSync(indexPath, htmlContent, 'utf8');
    console.log('index.html file created dynamically!');
  } else {
    console.log('index.html file already exists!');
  }

  // Create the NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Enable only specific log levels
  });

  // Serve static files from the 'public' directory
  app.use('/', express.static(publicDirPath));

  // Global exception filter to handle errors
  app.useGlobalFilters(new CustomExceptionFilter());

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: [
      '*',
      "https://scrapify-admin.vercel.app",
      'http://localhost:3003',
      'http://localhost:3005',
      'http://localhost:3000',
      'http://192.168.31.127:3003',
      'http://192.168.111.92:3000',
      'http://192.168.189.228:3000',
      'http://192.168.189.92:3000',
      'http://192.168.43.92:3000',
      'http://192.168.43.92:3005',
      'http://192.168.111.92:3005',
      "http://192.168.210.92:3000",
      "http://192.168.210.92:3005",
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  // Use validation pipe globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Parse JSON and URL-encoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Increase the body size limit for large payloads
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Set the port and host from environment variables or use defaults
  const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
  const HOST = process.env.HOST || 'http://localhost'; // Default host

  // Start the application
  await app.listen(PORT);

  // Log the server URL and port
  Logger.log(`Server is running on ${HOST}:${PORT}/api`, 'Bootstrap');
}

// Invoke the bootstrap function to start the application
bootstrap();
