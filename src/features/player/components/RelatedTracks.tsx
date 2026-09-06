import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "lucide-react";
import type { Track, TrackFilters } from "../../song/song.types";
import { hasScroll } from "../../../shared/utils/scroll";
import SmartImage from "../../../shared/components/SmartImage";
import usePlayer from "../hooks/usePlayer";
import useTrack from "../../song/hooks/useTrack";
import songService from "../../song/services/song.service";

const RelatedTracks = () => {
  const { isPlaying, currentSong, playQueueSong, togglePlay } = usePlayer();
  const { tracks, trackMeta, searchTracks } = useTrack();

  const [isPrevBtn, setIsPrevBtn] = useState(false);
  const [isNextBtn, setIsNextBtn] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const [page, setPage] = useState(1);
  const [section, setSection] = useState(1);
  const [hoverId, setHoverId] = useState('');

  const sliderRef = useRef<HTMLDivElement>(null);
  const slider = sliderRef.current!;

  const sliderItems = useMemo(() => {
    const size = 3;
    const result: Track[][] = [];
    const items = currentSong ? tracks.filter((t) => t.id !== currentSong.id) : tracks;

    for (let i = 0; i < items.length; i += size) {
      result.push(tracks.slice(i, i + size));
    }

    return result;
  }, [tracks, currentSong]);

  const step = () => slider.clientWidth;

  const getTracks = (filters?: TrackFilters) => {
    if (!currentSong?.artistId) return;

    searchTracks({
      artistId: currentSong.artistId,
      limit: 7,
      page: 1,
      ...filters
    });
  }

  useEffect(() => {
    if (slider) {
      const IsScroll = hasScroll(slider).horizontal;
      slider && setIsNextBtn(IsScroll);
    }
  }, [tracks]);

  useEffect(() => {
    getTracks();
    setPage(1);
    setSection(1);
    if (slider) slider.scrollLeft = 0;
  }, [currentSong]);

  return !sliderItems.length ? null : (
    <div className="mx-2 text-white">
      <h2 className="ml-2 mb-3 text-white font-black text-nowrap">
        Relacionado
      </h2>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <button
          className={`${isPrevBtn && isHover ? 'opacity-100 transition-all' : 'opacity-0 translate-x-[-200%]'} transition-opacity duration-100 cursor-pointer z-3 w-8 h-8 bg-[#2a2a2a] rounded-full absolute top-1/2 left-0 -translate-y-1/2`}
          onClick={() => {
            if (!slider || slider.scrollLeft <= 0) return;
            slider.scrollBy({ left: -step(), behavior: 'smooth' });
          }}
          type="button"
        >
          <ChevronLeftIcon
            className="mr-0.5"
            strokeWidth={1}
            size={28}
          />
        </button>

        <div
          className="w-full flex overflow-auto relative hide-scrollbar slider"
          onScroll={(e) => {
            const target = e.currentTarget;
            setIsPrevBtn(target.scrollLeft > 0);

            const max = target.scrollWidth - target.clientWidth;
            setIsNextBtn(!(target.scrollLeft >= max - 1));
          }}
          ref={sliderRef}
        >
          {sliderItems.map((tracks, i) => (
            <ul className="min-w-full" key={`section-${i + 1}`}>
              {tracks.map((track, i) => {
                const cover = songService.songCoverUrl(track.id, track.cover);

                return (
                  <li
                    onPointerEnter={() => setHoverId(track.id)}
                    onPointerLeave={() => setHoverId('')}
                    className="px-2 hover:bg-[#1f1f1f] justify-start p-2 cursor-pointer text-[#adaaaa] rounded-md gap-3 flex items-center"
                    data-id={track.id}
                    key={track.id}
                  >
                    <div className="min-w-12 w-12 h-12 rounded relative overflow-hidden hover:badge:bg-blue-500">
                      <SmartImage
                        wrapClassName="bg-[#333333]"
                        url={cover}
                      />

                      {(hoverId !== null && hoverId === track.id && currentSong?.id !== track.id) &&
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playQueueSong(track, i);
                          }}
                          className="cursor-pointer text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center"
                          type="button"
                        >
                          <PlayIcon
                            fill="currentColor"
                            className="min-w-5.5 w-5.5 h-5.5"
                            stroke="0"
                          />
                        </button>
                      }

                      {(currentSong?.id === track.id && hoverId === track.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="cursor-pointer text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center"
                          type="button"
                        >
                          {!isPlaying ? (
                            <PlayIcon
                              fill="currentColor"
                              className="min-w-5.5 w-5.5 h-5.5"
                              stroke="0"
                            />
                          ) : (
                            <PauseIcon
                              fill="currentColor"
                              className="min-w-5 w-5 h-5"
                              stroke="0"
                            />
                          )}
                        </button>
                      )}
                    </div>

                    <div
                      onDoubleClick={() => playQueueSong(track, i)}
                      className="w-full"
                    >
                      <h4
                        className={`mt-1 text-[15px] font-semibold line-clamp-1 ${track.id === currentSong?.id ? 'text-primary' : 'text-white'}`}
                        title={track.title}
                      >
                        {track.title}
                      </h4>
                      <div className="text-[13px] font-medium">
                        <span className="line-clamp-1 w-full">
                          {track.artist?.name}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>

        <button
          className={`${isNextBtn && isHover ? 'opacity-100 transition-all' : 'opacity-0 translate-x-[200%]'} transition-opacity duration-100 cursor-pointer z-3 w-8 h-8 bg-[#2a2a2a] rounded-full absolute top-1/2 right-0 -translate-y-1/2`}
          onClick={() => {
            if (!slider) return;
            const max = slider.scrollWidth - slider.clientWidth;
            if (!(slider.scrollLeft >= max - 1)) {
              slider.scrollBy({ left: step(), behavior: 'smooth' });
            }

            setSection(section + 1);

            if (section === sliderItems.length - 1 && trackMeta.hasNextPage) {
              const nextPage = page + 1;
              getTracks({ page: nextPage });
              setPage(nextPage);
            }
          }}
          type="button"
        >
          <ChevronRightIcon
            className="ml-1"
            strokeWidth={1}
            size={28}
          />
        </button>
      </div>
    </div>
  )
}

export default RelatedTracks;