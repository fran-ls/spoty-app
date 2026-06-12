export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchMeta extends PaginationMeta {
  totalDuration: number;
}

export type SearchResponse<T> = {
  items: T;
  meta: SearchMeta;
}; 