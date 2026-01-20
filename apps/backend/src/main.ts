import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Start server
  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Backend server running on: http://localhost:${port}/api`);
  console.log(`📊 Environment: ${configService.get('NODE_ENV')}`);
}

bootstrap();
