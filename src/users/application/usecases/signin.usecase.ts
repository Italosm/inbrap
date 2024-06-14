import { UserRepository } from '@/users/domain/repositories/user.repository';
import { BadRequestError } from '../../../shared/application/errors/bad-request-error';
import { HashProvider } from '@/shared/application/providers/hash-provider.interface';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/usecase';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/auth/infrastructure/auth.service';

export namespace SigninUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = UserOutput & { token: string };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
      private authService: AuthService,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, password } = input;

      if (!email || !password) {
        throw new BadRequestError('Input data not provided');
      }

      const entity = await this.userRepository.findByEmail(email);

      if (!entity.status) {
        throw new UnauthorizedException();
      }

      const hashPasswordMatches = await this.hashProvider.compareHash(
        password,
        entity.password,
      );

      if (!hashPasswordMatches) {
        throw new InvalidCredentialsError('Invalid credentials');
      }

      const user = UserOutputMapper.toOutput(entity);
      const token = await this.authService.generateJwt(user.id);
      return { ...user, token };
    }
  }
}
