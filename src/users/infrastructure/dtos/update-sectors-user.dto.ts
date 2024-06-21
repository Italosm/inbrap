import { UpdateSectorsUserUseCase } from '@/users/application/usecases/update-sectors.usecase';
import { UserSectors } from '@/users/domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateSectorsUserDto
  implements Omit<UpdateSectorsUserUseCase.Input, 'id'>
{
  @ApiProperty({
    description: 'Atualização dos setores do usuário',
  })
  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @IsEnum(UserSectors, { each: true, message: 'Invalid sector' })
  sectors: UserSectors[] | null;
}
