import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
// import { UpdateSegmentDto } from './dto/update-segment.dto';
import { CreateSegmentUseCase } from '../application/usecases/createsegment.usecase';
import { SegmentsOutput } from '../application/dtos/segments-output';
import {
  SegmentPresenter,
  SegmentsCollectionPresenter,
} from './presenters/segments.presenter';
import { ListSegmentsUseCase } from '../application/usecases/listsegments.usecase';
import { ListSegmentsDto } from './dto/listsegments.dto';

@Controller('segments')
export class SegmentsController {
  @Inject(CreateSegmentUseCase.UseCase)
  private createSegmentUseCase: CreateSegmentUseCase.UseCase;

  @Inject(ListSegmentsUseCase.UseCase)
  private listSegmentsUseCase: ListSegmentsUseCase.UseCase;

  static SegmentsToResponse(output: SegmentsOutput) {
    return new SegmentPresenter(output);
  }

  static listSegmentsToResponse(output: ListSegmentsUseCase.Output) {
    return new SegmentsCollectionPresenter(output);
  }

  @Post()
  async create(@Body() createSegmentDto: CreateSegmentDto) {
    const output = await this.createSegmentUseCase.execute(createSegmentDto);
    return SegmentsController.SegmentsToResponse(output);
  }

  @Get()
  async findAll(@Query() searchParams: ListSegmentsDto) {
    const output = await this.listSegmentsUseCase.execute(searchParams);
    return SegmentsController.listSegmentsToResponse(output);
  }

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
