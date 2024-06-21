import { UpdateStatusUserUseCase } from '@/users/application/usecases/update-status.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateStatusUserDto
  implements Omit<UpdateStatusUserUseCase.Input, 'id'>
{
  @ApiProperty({
    description: 'Dado informado para filtrar o resultado pelo campo status',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : null,
  )
  status: boolean;
}
