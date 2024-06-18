import { UserSectors } from '@/users/domain/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export const EVERY_SECTORS_KEY = 'everySectors';
export const everySectors = (...sectors: UserSectors[]) =>
  SetMetadata(EVERY_SECTORS_KEY, sectors);
