import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider';
import { HashProvider } from '@/shared/application/providers/hash-provider.interface';
import { UserRepository } from '../domain/repositories/user.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository';
import { GetUserUseCase } from '../application/usecases/getuser.usecase';
import { ListUsersUseCase } from '../application/usecases/listusers.usecase';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { GetMeUseCase } from '../application/usecases/getme.usecase';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { ListUsersBySectorUseCase } from '../application/usecases/listusersbysector.usecase';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SignupUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SignupUseCase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
        authService: AuthService,
      ) => {
        return new SigninUseCase.UseCase(
          userRepository,
          hashProvider,
          authService,
        );
      },
      inject: ['UserRepository', 'HashProvider', AuthService],
    },
    {
      provide: GetMeUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetMeUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsersUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersBySectorUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsersBySectorUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
  exports: ['UserRepository'],
})
export class UsersModule {}
