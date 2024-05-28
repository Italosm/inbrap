import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

enum UserRoles {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SELLER = 'SELLER',
  SUPERVISOR = 'SUPERVISOR',
  DIRECTOR = 'DIRECTOR',
  FINANCIAL = 'FINANCIAL',
  HR = 'HR',
  SAC = 'SAC',
}

export function UserDataBuilder(props: Partial<UserProps>): UserProps {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    avatar: props.avatar ?? faker.image.avatar(),
    status: props.status ?? false,
    roles: props.roles ?? [UserRoles.USER],
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  };
}
