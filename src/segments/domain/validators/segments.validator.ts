import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { SegmentsProps } from '../entities/segment.entity';

import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SegmentsRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  segment: string;

  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  constructor(props: SegmentsProps) {
    Object.assign(this, props);
  }
}

export class SegmentValidator extends ClassValidatorFields<SegmentsRules> {
  validate(data: SegmentsProps): boolean {
    return super.validate(new SegmentsRules(data ?? ({} as SegmentsProps)));
  }
}

export class SegmentValidatorFactory {
  static create(): SegmentValidator {
    return new SegmentValidator();
  }
}
