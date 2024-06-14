import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email: string;
}
