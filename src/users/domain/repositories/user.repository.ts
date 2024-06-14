import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { UserEntity, UserSectors, UserRoles } from '../entities/user.entity';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';

export namespace UserRepository {
  export class SearchParams extends DefaultSearchParams {
    status: boolean | null;
    sector: UserSectors[] | null;
    role: UserRoles[] | null;
    email: string | null;
    name: string | null;

    constructor(public input: ListUsersUseCase.Input) {
      super(input);
      this.sector = input.sector as UserSectors[];
      this.role = input.role as UserRoles[];
      this.status = input.status;
      this.email = input.email;
      this.name = input.name;
    }
  }

  export class SearchResult extends DefaultSearchResult<UserEntity> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      UserEntity,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>;
    emailExists(email: string): Promise<void>;
  }
}
