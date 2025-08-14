import { Injectable } from '@nestjs/common';
import { XRayDeviceDataDto } from '../signals/DTO/create-signal-consumer.dto';
import { CreateProcessedXRayDto } from '../signals/DTO/create-signal.dto';

@Injectable()
export class RabbitMQService {
  constructor() {}

  async processXRayData(message: XRayDeviceDataDto): Promise<CreateProcessedXRayDto> {
    const { deviceId, data, time } = message;

    const dataLength = data.length;

    const dataVolume = data.reduce((acc, record) => {
      if (record.coordinates) {
        return acc + Object.values(record.coordinates).length;
      }
      return acc;
    }, 0);

    const processedData: CreateProcessedXRayDto = {
      deviceId,
      time,
      dataLength,
      dataVolume,
      data: data.map(d => ({
        x: d.coordinates.latitude,
        y: d.coordinates.longitude,
        speed: d.coordinates.speed
      }))
    };

    return processedData;
  }
}
