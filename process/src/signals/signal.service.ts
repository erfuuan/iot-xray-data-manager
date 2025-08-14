import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISignal, Signal } from './signal.schema';
import { UpdateProcessedXRayDto } from './DTO/update-signal.dto';
import { CreateProcessedXRayDto } from './DTO/create-signal.dto';
import { PaginationQueryDto } from './DTO/pagination.dto'
@Injectable()
export class SignalService {
  constructor(@InjectModel('Signal') private signalModel: Model<ISignal>,
  ) { }
  async create(createSignalDto: CreateProcessedXRayDto) {
    const signal = new this.signalModel(createSignalDto);
    await signal.save()
    return signal;
  }

  async findAll(): Promise<Signal[]> {
    return this.signalModel.find().exec();
  }


  async findAllWithPagination(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;
  
    const [signals, total] = await Promise.all([
      this.signalModel.find().skip(skip).limit(limit),
      this.signalModel.countDocuments(),
    ]);
  
    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  
    return {
      meta,
      data: signals,
    };
  }
  
  async findOne(id: string): Promise<Signal | null> {
    return this.signalModel.findById(id).exec();
  }

  async update(id: string, updateSignalDto: UpdateProcessedXRayDto): Promise<Signal | null> {
    return this.signalModel.findByIdAndUpdate(id, updateSignalDto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.signalModel.findByIdAndDelete(id).exec();
  }
}
