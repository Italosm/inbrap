import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListUsersDto implements ListUsersUseCase.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Coluna definida para ordenar os dados: "name" ou "createdAt"',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Ordenação dos dados: crescente ou decrescente',
  })
  @IsOptional()
  sortDir?: SortDirection;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado',
  })
  @IsOptional()
  filter?: string;
}
