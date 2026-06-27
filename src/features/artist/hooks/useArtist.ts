import { useState } from "react";
import type { Artist } from "../artist.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import artistService from "../services/artist.service";

const useArtist = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistMeta, setArtistMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  async function searchArtists(filters?: Record<string, any>) {
    const page = filters?.page ?? 0;

    const { data } = await artistService.searchArtists(filters);
    if (!data) return;

    setArtistMeta(data.meta);

    if (page > 1) {
      setArtists((prev) => [...prev, ...data.items]);
      return;
    }

    setArtists(data.items);
  }

  return {
    artistMeta, setArtistMeta,
    artists, setArtists,
    searchArtists
  }
}

export default useArtist;