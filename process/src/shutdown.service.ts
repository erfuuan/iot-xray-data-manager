import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(
    private readonly rabbitService: RabbitMQService,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  async onApplicationShutdown(signal?: string) {
    console.log(`\n🔻 Process service shutting down (signal: ${signal})`);

    try {
      if (this.rabbitService && this.rabbitService['client']) {
        await this.rabbitService['client'].close?.();
        console.log('✅ RabbitMQ connection closed');
      }
    } catch (err) {
      console.error('❌ Error closing RabbitMQ:', err.message);
    }

    try {
      if (this.mongoConnection) {
        await this.mongoConnection.close();
        console.log('✅ MongoDB connection closed');
      }
    } catch (err) {
      console.error('❌ Error closing MongoDB:', err.message);
    }
  }
}
