import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contracts';

export type SortDirection = 'asc' | 'desc';

export type SearchProps = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
};

export type SearchResultProps<E extends Entity> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  sortDir: string | null;
};

export class SearchParams {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;

  constructor(props: SearchProps = {}) {
    this.page = props.page;
    this.perPage = props.perPage;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? this._perPage : +value;
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage;
    }
    this._perPage = _perPage;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }
}

export class SearchResult<E extends Entity> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;
  readonly sort: string | null;
  readonly sortDir: string | null;

  constructor(props: SearchResultProps<E>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
    };
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E>,
> extends RepositoryInterface<E> {
  sortableFields: string[];

  search(props: SearchInput): Promise<SearchOutput>;
}
