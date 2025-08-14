import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalModule } from './signals/signal.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module'
import { RabbitMQService } from './rabbitmq/rabbitmq.service'
import { WinstonLoggerService } from './logger.service'
import { ShutdownService } from './shutdown.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService]
    }),
    SignalModule,
    RabbitMQModule
  ],
  providers: [
    WinstonLoggerService,
    RabbitMQService,
    ShutdownService,
  ],
  controllers: [],
})
export class AppModule {}
