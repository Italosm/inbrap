import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { UserProps } from '../entities/user.entity';

import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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
  GUEST = 'GUEST',
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

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @MaxLength(255)
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsEnum(UserRoles, { each: true })
  roles?: UserRoles[];

  @IsOptional()
  @IsEnum(UserSectors, { each: true })
  sectors?: UserSectors[];

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  constructor(props: UserProps) {
    Object.assign(this, props);
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserRules): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)));
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
