import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Signal, SignalSchema } from './signal.schema';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }]),
  ],
  controllers: [SignalController],
  providers: [SignalService],
  exports: [SignalService]
})
export class SignalModule { }
