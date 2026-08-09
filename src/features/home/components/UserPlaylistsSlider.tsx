import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, PauseIcon, PlayIcon } from "lucide-react";
import type { Playlist, PlaylistFilters, PlaylistInclude } from "../../playlist/playlist.types";
import SmartImage from "../../../shared/components/SmartImage";
import playlistService from "../../playlist/services/playlist.service";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import useAuth from "../../auth/hooks/useAuth";
import usePlayer from "../../player/hooks/usePlayer";
import { routes } from "../../../shared/utils/routes";
import libraryService from "../../library/services/library.service";
import { hasScroll } from "../../../shared/utils/scroll";

const UserPlaylistsSlider = () => {
  const { user } = useAuth();
  const { currentPlaylist, isPlaying, play, onPlaylistChange, togglePlay } = usePlayer();

  const sliderRef = useRef<HTMLDivElement>(null);
  const slider = sliderRef.current!;

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isPrevBtn, setIsPrevBtn] = useState(false);
  const [isNextBtn, setIsNextBtn] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const navigate = useNavigate();

  const step = () => slider.clientWidth / 2;

  async function getUserPlaylists(
    userId: string,
    filters?: PlaylistFilters,
    include?: PlaylistInclude
  ) {
    if (!userId) return [];

    const { data } = await libraryService.getUserPlaylists(filters, include);
    if (!data) return [];

    (filters?.page && filters?.page > 1)
      ? setPlaylists((prev) => [...prev, ...data.items])
      : setPlaylists(data.items);

    return data;
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

  useEffect(() => { user?.id && getUserPlaylists(user?.id) }, []);
  useEffect(() => { slider && setIsNextBtn(hasScroll(slider).horizontal) }, [playlists]);

  return (
    <section className="mb-12" id="home-recommendations-section">
      <div className="px-8 flex justify-between items-end mb-3">
        <h2 className="text-2xl font-bold font-headline text-white hover:underline cursor-pointer tracking-tight">
          Tus listas
        </h2>
        <span className="text-[#adaaaa] font-bold text-[13px] hover:underline cursor-pointer select-none">
          Mostrar todos
        </span>
      </div>
      <div
        className={`relative overflow-hidden ${isPrevBtn ? 'slider-before' : ''} ${isNextBtn ? 'slider-after' : ''}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <button
          onClick={() => {
            if (slider && slider.scrollLeft > 0) {
              slider.scrollBy({ left: -step(), behavior: 'smooth' });
            }
          }}
          className={`${isPrevBtn && isHover ? 'opacity-100 translate-x-5' : 'opacity-0 -translate-x-full'} transition-all duration-100 cursor-pointer z-3 w-8 h-8 bg-[#2a2a2a] rounded-full absolute top-1/2 left-0 -translate-y-1/2`}
          type="button"
        >
          <ChevronLeftIcon className="mr-0.5" strokeWidth={1} size={28} />
        </button>
        <div
          className="flex overflow-auto relative hide-scrollbar slider"
          onScroll={(e) => {
            const target = e.currentTarget;
            setIsPrevBtn(!(target.scrollLeft <= 0));

            const max = target.scrollWidth - target.clientWidth;
            setIsNextBtn(!(target.scrollLeft >= max - 1));
          }}
          ref={sliderRef}
        >
          {playlists.map((playlist) => {
            const cover = playlistService.playlistCover(playlist.id, playlist.cover);
            const isCoverImgs = !cover && playlist.coverImages && playlist.coverImages.length > 3;
            const isCurrent = currentPlaylist?.id === playlist.id;

            return (
              <div
                className="min-w-50 grow max-w-50 group h-fit group hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 cursor-pointer flex flex-col playlist-item"
                onClick={() => navigate(`${routes.playlists}/${playlist.id}`)}
                key={playlist.id}
              >
                <div className="relative mb-2 aspect-square rounded-md overflow-hidden bg-[#333333]">
                  <SmartImage
                    wrapClassName="bg-transparent"
                    url={cover}
                    styles={{
                      imgWrap: 'w-full h-full bg-transparent',
                      icon: 'text-white w-[40%] h-[40%]'
                    }}
                  />

                  {!cover && isCoverImgs && (
                    <PlaylistCoverImgs images={playlist.coverImages || []} />
                  )}

                  {playlist.trackCount > 0 &&
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (playlist.trackCount) getPlaylistSongs(playlist, isCurrent);
                      }}
                      className={`shadow-[0_8px_8px_rgba(0,0,0,0.3)] absolute bottom-3 right-3 bg-primary text-black p-3 rounded-full opacity-0 ${isCurrent && isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
                      type="button"
                    >
                      {isPlaying && isCurrent
                        ? <PauseIcon size={24} fill="currentColor" stroke="none" />
                        : <PlayIcon size={24} fill="currentColor" stroke="none" />
                      }
                    </button>
                  }
                </div>

                <Link
                  className="hover:underline"
                  to={`${routes.playlists}/${playlist.id}`}
                >
                  <h3
                    className="font-light text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
                    title={playlist.name}
                  >
                    {playlist.name}
                  </h3>
                </Link>

                {playlist.description ? (
                  <p className="text-sm text-[#adaaaa] line-clamp-2 leading-relaxed">
                    {playlist.description}
                  </p>
                ) : user?.username && (
                  <p className="text-sm text-[#adaaaa] truncate leading-relaxed">
                    De {user?.username}
                  </p>
                )}
              </div>
            )
          })}
        </div>
        <button
          onClick={() => {
            if (!slider) return;
            const max = slider.scrollWidth - slider.clientWidth;
            if (!(slider.scrollLeft >= max - 1)) {
              slider.scrollBy({ left: step(), behavior: 'smooth' });
            }
          }}
          className={`${isNextBtn && isHover ? 'opacity-100 -translate-x-5' : 'opacity-0 translate-x-full'} transition-all duration-100 cursor-pointer z-3 w-8 h-8 bg-[#2a2a2a] rounded-full absolute top-1/2 right-0 -translate-y-1/2`}
          type="button"
        >
          <ChevronLeftIcon className="ml-0.5 rotate-180" strokeWidth={1} size={28} />
        </button>
      </div>
    </section>
  )
}

export default UserPlaylistsSlider;