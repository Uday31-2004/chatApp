import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL]
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });



  // Secure HTTP headers
  app.use(helmet());

  // Accept cookies (refresh tokens)
  app.use(cookieParser());

  // Validate incoming DTOs globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // strip unknown fields
      forbidNonWhitelisted: false,
      transform: true,           // auto-transform to DTO classes
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
