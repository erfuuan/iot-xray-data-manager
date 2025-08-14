import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export interface ISignal extends Document {
  deviceId: string;
  time: number;
  dataLength: number;
  dataVolume: number;
  data: { x: number; y: number; speed: number }[];
  createdAt: Date;
  updatedAt?: Date;
}

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: false },
  versionKey: false,
})
export class Signal extends Document {
  @ApiProperty({ description: 'The unique device ID', example: '968c4eb9-1a9a-44a5-a4be-277de049c5c6' })
  @Prop({ required: true })
  deviceId: string;

  @ApiProperty({ description: 'The timestamp when the data was received', example: 1739450223904 })
  @Prop({ required: true })
  time: number;

  @ApiProperty({ description: 'Total number of data points', example: 5 })
  @Prop({ required: true })
  dataLength: number;

  @ApiProperty({ description: 'Sum of all speed values', example: 25.347 })
  @Prop({ required: true })
  dataVolume: number;

  @ApiProperty({ description: 'Array of x-ray data points' })
  @Prop({ required: true, type: [{ x: Number, y: Number, speed: Number }], _id: false })
  data: { x: number; y: number; speed: number }[];

  @ApiProperty({ description: 'Timestamp of creation', example: '2025-02-13T15:00:37.975Z' })
  @Prop()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of last update', example: '2025-02-13T15:00:37.975Z' })
  @Prop()
  updatedAt?: Date;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);

SignalSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});