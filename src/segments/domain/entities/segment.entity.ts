import { Entity } from '@/shared/domain/entities/entity';
import { SegmentValidatorFactory } from '../validators/segments.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type SegmentsProps = {
  segment: string;
  is_published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
export class SegmentEntity extends Entity<SegmentsProps> {
  constructor(
    public readonly props: SegmentsProps,
    id?: string,
  ) {
    SegmentEntity.validate(props);
    super(props, id);
    this.props.segment = props.segment;
    this.props.is_published = props.is_published ?? false;
    this.props.createdAt = props.createdAt ?? new Date();
    this.props.updatedAt = props.updatedAt ?? new Date();
  }

  get segment() {
    return this.props.segment;
  }

  private set segment(value: string) {
    this.props.segment = value;
  }

  get is_published() {
    return this.props.is_published;
  }

  private set is_published(value: boolean) {
    this.props.is_published = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  updateSegment(segment: string): void {
    SegmentEntity.validate({ segment, is_published: this.is_published });
    this.segment = segment;
    this.updateTimestamp();
  }

  updateIsPublished(is_published: boolean): void {
    SegmentEntity.validate({ segment: this.segment, is_published });
    this.is_published = is_published;
    this.updateTimestamp();
  }

  static validate(props: SegmentsProps) {
    const validator = SegmentValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
