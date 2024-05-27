import { GetUserUseCase } from '@/users/application/usecases/getuser.usecase';
import { IsUUID } from 'class-validator';

export class GetUserDto implements GetUserUseCase.Input {
  @IsUUID(4)
  id: string;
}
