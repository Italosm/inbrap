import { ValidationError } from '@/shared/domain/errors/validation-error';
import {
  UserEntity,
  UserRoles as EntityUserRoles,
} from '@/users/domain/entities/user.entity';
import { User } from '@prisma/client';

export class UserModelMapper {
  static toEntity(model: User) {
    const roles = model.roles.map(role => {
      return EntityUserRoles[role as keyof typeof EntityUserRoles];
    });
    const data = {
      name: model.name,
      email: model.email,
      avatar: model.avatar,
      status: model.status,
      roles: roles,
      password: model.password,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };

    try {
      return new UserEntity(data, model.id);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
