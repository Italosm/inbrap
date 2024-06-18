import { SegmentsRepository } from '@/segments/domain/repositories/segments.repository';
import { SegmentsOutput, SegmentOutputMapper } from '../dtos/segments-output';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/usecase';
import { SearchInput } from '@/shared/application/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';

export namespace ListSegmentsUseCase {
  export type Input = SearchInput & {
    is_published?: boolean | null;
    segments?: string | null;
  };

  export type Output = PaginationOutput<SegmentsOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private segmentsRepository: SegmentsRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new SegmentsRepository.SearchParams(input);
      const searchResult = await this.segmentsRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: SegmentsRepository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return SegmentOutputMapper.toOutput(item);
      });
      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
