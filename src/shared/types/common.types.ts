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