import { useState } from "react";
import type { IncludeArgs, PaginationMeta } from "../types/common.types";
import { useInfiniteScroll } from "./useInfiniteScroll";

type Args = {
  filters?: Record<string, any>;
  include?: Record<string, IncludeArgs>;
} | null

type Callback = (
  filters?: Record<string, any>,
  include?: Record<string, IncludeArgs>
) => Promise<any>;

interface Data<T> {
  items: T[];
  meta: PaginationMeta;
}

const useSearch = <T>(args: Args, callback: Callback) => {
  const { filters: filterArg, include: includeArg } = args || {};

  const [page, setPage] = useState(filterArg?.page || 1);
  const [items, setItems] = useState<T[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page === 1 || page < paginationMeta.totalPages) {
      await getSearch({ ...filterArg, page });
      setPage(page + 1);
    }
  });

  const getSearch = async (
    filters?: Record<string, any>,
    include?: Record<string, IncludeArgs>
  ): Promise<Data<T>> => {
    const params = filters || filterArg;
    const { data } = await callback(params, include || includeArg);
    if (!data) return data;

    setPaginationMeta({
      ...paginationMeta,
      ...data.meta
    });

    (params?.page > 1)
      ? setItems((prev) => [...prev, ...data.items])
      : setItems(data.items);

    return data;
  }

  return {
    data: {
      items,
      meta: paginationMeta
    },
    hasMore: page < paginationMeta.totalPages,
    loaderRef,
    items, setItems,
    paginationMeta, setPaginationMeta,
    getSearch
  }
}

export default useSearch;