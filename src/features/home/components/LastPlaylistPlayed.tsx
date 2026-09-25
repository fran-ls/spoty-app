import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { HistoryPlaylist, PlayHistory } from "../../player/playHistory.types";
import type { Playlist } from "../../playlist/playlist.types";
import playHistoryService from "../../player/services/playHistory.service";
import useAuth from "../../auth/hooks/useAuth";
import playlistService from "../../playlist/services/playlist.service";
import SmartImage from "../../../shared/components/SmartImage";
import { routes } from "../../../shared/utils/routes";
import usePlayer from "../../player/hooks/usePlayer";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import useLibrary from "../../library/hooks/useLibrary";
import { getDeviceType } from "../../../shared/utils/getDeviceType";
import Slider from "../../../shared/components/Slider";
import SliderSkeletons from "../../../shared/components/SliderSkeletons";

const LastPlaylistPlayed = ({ bannerRef, setPlaylist }: {
  bannerRef: React.RefObject<HTMLDivElement | null>;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist>>;
}) => {
  const { user } = useAuth();
  const { libraryStatus } = useLibrary();
  const { isPlaying, isPlayer, currentPlaylist, togglePlay, play, onPlaylistChange } = usePlayer();

  const [playlists, setPlaylists] = useState<HistoryPlaylist[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isDesktop = getDeviceType() === 'desktop';

  async function getPlaylists() {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await playHistoryService.getLastPlaylistsPlayed(user.id);
    setLoading(false);
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
    <section className={`${isDesktop ? 'px-8 mb-12' : 'px-0'}`} id="home-greeting-section">
      {!isDesktop && (
        loading ? (
          <SliderSkeletons />
        ) : (
          <Slider<PlayHistory>
            keys={{
              title: 'playlist.name',
              id: 'playlist.id'
            }}
            items={playlists}
            linkToViewAll={routes.playlists}
            linkToRedirect={routes.playlists}
            isCurrentPlaying={(it) => currentPlaylist?.id === it.playlistId}
            loadImage={({ playlist: p }) => {
              const cover = playlistService.playlistCover(p?.id || '', p?.cover);
              const img = p?.coverImages?.[0]?.url || '';
              return cover ? cover : p?.coverImages && p.coverImages.length < 4 ? img : ''
            }}
          />
        )
      )}

      <div
        className={`grid ${grid.base} ${grid.sm} ${grid.lg} gap-3 ${isDesktop ? 'block' : 'hidden'}`}
        ref={bannerRef}
      >
        {loading && (
          Array.from({ length: 8 }).map((i) => (
            <div
              key={`quick-${i}`}
              className="flex items-center bg-white/5 rounded overflow-hidden h-16 animate-pulse"
            >
              <div className="w-16 h-16 bg-white/10 shrink-0" />
              <div className="px-5 flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded-md w-3/5" />
              </div>
            </div>
          ))
        )}

        {playlists.map((it) => {
          const playlist = it.playlist;
          if (!playlist) return null;

          const coverImages = playlist.coverImages || [];
          const cover = playlistService.playlistCover(playlist.id, playlist?.cover);
          const isCoverImgs = !cover && coverImages && coverImages.length > 3;
          const isCurrent = currentPlaylist?.id === playlist.id;
          const redirectTo = `${routes.playlists}/${playlist.id}`;

          return (
            <div
              onClick={() => navigate(redirectTo)}
              onMouseEnter={() => setPlaylist(playlist)}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded overflow-hidden transition-all duration-300 cursor-pointer relative active:scale-98"
              key={playlist.id}
            >
              <div className="shadow-[0px_0px_24px_#00000080] aspect-square w-16 h-16 shrink-0 relative overflow-hidden bg-[#333333]">
                <SmartImage
                  wrapClassName="bg-transparent"
                  url={cover || playlist?.coverImages?.[0]?.url || ''}
                  styles={{
                    imgWrap: 'w-full h-full',
                    icon: 'w-[40%] h-[40%]'
                  }}
                />

                {isCoverImgs && <PlaylistCoverImgs images={coverImages} />}
              </div>

              <Link
                className="overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                to={redirectTo}
              >
                <h3
                  className="px-5 flex-1 font-headline font-extrabold text-[#ffffff] text-sm truncate google-sans-flex-font"
                  title={playlist.name}
                >
                  {playlist.name}
                </h3>
              </Link>

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