import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

enum UserRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
  ASSISTANT = 'assistant',
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