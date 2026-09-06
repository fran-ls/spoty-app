import type { PaginationMeta } from "../types/common.types";

const meta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: true,
  hasPrevPage: false
} as const

export const paginationMeta = structuredClone(meta);