import { SegmentEntity } from '@/segments/domain/entities/segment.entity';

export type SegmentsOutput = {
  id: string;
  segment: string;
  is_published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class SegmentOutputMapper {
  static toOutput(entity: SegmentEntity): SegmentsOutput {
    return entity.toJSON();
  }
}
