import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { SegmentEntity } from '../entities/segment.entity';
import { ListSegmentsUseCase } from '@/segments/application/usecases/listsegments.usecase';

export namespace SegmentsRepository {
  export class SearchParams extends DefaultSearchParams {
    is_published?: boolean | null;
    segments: string | null;
    constructor(public input: ListSegmentsUseCase.Input) {
      super(input);
      this.is_published = input.is_published;
      this.segments = input.segments;
    }
  }

  export class SearchResult extends DefaultSearchResult<SegmentEntity> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      SegmentEntity,
      SearchParams,
      SearchResult
    > {
    findBySegment(segment: string): Promise<SegmentEntity>;
    segmentExists(segment: string): Promise<void>;
  }
}
