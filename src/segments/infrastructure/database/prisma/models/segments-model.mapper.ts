import { SegmentEntity } from '@/segments/domain/entities/segment.entity';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { Segments } from '@prisma/client';

export class SegmentModelMapper {
  static toEntity(model: Segments) {
    const data = {
      segment: model.segment,
      is_published: model.is_published,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };

    try {
      return new SegmentEntity(data, model.id);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
