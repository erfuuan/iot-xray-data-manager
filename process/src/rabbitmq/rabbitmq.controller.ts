import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { XRayDeviceDataDto } from '../signals/DTO/create-signal-consumer.dto'
import { SignalService } from '../signals/signal.service'
import { WinstonLoggerService } from '../logger.service'
import { RabbitMQService } from './rabbitmq.service';
@Controller()
export class rabbitmqController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly signalService: SignalService,
    private readonly logger: WinstonLoggerService
  ) { }

  @MessagePattern('xray1')
  async handleEventCreated(@Payload() event:  XRayDeviceDataDto) {
    this.logger.log(`🚀 Message received: ${JSON.stringify(event)}`);
    const data = await this.rabbitMQService.processXRayData(event)
    await this.signalService.create(data)
  }
}