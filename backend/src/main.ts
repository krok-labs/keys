import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/Application/module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  // Settings
  app.enableCors();

  await app.listen(3000);
};

bootstrap();
