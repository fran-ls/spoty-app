import type { PaginationMeta } from "../types/common.types";

const meta: PaginationMeta = {
  page: 0,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false
} as const

export const paginationMeta = structuredClone(meta);