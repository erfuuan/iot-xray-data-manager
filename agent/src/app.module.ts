import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SignalService } from './signals/signal.service'
import { WinstonLoggerService } from './logger.service';
import { ShutdownService } from './shutdown.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [],
      validationSchema: Joi.object({
        RABBITMQ_URL: Joi.string().uri().required().label('RabbitMQ URL'),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'EVENT_PUBLISHER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
          const queue = configService.get<string>('RABBITMQ_QUEUE');

          if (!rabbitMqUrl || !queue) { throw new Error('RabbitMQ configuration is missing in the environment file.') }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl],
              queue: queue,
              queueOptions: { durable: false }, 
            },
          };
        },
      },
    ]),
  ],

  providers: [SignalService, WinstonLoggerService,ShutdownService],
})

export class AppModule { }
