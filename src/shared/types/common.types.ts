export interface IncludeArgs {
  where?: Record<string, any>;
  include?: Record<string, any>;
  select?: Record<string, any>;
  omit?: Record<string, any>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type SearchMeta = PaginationMeta & {
  totalDuration?: number;
}

export type SearchResponse<T> = {
  items: T;
  meta: SearchMeta;
}

export interface IToast {
  title: string;
  message: string;
}

export interface PaginationQuery {
  id?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc'
}