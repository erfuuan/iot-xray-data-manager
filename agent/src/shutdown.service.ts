import { Injectable, OnApplicationShutdown, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(
    @Inject('EVENT_PUBLISHER') private readonly rabbitClient: ClientProxy,
  ) {}

  async onApplicationShutdown(signal?: string) {
    console.log(`\n🔻 Agent service shutting down (signal: ${signal})`);

    try {
      await this.rabbitClient.close();
      console.log('✅ RabbitMQ connection closed');
    } catch (err) {
      console.error('❌ Error closing RabbitMQ:', err.message);
    }
  }
}
