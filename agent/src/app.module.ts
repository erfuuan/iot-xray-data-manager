import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SignalService } from './signals/signal.service';
import { WinstonLoggerService } from './logger.service';
import { ShutdownService } from './shutdown.service';

@Module({
  imports: [
    // Initialize the schedule module for cron jobs and periodic tasks
    ScheduleModule.forRoot(),

    // Load environment variables and validate them
    ConfigModule.forRoot({
      envFilePath: '.env', // Specify which .env file to load
      load: [],            // Optional: can load custom configuration files
      validationSchema: Joi.object({
        RABBITMQ_URL: Joi.string().uri().required().label('RabbitMQ URL'), // Validate that RabbitMQ URL exists and is a valid URI
      }),
    }),

    // Register microservice clients asynchronously
    ClientsModule.registerAsync([
      {
        name: 'EVENT_PUBLISHER', // Name to inject this client elsewhere using @Inject('EVENT_PUBLISHER')
        imports: [ConfigModule], // Import ConfigModule to access environment variables
        inject: [ConfigService], // Inject ConfigService into useFactory
        useFactory: async (configService: ConfigService) => {
          const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
          const queue = configService.get<string>('RABBITMQ_QUEUE');

          // Throw error if configuration is missing
          if (!rabbitMqUrl || !queue) {
            throw new Error('RabbitMQ configuration is missing in the environment file.');
          }

          // Return the RMQ transport options for this client
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl],        // RabbitMQ connection URL
              queue: queue,               // Queue name to listen to or publish
              queueOptions: { durable: false }, // Set durable to false (queue won't survive broker restart)
            },
          };
        },
      },
    ]),
  ],

  // Register application-wide providers
  providers: [
    SignalService,       // Handles signal processing logic
    WinstonLoggerService, // Custom logger service
    ShutdownService       // Graceful shutdown handling service
  ],
})
export class AppModule {}
