import { Entity } from '../entities/entity';

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string): Promise<void>;
}

export type PartialRepositoryInterface<
  E extends Entity,
  K extends keyof RepositoryInterface<E>,
> = Omit<RepositoryInterface<E>, K>;

export type RepositoryInterfaceWithoutUpdate<E extends Entity> =
  PartialRepositoryInterface<E, 'update'>;

export type RepositoryInterfaceWithoutDelete<E extends Entity> =
  PartialRepositoryInterface<E, 'delete'>;

export type RepositoryInterfaceWithoutFindAll<E extends Entity> =
  PartialRepositoryInterface<E, 'findAll'>;

export type RepositoryInterfaceWithoutFindById<E extends Entity> =
  PartialRepositoryInterface<E, 'findById'>;
