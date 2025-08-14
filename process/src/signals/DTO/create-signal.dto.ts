import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessedDataPoint {
  @ApiProperty({ description: 'X coordinate (latitude)', example: 51.339764 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y coordinate (longitude)', example: 12.339223833333334 })
  @IsNumber()
  y: number;

  @ApiProperty({ description: 'Speed in meters/second', example: 1.2038 })
  @IsNumber()
  speed: number;
}

export class CreateProcessedXRayDto {
  @ApiProperty({ description: 'Unique device ID', example: '66bb584d4ae73e488c30a072' })
  @IsString()
  deviceId: string;

  @ApiProperty({ description: 'Base timestamp in ms', example: 1735683480000 })
  @IsNumber()
  time: number;

  @ApiProperty({ description: 'Array of processed coordinates', type: [ProcessedDataPoint] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessedDataPoint)
  data: ProcessedDataPoint[];

  @ApiProperty({ description: 'Total number of records', example: 11 })
  @IsNumber()
  dataLength: number;

  @ApiProperty({ description: 'Total volume of numeric values in all coordinate arrays', example: 33 })
  @IsNumber()
  dataVolume: number;
}