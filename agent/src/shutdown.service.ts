import { Injectable, OnApplicationShutdown, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(
    @Inject('EVENT_PUBLISHER') private readonly rabbitClient: ClientProxy, 
    // Inject the RabbitMQ client used to publish events
  ) {}

  /**
   * Handles graceful shutdown of the application.
   * This method is called automatically when the app is terminating,
   * either due to a signal (like SIGINT, SIGTERM) or programmatically.
   * @param signal Optional string indicating the shutdown signal (e.g., 'SIGINT')
   */
  async onApplicationShutdown(signal?: string) {
    console.log(`\n🔻 Agent service shutting down (signal: ${signal})`);

    try {
      // Close the RabbitMQ connection gracefully
      await this.rabbitClient.close();
      console.log('✅ RabbitMQ connection closed');
    } catch (err) {
      // Log any errors that occur while closing the connection
      console.log('❌ Error closing RabbitMQ:', err.message);
    }
  }
}
