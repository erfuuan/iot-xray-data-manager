import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { WinstonLoggerService } from './logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLoggerService);

  app.enableShutdownHooks(); 

  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.use(morgan('combined'));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const configService = app.get(ConfigService);
  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
  const queue = configService.get<string>('RABBITMQ_QUEUE');

  if (!rabbitMqUrl || !queue) { throw new Error('RabbitMQ configuration is missing in the environment file.') }

  logger.log('Starting RabbitMQ Consumer...');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: queue,
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  logger.log(`✔️ RabbitMQ Consumer connected to queue: ${queue}`);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description for the service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  logger.log('🚀 Application Proccess started');
}

bootstrap()