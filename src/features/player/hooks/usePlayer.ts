import { useContext, useState } from "react";
import type { PlayerInclude } from "../player.types";
import type { PaginationQuery } from "../../../shared/types/common.types";
import playerService from "../services/player.service";
import { PlayerContext } from "../context/PlayerContext";
import playlistService from "../../playlist/services/playlist.service";
import songService from "../../song/services/song.service";

const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  const { currentPlaylist, queueMeta, setPlayer, setQueue, setQueueMeta, setPlayingTracks } = ctx;

  const [isLoading, setIsLoading] = useState(false);

  async function getPlayer(userId: string, include?: PlayerInclude) {
    const { data } = await playerService.getPlayer(userId, include);
    if (data) setPlayer(data);
    return data;
  }

  async function getQueueSongs(page: number, filters?: Pick<PaginationQuery, 'page' | 'limit'>) {
    if (isLoading) return;
    const playlistId = currentPlaylist?.id;

    if (!playlistId) {
      setIsLoading(true);
      const { data } = await songService.searchSongs({ page, limit: 10 });
      setIsLoading(false);
      if (!data) return;
      setQueueMeta({ ...queueMeta, ...data.meta });

      if (page > 1) {
        setQueue((prev) => [...prev, ...data.items]);
        setPlayingTracks((prev) => [...prev, ...data.items]);
      }
      else {
        setQueue(data.items);
        setPlayingTracks(data.items);
      }

      return;
    }

    setIsLoading(true);
    const { data } = await playlistService.getPlaylistSongs(
      playlistId,
      filters || { page, limit: 10 }
    );
    setIsLoading(false);
    if (!data) return;

    setQueueMeta(data.meta);

    if (page > 1) {
      setQueue((prev) => [...prev, ...data.songs]);
      setPlayingTracks((prev) => [...prev, ...data.songs]);
    }
    else {
      setQueue(data.songs);
      setPlayingTracks(data.songs);
    }
  }

  return {
    ...ctx,
    isLoading, setIsLoading,
    getPlayer, getQueueSongs
  }
}

export default usePlayer;