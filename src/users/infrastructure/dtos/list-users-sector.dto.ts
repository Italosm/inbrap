import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsersBySectorUseCase } from '@/users/application/usecases/listusersbysector.usecase';
import {
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRoles } from '@/users/domain/entities/user.entity';

export class ListUsersSectorDto implements ListUsersBySectorUseCase.Input {
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
  name?: string;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado pelo campo email',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado pelo campo status',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : null,
  )
  status?: boolean | null;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado pelo campo roles',
  })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @IsEnum(UserRoles, { each: true, message: 'Invalid role' })
  role?: UserRoles[] | null;
}
