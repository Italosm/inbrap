import { UserSectors } from '@/users/domain/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export const SECTORS_KEY = 'sectors';
export const Sectors = (...sectors: UserSectors[]) =>
  SetMetadata(SECTORS_KEY, sectors);
