import { useState } from "react";
import type { Artist, ArtistFilters, ArtistInclude } from "../artist.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import artistService from "../services/artist.service";
import { paginationMeta } from "../../../shared/data/search.data";

const useArtist = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistMeta, setArtistMeta] = useState<SearchMeta>(paginationMeta);
  const [loading, setLoading] = useState(false);

  async function searchArtists(filters?: ArtistFilters, include?: ArtistInclude) {
    setLoading(true);
    if (loading) return;

    const page = filters?.page || 1;
    const { data } = await artistService.searchArtists(filters, include);

    setLoading(false);
    if (!data) return;

    setArtistMeta(data.meta);

    if (page > 1) {
      setArtists((prev) => [...prev, ...data.items]);
      return;
    }

    setArtists(data.items);
    return data;
  }

  return {
    loading, setLoading,
    artistMeta, setArtistMeta,
    artists, setArtists,
    searchArtists
  }
}

export default useArtist;