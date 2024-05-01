import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/Application/module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, { cors: true });
  await app.listen(3001);
};

bootstrap();
