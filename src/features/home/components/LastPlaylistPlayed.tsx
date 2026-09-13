import { useEffect, useMemo, useState } from "react";
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
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import useLibrary from "../../library/hooks/useLibrary";
import { getDeviceType } from "../../../shared/utils/getDeviceType";
import Slider from "../../../shared/components/Slider";

const LastPlaylistPlayed = ({ bannerRef, setPlaylist }: {
  bannerRef: React.RefObject<HTMLDivElement | null>;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist>>;
}) => {
  const { user } = useAuth();
  const { libraryStatus } = useLibrary();
  const { isPlaying, isPlayer, currentPlaylist, togglePlay, play, onPlaylistChange } = usePlayer();

  const [playlists, setPlaylists] = useState<HistoryPlaylist[]>([]);

  const navigate = useNavigate();

  const isDesktop = getDeviceType() === 'desktop';

  const welcome = useMemo(() => {
    const hour = Number(getFmtDate(new Date(), 'HH'));
    return hour >= 18 ? `¡Buenas noches ${user?.username}!` : `¡Buen día ${user?.username}!`;
  }, []);

  async function getPlaylists() {
    if (!user?.id) return;
    const { data } = await playHistoryService.getLastPlaylistsPlayed(user.id);
    data && setPlaylists(data);
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

  const grid = {
    base: 'max-[640px]:grid-cols-2',
    sm: !libraryStatus.collapsed && isPlayer ? 'grid-cols-1' : 'sm:grid-cols-2',
    lg: !libraryStatus.collapsed && isPlayer ? 'lg:grid-cols-2' : 'lg:grid-cols-4',
  }

  return (
    <section className={`${isDesktop ? 'px-8' : 'px-0'} mb-12`} id="home-greeting-section">
      <h2 className={`${isDesktop ? 'px-0' : 'px-4'} text-3xl font-bold font-headline mb-6 tracking-tight text-white select-none google-sans-flex-font`}>
        {welcome}
      </h2>

      {!isDesktop && (
        <Slider
          keys={{
            title: 'playlist.name'
          }}
          items={playlists}
          linkToViewAll={routes.playlists}
          linkToRedirect={routes.playlists}
          isCurrentPlaying={(it) => currentPlaylist?.id === it.id}
          loadImage={(p) => playlistService.playlistCover(p.id, p.cover)}
        />
      )}

      <div
        className={`grid ${grid.base} ${grid.sm} ${grid.lg} gap-3 ${isDesktop ? 'block' : 'hidden'}`}
        ref={bannerRef}
      >
        {playlists.map((it) => {
          const playlist = it.playlist;
          if (!playlist) return null;

          const coverImages = playlist.coverImages || [];
          const cover = playlistService.playlistCover(playlist.id, playlist?.cover);
          const isCoverImgs = !cover && coverImages && coverImages.length > 3;
          const isCurrent = currentPlaylist?.id === playlist.id;

          return (
            <div
              onClick={() => navigate(`${routes.playlists}/${playlist.id}`)}
              onMouseEnter={() => setPlaylist(playlist)}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded overflow-hidden transition-all duration-300 cursor-pointer relative active:scale-98"
              key={playlist.id}
            >
              <div className="shadow-[0px_0px_24px_#00000080] aspect-square w-16 h-16 shrink-0 relative overflow-hidden bg-[#333333]">
                <SmartImage
                  wrapClassName="bg-transparent"
                  url={cover}
                  styles={{
                    imgWrap: 'w-full h-full',
                    icon: 'w-[40%] h-[40%]'
                  }}
                />

                {isCoverImgs && <PlaylistCoverImgs images={coverImages} />}
              </div>

              <h3
                className="px-5 flex-1 font-headline font-extrabold text-[#ffffff] text-sm truncate google-sans-flex-font"
                title={playlist.name}
              >
                {playlist.name}
              </h3>
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