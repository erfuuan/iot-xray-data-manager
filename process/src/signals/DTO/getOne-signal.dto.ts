import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindSignalDto {
  @ApiProperty({
    description: 'The unique ID of the signal (MongoDB ObjectId)',
    example: '60d7b5f08a5f6e001f3b18d9',
  })
  @IsMongoId()
  id: string;
}
