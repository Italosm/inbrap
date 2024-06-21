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
import { GetSegmentsUseCase } from '../application/usecases/getsegment.usecase';
import { Roles } from '@/shared/infrastructure/decorators/roles.decorator';
import { UserRoles } from '@/users/domain/entities/user.entity';

@Controller('segments')
export class SegmentsController {
  @Inject(CreateSegmentUseCase.UseCase)
  private createSegmentUseCase: CreateSegmentUseCase.UseCase;

  @Inject(ListSegmentsUseCase.UseCase)
  private listSegmentsUseCase: ListSegmentsUseCase.UseCase;

  @Inject(GetSegmentsUseCase.UseCase)
  private getSegmentsUseCase: GetSegmentsUseCase.UseCase;

  static SegmentsToResponse(output: SegmentsOutput) {
    return new SegmentPresenter(output);
  }

  static listSegmentsToResponse(output: ListSegmentsUseCase.Output) {
    return new SegmentsCollectionPresenter(output);
  }

  @Roles(UserRoles.ADMIN)
  @Post()
  async create(@Body() createSegmentDto: CreateSegmentDto) {
    const output = await this.createSegmentUseCase.execute(createSegmentDto);
    return SegmentsController.SegmentsToResponse(output);
  }

  @Roles(UserRoles.USER)
  @Get()
  async findAll(@Query() searchParams: ListSegmentsDto) {
    const output = await this.listSegmentsUseCase.execute(searchParams);
    return SegmentsController.listSegmentsToResponse(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getSegmentsUseCase.execute({ id });
    return SegmentsController.SegmentsToResponse(output);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSegmentDto: UpdateSegmentDto) {
  //   return this.segmentsService.update(+id, updateSegmentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.segmentsService.remove(+id);
  // }
}
