import { useEffect, useState } from "react";
import type { HistorySong } from "../../player/playHistory.types";
import useAuth from "../../auth/hooks/useAuth";
import usePlayer from "../../player/hooks/usePlayer";
import Slider from "../../../shared/components/Slider";
import playHistoryService from "../../player/services/playHistory.service";
import { routes } from "../../../shared/utils/routes";
import songService from "../../song/services/song.service";
import { paginationMeta } from "../../../shared/data/search.data";
import { playlist } from "../../playlist/data/playlist.data";

const RecentSlider = () => {
  const { user } = useAuth();
  const { currentSong, play, onPlaylistChange } = usePlayer();

  const [playHistory, setPlayHistory] = useState<HistorySong[]>([]);

  async function getPlayHistory() {
    if (!user?.id) return;
    const { data } = await playHistoryService.getSongs(user.id);
    if (data?.items) setPlayHistory(data.items);
  }

  useEffect(() => { getPlayHistory() }, []);

  return (
    <Slider
      keys={{
        title: 'song.title'
      }}
      title="Recientes"
      subtext="Canción"
      items={playHistory}
      linkToViewAll={routes.recents}
      loadImage={(s) => (songService.songCoverUrl(s.song.id, s.song.cover))}
      isCurrentPlaying={(it) => currentSong?.id === it?.songId}
      onPlay={(it) => {
        if (!it.song) return;
        play([it.song], 0, paginationMeta);
        onPlaylistChange(playlist);
      }}
    />
  )
}

export default RecentSlider;