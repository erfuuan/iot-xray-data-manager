import { Injectable, Inject } from '@nestjs/common';
import { ProduceXRayDto, DataPointProducerDto, CoordinateProducerDto } from './signal.dto';
import { faker } from '@faker-js/faker';
import { Interval } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { WinstonLoggerService } from 'src/logger.service';

@Injectable()
export class SignalService {
  constructor(
    @Inject('EVENT_PUBLISHER') private readonly client: ClientProxy,
    private readonly logger: WinstonLoggerService
  ) {}

  generateXrayData(): ProduceXRayDto {
    const deviceId: string = faker.string.uuid();
    const timestamp: number = Date.now();

    const data: DataPointProducerDto[] = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => {
      const coordinates: CoordinateProducerDto = {
        latitude: parseFloat(faker.location.latitude({ min: 51.339, max: 51.341 }).toFixed(6)),
        longitude: parseFloat(faker.location.longitude({ min: 12.338, max: 12.340 }).toFixed(6)),
        speed: parseFloat(faker.number.float({ min: 0.1, max: 3.5, fractionDigits: 4 }).toFixed(4)),
      };
      const dataPoint: DataPointProducerDto = {
        timeOffset: faker.number.int({ min: 0, max: 50000 }),
        coordinates,
      };
      return dataPoint;
    });

    return { deviceId, data, time: timestamp };
  }

  @Interval(3000)
  async sendXraySignal() {
    const xrayData = this.generateXrayData();
    this.logger.log(`📤 X-ray Message Sent: ${JSON.stringify(xrayData)}`);
    this.client.emit('xray1', xrayData);
  }
}
