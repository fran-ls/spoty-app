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

export interface ApiResponse<T> {
  status: any;
  statusText: string;
  error: any;
  data: T | null;
}

export type ApiRes<T> = Promise<ApiResponse<T>>