import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/usecase';
import { SegmentsOutput } from '../dtos/segments-output';
import { SegmentsRepository } from '@/segments/domain/repositories/segments.repository';
import { SegmentEntity } from '@/segments/domain/entities/segment.entity';

export namespace CreateSegmentUseCase {
  export type Input = {
    segment: string;
    is_published?: boolean;
  };

  type Output = SegmentsOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private segmentsRepository: SegmentsRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { segment } = input;

      if (!segment) {
        throw new BadRequestError('Input data not provided');
      }

      await this.segmentsRepository.segmentExists(segment);

      const entity = new SegmentEntity(input);

      await this.segmentsRepository.insert(entity);
      return entity.toJSON();
    }
  }
}
