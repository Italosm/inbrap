import { Module } from '@nestjs/common';
import { SegmentsController } from './segments.controller';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { SegmentsPrismaRepository } from './database/prisma/repositories/segments-prisma.repository';
import { CreateSegmentUseCase } from '../application/usecases/createsegment.usecase';
import { SegmentsRepository } from '../domain/repositories/segments.repository';

@Module({
  controllers: [SegmentsController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'SegmentsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new SegmentsPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateSegmentUseCase.UseCase,
      useFactory: (segmentsRepository: SegmentsRepository.Repository) => {
        return new CreateSegmentUseCase.UseCase(segmentsRepository);
      },
      inject: ['SegmentsRepository'],
    },
    // {
    //   provide: GetUserUseCase.UseCase,
    //   useFactory: (userRepository: UserRepository.Repository) => {
    //     return new GetUserUseCase.UseCase(userRepository);
    //   },
    //   inject: ['UserRepository'],
    // },
    // {
    //   provide: ListUsersUseCase.UseCase,
    //   useFactory: (userRepository: UserRepository.Repository) => {
    //     return new ListUsersUseCase.UseCase(userRepository);
    //   },
    //   inject: ['UserRepository'],
    // },
  ],
})
export class SegmentsModule {}
