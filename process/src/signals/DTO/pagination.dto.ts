import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number (starting from 1)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by device ID', example: '66bb584d4ae73e488c30a072' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Filter by start timestamp (ms)', example: 1735683480000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  startTime?: number;

  @ApiPropertyOptional({ description: 'Filter by end timestamp (ms)', example: 1735683485000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  endTime?: number;

  @ApiPropertyOptional({ description: 'Sort by field, e.g., time', example: 'time' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'time';

  @ApiPropertyOptional({ description: 'Sort direction', example: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
