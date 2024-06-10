import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/Application/module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  // Settings
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, "0.0.0.0");
};

bootstrap();
