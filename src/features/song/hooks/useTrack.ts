import { useState } from "react";
import type { Track, TrackFilters } from "../song.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import songService from "../services/song.service";

const useTrack = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackMeta, setTrackMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  async function searchTracks(filters?: TrackFilters) {
    const page = filters?.page ?? 0;

    const { data } = await songService.searchSongs(
      filters ? filters : { limit: 10, page }
    );
    if (!data) return;

    setTrackMeta(data.meta);

    if (page > 1) {
      setTracks((prev) => [...prev, ...data.items]);
      return;
    }

    setTracks(data.items);
  }

  return {
    trackMeta, setTrackMeta,
    tracks, setTracks,
    searchTracks
  }
}

export default useTrack;