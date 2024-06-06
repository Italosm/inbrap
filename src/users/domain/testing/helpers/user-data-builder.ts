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

enum UserSectors {
  IT = 'IT',
  MARKETING = 'MARKETING',
  MANAGER = 'MANAGER',
  ASSISTANT = 'ASSISTANT',
  SALES = 'SALES',
  BILLING = 'BILLING',
  DIRECTOR = 'DIRECTOR',
  FINANCE = 'FINANCE',
  HR = 'HR',
  SAC = 'SAC',
  GUEST = 'GUEST',
}

export function UserDataBuilder(props: Partial<UserProps>): UserProps {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    avatar: props.avatar ?? faker.image.avatar(),
    status: props.status ?? false,
    roles: props.roles ?? [UserRoles.USER],
    sectors: props.sectors ?? [UserSectors.GUEST],
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  };
}
