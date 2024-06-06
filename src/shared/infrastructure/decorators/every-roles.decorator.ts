import { UserRoles } from '@/users/domain/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export const EVERY_ROLES_KEY = 'everyRoles';
export const EveryRoles = (...roles: UserRoles[]) =>
  SetMetadata(EVERY_ROLES_KEY, roles);
