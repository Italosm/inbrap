import { HashProvider } from '@/shared/application/providers/hash-provider.interface';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };

  export class UseCase {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, name, password } = input;

      if (!email || !name || !password) {
        throw new BadRequestError('Input data not provided');
      }

      const emailExists = await this.userRepository.findByEmail(email);

      if (emailExists) throw new ConflictError('Email address already used');

      const hashPassword = await this.hashProvider.generateHash(password);

      const entity = new UserEntity({ ...input, password: hashPassword });

      await this.userRepository.insert(entity);
      return entity.toJSON();
    }
  }
}
