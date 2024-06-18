import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { SegmentsRepository } from '@/segments/domain/repositories/segments.repository';
import { SegmentEntity } from '@/segments/domain/entities/segment.entity';
import { SegmentModelMapper } from '../models/segments-model.mapper';

export class SegmentsPrismaRepository implements SegmentsRepository.Repository {
  sortableFields: string[] = ['segments', 'createdAt'];

  constructor(private prismaService: PrismaService) {}

  async findBySegment(segment: string): Promise<SegmentEntity> {
    try {
      const segmentExists = await this.prismaService.segments.findUnique({
        where: { segment },
      });
      return SegmentModelMapper.toEntity(segmentExists);
    } catch {
      throw new NotFoundError(`UserModel not found using segment ${segment}`);
    }
  }

  async search(
    props: SegmentsRepository.SearchParams,
  ): Promise<SegmentsRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';
    const whereConditions: any = {};
    if (props.segments) {
      whereConditions.name = {
        startsWith: props.segments,
        mode: 'insensitive',
      };
    }

    if (props.is_published !== null && props.is_published !== undefined) {
      whereConditions.is_published = props.is_published;
    }

    const count = await this.prismaService.segments.count({
      where: whereConditions,
    });
    const models = await this.prismaService.segments.findMany({
      where: whereConditions,
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 0,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new SegmentsRepository.SearchResult({
      items: models.map(model => SegmentModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
    });
  }

  async insert(entity: SegmentEntity): Promise<void> {
    await this.prismaService.segments.create({
      data: entity.toJSON(),
    });
  }

  async findById(id: string): Promise<SegmentEntity> {
    return this._get(id);
  }

  async findAll(): Promise<SegmentEntity[]> {
    const models = await this.prismaService.segments.findMany();
    return models.map(model => SegmentModelMapper.toEntity(model));
  }

  update(entity: SegmentEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async segmentExists(segment: string): Promise<void> {
    const segmentExists = await this.prismaService.segments.findUnique({
      where: { segment },
    });
    if (segmentExists) {
      throw new ConflictError(`Segment name already used`);
    }
  }

  protected async _get(id: string): Promise<SegmentEntity> {
    try {
      const segment = await this.prismaService.segments.findUnique({
        where: { id },
      });
      return SegmentModelMapper.toEntity(segment);
    } catch {
      throw new NotFoundError(`SegmentModel not found usind ID ${id}`);
    }
  }
}
