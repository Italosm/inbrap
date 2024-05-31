import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { UserOutput } from '@/users/application/dtos/user-output';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { UserRoles } from '@/users/domain/entities/user.entity';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserPresenter {
  @ApiProperty({ description: 'Identificação do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({
    description: 'Status do usuário na aplicação',
    default: false,
  })
  status: boolean;

  @ApiProperty({ description: 'Avata do usuário', nullable: true })
  avatar: string;

  @ApiProperty({
    description: 'Roles do usuário na aplicação',
    type: [UserRoles],
    default: [UserRoles.USER],
  })
  roles: UserRoles[];

  @ApiProperty({ description: 'Data de criação do usuário' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({ description: 'Data da última alteração realizada no usuário' })
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
