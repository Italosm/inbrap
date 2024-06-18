import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ListSegmentsUseCase } from '@/segments/application/usecases/listsegments.usecase';

export class ListSegmentsDto implements ListSegmentsUseCase.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  @IsOptional()
  @IsNotEmpty()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página' })
  @IsOptional()
  @IsNotEmpty()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Coluna definida para ordenar os dados: "name" ou "createdAt"',
    enum: ['name', 'createdAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsIn(['name', 'createdAt'])
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Ordenação dos dados: crescente ou decrescente',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: SortDirection;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado pelo campo nome',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  segments?: string;

  @ApiPropertyOptional({
    description:
      'Dado informado para filtrar o resultado pelo campo is_published',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : null,
  )
  is_published?: boolean | null;
}
