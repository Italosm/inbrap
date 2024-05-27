import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { UserOutput } from '@/users/application/dtos/user-output';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { UserRoles } from '@/users/domain/entities/user.entity';
import { Transform } from 'class-transformer';

export class UserPresenter {
  id: string;
  name: string;
  email: string;
  status: boolean;
  avatar: string;
  roles: UserRoles[];
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.avatar = output.avatar;
    this.status = output.status;
    this.roles = output.roles;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: ListUsersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new UserPresenter(item));
  }
}
