import { Injectable, Inject } from '@nestjs/common';
import { ProduceXRayDto, DataPointProducerDto, CoordinateProducerDto } from './signal.dto';
import { faker } from '@faker-js/faker';
import { Interval } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { WinstonLoggerService } from 'src/logger.service';

@Injectable()
export class SignalService {
  constructor(
    @Inject('EVENT_PUBLISHER') private readonly client: ClientProxy, // Inject the RabbitMQ client for publishing events
    private readonly logger: WinstonLoggerService // Custom logger service for logging messages
  ) {}

  /**
   * Generate fake X-ray device data for testing or simulation.
   * @returns ProduceXRayDto containing deviceId, timestamp, and an array of data points
   */
  generateXrayData(): ProduceXRayDto {
    const deviceId: string = faker.string.uuid(); // Generate a random UUID for device ID
    const timestamp: number = Date.now();         // Current timestamp in milliseconds

    // Generate random number of data points (between 1 and 10)
    const data: DataPointProducerDto[] = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => {
      // Generate random coordinates for each data point
      const coordinates: CoordinateProducerDto = {
        latitude: parseFloat(faker.location.latitude({ min: 51.339, max: 51.341 }).toFixed(6)),
        longitude: parseFloat(faker.location.longitude({ min: 12.338, max: 12.340 }).toFixed(6)),
        speed: parseFloat(faker.number.float({ min: 0.1, max: 3.5, fractionDigits: 4 }).toFixed(4)),
      };

      // Create a data point with a random time offset
      const dataPoint: DataPointProducerDto = {
        timeOffset: faker.number.int({ min: 0, max: 50000 }),
        coordinates,
      };
      return dataPoint;
    });

    return { deviceId, data, time: timestamp };
  }

  /**
   * Sends X-ray data periodically every 3 seconds.
   * Uses the @Interval decorator from @nestjs/schedule.
   */
  @Interval(3000)
  async sendXraySignal() {
    const xrayData = this.generateXrayData(); // Generate fake X-ray data
    this.logger.log(`📤 X-ray Message Sent: ${JSON.stringify(xrayData)}`); // Log the event
    this.client.emit('xray1', xrayData); // Publish the data to RabbitMQ with event pattern 'xray1'
  }
}
