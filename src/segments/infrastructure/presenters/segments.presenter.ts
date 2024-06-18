import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SegmentsOutput } from '@/segments/application/dtos/segments-output';
import { ListSegmentsUseCase } from '@/segments/application/usecases/listsegments.usecase';

export class SegmentPresenter {
  @ApiProperty({ description: 'Identificação do segmento' })
  id: string;

  @ApiProperty({ description: 'Nome do segmento' })
  segment: string;

  @ApiProperty({ description: 'Email do usuário' })
  is_published: boolean;

  @ApiProperty({ description: 'Data de criação do segmento' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última alteração realizada no segmento',
  })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  constructor(output: SegmentsOutput) {
    this.id = output.id;
    this.segment = output.segment;
    this.is_published = output.is_published;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
  }
}

export class SegmentsCollectionPresenter extends CollectionPresenter {
  data: SegmentPresenter[];

  constructor(output: ListSegmentsUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new SegmentPresenter(item));
  }
}
