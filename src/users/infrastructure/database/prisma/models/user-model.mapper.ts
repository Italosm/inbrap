import { ValidationError } from '@/shared/domain/errors/validation-error';
import {
  UserEntity,
  UserRoles as EntityUserRoles,
  UserSectors as EntityUserSectors,
} from '@/users/domain/entities/user.entity';
import { User } from '@prisma/client';

export class UserModelMapper {
  static toEntity(model: User) {
    const roles = model.roles.map(role => {
      const entityRole = EntityUserRoles[role as keyof typeof EntityUserRoles];
      if (!entityRole) {
        throw new ValidationError(`Invalid role: ${role}`);
      }
      return entityRole;
    });
    const sectors = model.sectors.map(sector => {
      const entitySector =
        EntityUserSectors[sector as keyof typeof EntityUserSectors];
      if (!entitySector) {
        throw new ValidationError(`Invalid sector: ${sector}`);
      }
      return entitySector;
    });
    const data = {
      name: model.name,
      email: model.email,
      avatar: model.avatar,
      status: model.status,
      roles: roles,
      sectors: sectors,
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
