import { Injectable } from '@nestjs/common';
import { XRayDeviceDataDto } from '../signals/DTO/create-signal-consumer.dto';
import { CreateProcessedXRayDto } from '../signals/DTO/create-signal.dto';

@Injectable()
export class RabbitMQService {
  constructor() {}

  /**
   * Processes raw X-ray device data from RabbitMQ and transforms it
   * into a structured format suitable for storage or further processing.
   *
   * @param message - The raw data received from the device
   * @returns Processed and summarized X-ray data
   */
  async processXRayData(message: XRayDeviceDataDto): Promise<CreateProcessedXRayDto> {
    const { deviceId, data, time } = message; // Destructure input data

    // Count total number of data points in the message
    const dataLength = data.length;

    // Count total number of numeric values inside all coordinate objects
    const dataVolume = data.reduce((acc, record) => {
      if (record.coordinates) {
        return acc + Object.values(record.coordinates).length;
      }
      return acc;
    }, 0);

    // Transform raw data into processed format
    const processedData: CreateProcessedXRayDto = {
      deviceId,      // Device identifier
      time,          // Base timestamp
      dataLength,    // Total number of records
      dataVolume,    // Total numeric entries in coordinates
      data: data.map(d => ({
        x: d.coordinates.latitude,  // X coordinate
        y: d.coordinates.longitude, // Y coordinate
        speed: d.coordinates.speed  // Speed in meters/second
      }))
    };

    return processedData; // Return structured DTO
  }
}
