import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { CreateSegmentUseCase } from '../application/usecases/createsegment.usecase';

@Controller('segments')
export class SegmentsController {
  @Inject(CreateSegmentUseCase.UseCase)
  private createSegmentUseCase: CreateSegmentUseCase.UseCase;

  @Post()
  create(@Body() createSegmentDto: CreateSegmentDto) {
    return this.createSegmentUseCase.execute(createSegmentDto);
  }

  // @Get()
  // findAll() {
  //   return this.segmentsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.segmentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSegmentDto: UpdateSegmentDto) {
  //   return this.segmentsService.update(+id, updateSegmentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.segmentsService.remove(+id);
  // }
}
