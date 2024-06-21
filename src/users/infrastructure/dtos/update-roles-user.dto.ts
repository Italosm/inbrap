import { UpdateRolesUserUseCase } from '@/users/application/usecases/update-roles.usecase';
import { UserRoles } from '@/users/domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateRolesUserDto
  implements Omit<UpdateRolesUserUseCase.Input, 'id'>
{
  @ApiProperty({
    description: 'Dado informado para filtrar o resultado pelo campo roles',
  })
  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @IsEnum(UserRoles, { each: true, message: 'Invalid role' })
  roles: UserRoles[] | null;
}
