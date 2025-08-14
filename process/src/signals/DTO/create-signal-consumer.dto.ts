import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CoordinateDto {
  @ApiProperty({ description: 'Latitude coordinate', example: 51.339764 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate', example: 12.339223833333334 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'Speed in meters/second', example: 1.2038 })
  @IsNumber()
  speed: number;
}

export class DataPointDto {
  @ApiProperty({ description: 'Time offset in ms from base timestamp', example: 762 })
  @IsNumber()
  timeOffset: number;

  @ApiProperty({ description: 'Coordinates and speed info', type: CoordinateDto })
  @ValidateNested()
  @Type(() => CoordinateDto)
  coordinates: CoordinateDto;
}

export class XRayDeviceDataDto {
  @ApiProperty({ description: 'Unique device ID', example: '66bb584d4ae73e488c30a072' })
  @IsString()
  deviceId: string;

  @ApiProperty({ description: 'Array of data points', type: [DataPointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataPointDto)
  data: DataPointDto[];

  @ApiProperty({ description: 'Base timestamp in ms', example: 1735683480000 })
  @IsNumber()
  time: number;
}
