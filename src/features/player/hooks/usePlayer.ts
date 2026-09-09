import { useContext, useState } from "react";
import type { PlayerInclude } from "../player.types";
import type { PaginationQuery } from "../../../shared/types/common.types";
import playerService from "../services/player.service";
import { PlayerContext } from "../context/PlayerContext";
import playlistService from "../../playlist/services/playlist.service";
import { getLocalPlayer } from "../../../shared/utils/localPlayer";

const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  const {
    currentPlaylist, player, localPlayer, setLocalPlayer,
    setPlayer, setQueue, setQueueMeta, setPlayingTracks, resetPlayer
  } = ctx;

  const [isLoading, setIsLoading] = useState(false);

  async function getPlayer(userId: string, include?: PlayerInclude) {
    const { data } = await playerService.getPlayer(userId, include);
    return data;
  }

  const getPlayerData = async (userId: string) => {
    if (!userId) {
      resetPlayer();
      return;
    }

    const [data, item] = await Promise.all([
      getPlayer(userId),
      getLocalPlayer()
    ]);

    if (data && item) {
      setPlayer({ ...data, ...item });
      setLocalPlayer({ ...localPlayer!, ...item });
      return;
    }
    else if (data && !item) {
      setPlayer(data);
      return;
    }
    else if (item) {
      player && setPlayer({ ...player, ...item });
      setLocalPlayer({ ...localPlayer!, ...item });
    }
  }

  async function getQueueSongs(page: number, filters?: Pick<PaginationQuery, 'page' | 'limit'>) {
    if (isLoading) return;
    const playlistId = currentPlaylist?.id;

    if (!playlistId) {
      // setIsLoading(true);
      // const { data } = await songService.searchSongs({ page, limit: 10 });
      // setIsLoading(false);
      // if (!data) return;
      // setQueueMeta({ ...queueMeta, ...data.meta });

      // if (page > 1) {
      //   setQueue((prev) => [...prev, ...data.items]);
      //   setPlayingTracks((prev) => [...prev, ...data.items]);
      // }
      // else {
      //   setQueue(data.items);
      //   setPlayingTracks(data.items);
      // }

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
    getPlayer: getPlayerData, getQueueSongs
  }
}

export default usePlayer;