import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as requestIp from 'request-ip';
import * as bodyParser from 'body-parser';
import { MulterModule } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as ip3country from 'ip3country';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'fatal', 'log']
        : ['debug', 'error', 'log', 'fatal', 'warn', 'verbose'],
  });

  const origins = process.env.CORS_ORIGINS.split(',');
  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1');
  app.use(requestIp.mw());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(compression());

  MulterModule.register({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  });

  (BigInt.prototype as any).toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  ip3country.init();

  const port = process.env.PORT || 4000;
  console.log(`Port: ${port}`);
  await app.listen(port);
}

bootstrap();
