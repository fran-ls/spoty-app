import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, PauseIcon, PlayIcon } from "lucide-react";
import type { HistorySong } from "../../player/playHistory.types";
import SmartImage from "../../../shared/components/SmartImage";
import useAuth from "../../auth/hooks/useAuth";
import usePlayer from "../../player/hooks/usePlayer";
import { routes } from "../../../shared/utils/routes";
import songService from "../../song/services/song.service";
import playHistoryService from "../../player/services/playHistory.service";
import { paginationMeta } from "../../../shared/data/search.data";
import { playlist } from "../../playlist/data/playlist.data";
import { hasScroll } from "../../../shared/utils/scroll";

const RecentSlider = () => {
  const { user } = useAuth();
  const { isPlaying, currentSong, togglePlay, play, onPlaylistChange } = usePlayer();

  const sliderRef = useRef<HTMLDivElement>(null);
  const slider = sliderRef.current!;

  const [isPrevBtn, setIsPrevBtn] = useState(false);
  const [isNextBtn, setIsNextBtn] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const [playHistory, setPlayHistory] = useState<HistorySong[]>([]);

  const step = () => slider.clientWidth / 2;

  async function getPlayHistory() {
    if (!user?.id) return;
    const { data } = await playHistoryService.getSongs(user.id);
    if (data?.items) setPlayHistory(data.items);
  }

  useEffect(() => { getPlayHistory() }, []);
  useEffect(() => { slider && setIsNextBtn(hasScroll(slider).horizontal) }, [playHistory]);

  return (
    <section className="mb-12" id="home-recommendations-section">
      <div className="px-8 flex justify-between items-end mb-3">
        <h2 className="text-2xl font-bold font-headline text-white hover:underline cursor-pointer tracking-tight">
          Recientes
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
          {playHistory.map((h) => {
            const cover = songService.songCoverUrl(h.id, h.song?.cover);
            const isCurrent = isPlaying && currentSong?.id === h.songId;

            return (
              <div
                className="min-w-50 grow max-w-50 group h-fit group hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 cursor-pointer flex flex-col playlist-item"
                key={h.id}
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentSong?.id === h.songId) {
                        return togglePlay();
                      }
                      if (h.song) {
                        play([h.song], 0, paginationMeta)
                        onPlaylistChange(playlist);
                      }
                    }}
                    className={`shadow-[0_8px_8px_rgba(0,0,0,0.3)] absolute bottom-3 right-3 bg-primary text-black p-3 rounded-full opacity-0 ${isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
                    type="button"
                  >
                    {isCurrent
                      ? <PauseIcon size={24} fill="currentColor" stroke="none" />
                      : <PlayIcon size={24} fill="currentColor" stroke="none" />
                    }
                  </button>
                </div>

                <Link
                  className="hover:underline"
                  to={`${routes.playlists}/${h.id}`}
                >
                  <h3
                    className="font-light text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
                    title={h.song?.title}
                  >
                    {h.song?.title}
                  </h3>
                </Link>
                <p className="text-sm text-[#adaaaa] line-clamp-2 leading-relaxed">
                  Canción
                </p>
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

export default RecentSlider;