import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const port = config.getOrThrow<number>('APP_PORT');
  
  app.useLogger(app.get(Logger));

  await app.listen(port);
}
bootstrap();
