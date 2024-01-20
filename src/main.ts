import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = app.get(ConfigService);
  const port = config.get('PORT');

  /**PIPE */
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
