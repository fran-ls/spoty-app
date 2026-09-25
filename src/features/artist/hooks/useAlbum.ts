import { useState } from "react";
import type { Album, AlbumFilters, AlbumInclude } from "../album.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import albumService from "../services/album.service";
import { paginationMeta } from "../../../shared/data/search.data";

const useAlbum = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumMeta, setAlbumMeta] = useState<SearchMeta>(paginationMeta);
  const [loading, setLoading] = useState(false);

  async function searchAlbums(filters?: AlbumFilters, include?: AlbumInclude) {
    if (loading) return;
    setLoading(true);

    const page = filters?.page ?? 1;
    const { data } = await albumService.searchAlbums(filters, include);

    setLoading(false);
    if (!data) return data;

    setAlbumMeta(data.meta);

    if (page > 1) {
      setAlbums((prev) => [...prev, ...data.items]);
      return data;
    }

    setAlbums(data.items);
    return data;
  }

  return {
    loading, setLoading,
    albumMeta, setAlbumMeta,
    albums, setAlbums,
    searchAlbums
  }
}

export default useAlbum;