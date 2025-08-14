import { PartialType } from '@nestjs/swagger';
import { CreateProcessedXRayDto } from './create-signal.dto';

export class UpdateProcessedXRayDto extends PartialType(CreateProcessedXRayDto) {}

