// pagination-meta.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}


export class PaginatedResultDto<T> {
  @ApiProperty()
  meta: PaginationMetaDto;

  @ApiProperty({ isArray: true })
  data: T[];
}
