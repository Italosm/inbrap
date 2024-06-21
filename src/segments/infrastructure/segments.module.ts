import { Module } from '@nestjs/common';
import { SegmentsController } from './segments.controller';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { SegmentsPrismaRepository } from './database/prisma/repositories/segments-prisma.repository';
import { CreateSegmentUseCase } from '../application/usecases/createsegment.usecase';
import { SegmentsRepository } from '../domain/repositories/segments.repository';
import { ListSegmentsUseCase } from '../application/usecases/listsegments.usecase';
import { GetSegmentsUseCase } from '../application/usecases/getsegment.usecase';

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
    {
      provide: GetSegmentsUseCase.UseCase,
      useFactory: (segmentsRepository: SegmentsRepository.Repository) => {
        return new GetSegmentsUseCase.UseCase(segmentsRepository);
      },
      inject: ['SegmentsRepository'],
    },
    {
      provide: ListSegmentsUseCase.UseCase,
      useFactory: (segmentsRepository: SegmentsRepository.Repository) => {
        return new ListSegmentsUseCase.UseCase(segmentsRepository);
      },
      inject: ['SegmentsRepository'],
    },
  ],
})
export class SegmentsModule {}
