import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/usecase';

export namespace UpdateStatusUserUseCase {
  export type Input = {
    id: string;
    status: boolean;
  };

  type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id, status } = input;

      if (!id || status === undefined || status === null) {
        throw new BadRequestError('Input data not provided');
      }

      const entity = await this.userRepository.findById(id);

      entity.updateStatus(status);
      await this.userRepository.update(entity);
      return entity.toJSON();
    }
  }
}
