import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserModelMapper } from '../models/user-model.mapper';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel not found using email ${email}`);
    }
  }

  async search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';
    const whereConditions: any = {};
    if (props.name) {
      whereConditions.name = {
        startsWith: props.name,
        mode: 'insensitive',
      };
    }
    if (props.email) {
      whereConditions.email = {
        startsWith: props.email,
        mode: 'insensitive',
      };
    }
    if (props.status !== null && props.status !== undefined) {
      whereConditions.status = props.status;
    }
    if (props.sector !== null && props.sector !== undefined) {
      whereConditions.sectors = {
        hasSome: props.sector,
      };
    }
    if (props.role !== null && props.role !== undefined) {
      whereConditions.roles = {
        hasSome: props.role,
      };
    }
    const count = await this.prismaService.user.count({
      where: whereConditions,
    });
    const models = await this.prismaService.user.findMany({
      where: whereConditions,
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 0,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new UserRepository.SearchResult({
      items: models.map(model => UserModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
    });
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    });
  }

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany();
    return models.map(model => UserModelMapper.toEntity(model));
  }

  async update(entity: UserEntity): Promise<void> {
    await this.prismaService.user.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    });
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new ConflictError(`Email address already used`);
    }
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel not found usind ID ${id}`);
    }
  }
}
