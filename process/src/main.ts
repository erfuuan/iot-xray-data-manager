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
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Get the custom Winston logger service
  const logger = app.get(WinstonLoggerService);

  // Enable shutdown hooks for graceful termination
  app.enableShutdownHooks();

  // Set global prefix for all routes (e.g., /api/v1/...)
  app.setGlobalPrefix('api/v1');

  // Add basic security headers using Helmet
  app.use(helmet());

  // HTTP request logging
  app.use(morgan('combined'));

  // Enable CORS for all origins and common HTTP methods
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Enable global validation for incoming requests
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // Strip unknown properties
    forbidNonWhitelisted: true,   // Throw error if extra fields are present
    transform: true,              // Auto-transform payloads to DTO instances
  }));

  // Read configuration from environment
  const configService = app.get(ConfigService);
  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
  const queue = configService.get<string>('RABBITMQ_QUEUE');

  if (!rabbitMqUrl || !queue) {
    throw new Error('RabbitMQ configuration is missing in the environment file.');
  }

  logger.log('Starting RabbitMQ Consumer...');

  // Connect the app as a microservice to RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],       // RabbitMQ server URL
      queue: queue,              // Queue to consume messages from
      queueOptions: { durable: false }, // Non-durable queue (not persisted)
    },
  });

  // Start all connected microservices
  await app.startAllMicroservices();
  logger.log(`✔️ RabbitMQ Consumer connected to queue: ${queue}`);

  // Setup Swagger for API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description for the service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Start HTTP server on port 3000
  await app.listen(3000);
  logger.log('🚀 Application Process started');
}

bootstrap();
