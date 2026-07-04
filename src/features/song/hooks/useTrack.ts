import { useState } from "react";
import type { Track, TrackFilters, TrackInclude } from "../song.types";
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

  async function searchTracks(filters?: TrackFilters, include?: TrackInclude) {
    const page = filters?.page ?? 0;
    const { data } = await songService.searchSongs(filters, include);
    if (!data) return data;

    setTrackMeta(data.meta);

    (page > 1)
      ? setTracks((prev) => [...prev, ...data.items])
      : setTracks(data.items);

    return data;
  }

  const deleteTrack = async (id: string) => {
    if (!id) return false;
    const { data } = await songService.removeSong(id);
    if (data) {
      setTracks((prev) => prev.filter((t) => t.id !== id));
      return true;
    }
    return false;
  }

  return {
    trackMeta, setTrackMeta,
    tracks, setTracks,
    searchTracks,
    deleteTrack
  }
}

export default useTrack;