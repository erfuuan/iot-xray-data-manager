import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CoordinateProducerDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  speed: number;
}

export class DataPointProducerDto {
  @IsNumber()
  timeOffset: number;

  @ValidateNested()
  @Type(() => CoordinateProducerDto)
  coordinates: CoordinateProducerDto;
}

export class ProduceXRayDto {
  @IsString()
  deviceId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataPointProducerDto)
  data: DataPointProducerDto[];

  @IsNumber()
  time: number;
}
