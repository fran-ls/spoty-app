import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { HistoryPlaylist } from "../../player/playHistory.types";
import type { Playlist } from "../../playlist/playlist.types";
import playHistoryService from "../../player/services/playHistory.service";
import useAuth from "../../auth/hooks/useAuth";
import playlistService from "../../playlist/services/playlist.service";
import SmartImage from "../../../shared/components/SmartImage";
import { routes } from "../../../shared/utils/routes";
import usePlayer from "../../player/hooks/usePlayer";

const LastPlaylistPlayed = () => {
  const { user } = useAuth();
  const { isPlaying, currentPlaylist, togglePlay, play, onPlaylistChange } = usePlayer();

  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<HistoryPlaylist[]>([]);

  async function getPlaylists() {
    if (!user?.id) return;
    const { data } = await playHistoryService.getPlaylists(user.id);
    if (data?.items) setPlaylists(data.items);
  }

  async function getPlaylistSongs(playlist: Playlist, isCurrent: boolean) {
    if (isCurrent) {
      togglePlay();
      return;
    }

    const { data } = await playlistService.getPlaylistSongs(playlist.id);
    if (!data || !data.songs.length) return;

    play(data.songs, 0, data.meta);
    onPlaylistChange(playlist);
  }

  useEffect(() => { getPlaylists() }, []);

  return (
    <section className="px-8 mb-12" id="home-greeting-section">
      <h1 className="text-3xl font-bold font-headline mb-6 tracking-tight text-white select-none">
        Good evening
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {playlists.map((it) => {
          const playlist = it.playlist;
          if (!playlist) return null;

          const cover = playlistService.playlistCover(playlist.id, playlist?.cover);
          const isCoverImgs = !cover && it.coverImages && it.coverImages.length > 3;
          const isCurrent = currentPlaylist?.id === playlist.id;

          return (
            <div
              onClick={() => navigate(`${routes.playlists}/${playlist.id}`)}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative pr-16 active:scale-98"
              key={playlist.id}
            >
              <div className="aspect-square w-20 h-20 shrink-0 relative overflow-hidden bg-[#333333]">
                <SmartImage
                  wrapClassName="bg-transparent"
                  url={cover}
                  styles={{
                    imgWrap: 'w-full h-full',
                    icon: 'text-white w-[40%] h-[40%]'
                  }}
                />

                {isCoverImgs && it.coverImages.map((img, i) => {
                  const className = i === 0
                    ? 'top-0 left-0' : i === 1
                      ? 'top-0 right-0' : i === 3
                        ? 'bottom-0 right-0' : 'bottom-0 left-0';

                  return (
                    <img
                      className={`${className} absolute w-1/2 h-1/2 object-cover`}
                      crossOrigin="anonymous"
                      src={img.url}
                      alt="cover"
                      key={img.id}
                    />
                  )
                })}
              </div>

              <div className="px-5 flex-1 font-headline font-extrabold text-[#ffffff] text-sm truncate">
                {playlist.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (playlist.trackCount) getPlaylistSongs(playlist, isCurrent);
                }}
                className={`absolute right-4 bg-primary text-black p-3 rounded-full shadow-2xl group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-90 ${isCurrent && isPlaying ? 'translate-y-0 opacity-100' : 'opacity-0 translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
                type="button"
              >
                {isPlaying && isCurrent
                  ? <PauseIcon size={18} fill="currentColor" stroke="none" />
                  : <PlayIcon size={18} fill="currentColor" stroke="none" />
                }
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default LastPlaylistPlayed;