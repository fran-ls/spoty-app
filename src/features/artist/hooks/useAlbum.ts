import { useState } from "react";
import type { Album, AlbumFilters } from "../album.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import albumService from "../services/album.service";

const useAlbum = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumMeta, setAlbumMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  async function searchAlbums(filters?: AlbumFilters) {
    const page = filters?.page ?? 0;

    const { data } = await albumService.searchAlbums(filters);
    if (!data) return;

    setAlbumMeta(data.meta);

    if (page > 1) {
      setAlbums((prev) => [...prev, ...data.items]);
      return;
    }

    setAlbums(data.items);
  }

  return {
    albumMeta, setAlbumMeta,
    albums, setAlbums,
    searchAlbums
  }
}

export default useAlbum;