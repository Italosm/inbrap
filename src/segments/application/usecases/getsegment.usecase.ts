import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { SegmentsRepository } from '@/segments/domain/repositories/segments.repository';
import { SegmentsOutput } from '../dtos/segments-output';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/usecase';

export namespace GetSegmentsUseCase {
  export type Input = {
    id: string;
  };

  type Output = SegmentsOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private segmentsRepository: SegmentsRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input;

      if (!id) {
        throw new BadRequestError('Input data not provided');
      }

      const entity = await this.segmentsRepository.findById(id);
      return entity.toJSON();
    }
  }
}
