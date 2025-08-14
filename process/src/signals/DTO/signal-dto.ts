import { IsString, IsArray, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class SignalDTO {

  @IsString()
  deviceId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  data: Array<[number, [number, number, number]]>;

  @IsNumber()
  time: number;

  @IsNumber()
  createdAt: number;
}
