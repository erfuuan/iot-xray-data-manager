import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, Query } from '@nestjs/common';
import { SignalService } from './signal.service';
import { CreateProcessedXRayDto } from './DTO/create-signal.dto';
import { UpdateProcessedXRayDto } from './DTO/update-signal.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FindSignalDto } from './DTO/getOne-signal.dto';
import { PaginationQueryDto } from './DTO/pagination.dto';
import { Signal } from './signal.schema';

@ApiTags('Signals')
@Controller('signals')
export class SignalController {
  constructor(private readonly signalService: SignalService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new signal' })
  @ApiBody({ type: CreateProcessedXRayDto })
  @ApiResponse({ status: 201, description: 'The signal has been successfully created.', type: Signal })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@Body() createSignalDto: CreateProcessedXRayDto): Promise<Signal> {
    return this.signalService.create(createSignalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of signals' })
  @ApiResponse({ status: 200, description: 'The list of signals with pagination.', type: PaginationQueryDto })
  @ApiResponse({ status: 404, description: 'No signals found.' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationQueryDto> {
    return this.signalService.findAllWithPagination(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a signal by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The unique ID of the signal' })
  @ApiResponse({ status: 200, description: 'The signal was found.', type: Signal })
  @ApiResponse({ status: 404, description: 'Signal not found' })
  async getSignalById(@Param() params: FindSignalDto): Promise<Signal> {
    const { id } = params;
    const signal = await this.signalService.findOne(id);
    if (!signal) {
      throw new NotFoundException(`Signal with ID ${id} not found`);
    }
    return signal;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing signal' })
  @ApiParam({ name: 'id', type: String, description: 'The unique ID of the signal to update' })
  @ApiBody({ type: UpdateProcessedXRayDto })
  @ApiResponse({ status: 200, description: 'The signal has been successfully updated.', type: Signal })
  @ApiResponse({ status: 404, description: 'Signal not found' })
  async update(
    @Param() params: FindSignalDto,
    @Body() updateSignalDto: UpdateProcessedXRayDto,
  ): Promise<Signal | null> {
    const { id } = params;
    const signal = await this.signalService.findOne(id);
    if (!signal) {
      throw new NotFoundException(`Signal with ID ${id} not found`);
    }
    return this.signalService.update(id, updateSignalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a signal by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The unique ID of the signal to delete' })
  @ApiResponse({ status: 200, description: 'The signal has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Signal not found' })
  async remove(@Param() params: FindSignalDto): Promise<void> {
    const { id } = params;
    return this.signalService.remove(id);
  }
}
