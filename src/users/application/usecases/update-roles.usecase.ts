import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/usecase';
import { UserRoles } from '@/users/domain/entities/user.entity';

export namespace UpdateRolesUserUseCase {
  export type Input = {
    id: string;
    roles: UserRoles[];
  };

  type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id, roles } = input;

      if (!id || !roles) {
        throw new BadRequestError('Input data not provided');
      }

      const entity = await this.userRepository.findById(id);

      entity.updateRoles(roles);
      await this.userRepository.update(entity);
      return entity.toJSON();
    }
  }
}
