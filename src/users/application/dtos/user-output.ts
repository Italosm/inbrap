import {
  UserEntity,
  UserRoles,
  UserSectors,
} from '@/users/domain/entities/user.entity';

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  status: boolean;
  roles: UserRoles[];
  sectors: UserSectors[];
  createdAt: Date;
  updatedAt: Date;
};

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return entity.toJSON();
  }
}
