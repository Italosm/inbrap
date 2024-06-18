import { faker } from '@faker-js/faker';
import { SegmentsProps } from '../../entities/segment.entity';

export function SegmentsDataBuilder(
  props: Partial<SegmentsProps>,
): SegmentsProps {
  return {
    segment: props.segment ?? faker.person.jobArea(),
    is_published: props.is_published ?? false,
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  };
}
