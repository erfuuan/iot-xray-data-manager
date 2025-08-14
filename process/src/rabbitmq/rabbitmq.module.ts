import { Module } from '@nestjs/common';
import { rabbitmqController } from './rabbitmq.controller'
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQService } from './rabbitmq.service'
import { Signal, SignalSchema } from '../signals/signal.schema'
import { SignalService } from '../signals/signal.service'
import { WinstonLoggerService } from 'src/logger.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }]),
  ],
  controllers: [rabbitmqController],
  providers: [RabbitMQService, SignalService, WinstonLoggerService],
  exports: [RabbitMQService],
})
export class RabbitMQModule { }