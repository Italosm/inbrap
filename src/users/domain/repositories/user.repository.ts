import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { UserEntity, UserSectors } from '../entities/user.entity';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

export namespace UserRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {
    status: boolean | null;
    sectors: string | null;

    constructor(public input: ListUsersUseCase.Input) {
      super(input);
      this.sectors = this.validateSector(input.sectors);
      this.status =
        input.status === 'true'
          ? true
          : input.status === 'false'
            ? false
            : null;
    }

    private validateSector(sector: string | null): UserSectors | null {
      if (sector === null || sector === undefined) {
        return null;
      }

      if (Object.values(UserSectors).includes(sector as UserSectors)) {
        return sector as UserSectors;
      }

      throw new BadRequestError(`Invalid sector value: ${sector}`);
    }
  }

  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      UserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>;
    emailExists(email: string): Promise<void>;
  }
}
