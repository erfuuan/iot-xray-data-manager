import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';

@Module({
  imports: [],
  providers: [SignalService],
  exports: [SignalService],

})
export class SignalModule { }