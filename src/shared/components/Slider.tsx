import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "lucide-react";
import { hasScroll } from "../utils/scroll";
import SmartImage from "./SmartImage";
import { getValue } from "../utils/getValue";
import usePlayer from "../../features/player/hooks/usePlayer";
import PlaylistCoverImgs from "../../features/playlist/components/PlaylistCoverImgs";

interface SliderProps {
  keys: {
    title: string;
    subtext?: string;
  };
  title?: string;
  subtext?: string;
  items: any[];
  icon?: React.ReactElement;
  linkToRedirect?: string;
  linkToViewAll?: string;
  playable?: boolean;
  loadImage?: (item: Record<string, any>) => string;
  isCurrentPlaying?: (item: Record<string, any>) => boolean;
  onPlay?: (item: Record<string, any>) => void;
}

const Slider = (props: SliderProps) => {
  const {
    title, subtext, keys, items, icon, linkToRedirect, playable = true,
    linkToViewAll, loadImage, isCurrentPlaying, onPlay
  } = props;

  const { isPlaying, togglePlay } = usePlayer();

  const sliderRef = useRef<HTMLDivElement>(null);
  const slider = sliderRef.current!;

  const [isPrevBtn, setIsPrevBtn] = useState(false);
  const [isNextBtn, setIsNextBtn] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const navigate = useNavigate();

  const step = () => slider.clientWidth / 2;

  useEffect(() => {
    if (slider) {
      const IsScroll = hasScroll(slider).horizontal;
      slider && setIsNextBtn(IsScroll);
    }
  }, [items]);

  return (
    <section className="mb-12">
      {title && (
        <div className="px-8 flex justify-between items-end mb-3">
          <h2 className="text-2xl font-bold font-headline text-white hover:underline cursor-pointer tracking-tight">
            {title}
          </h2>

          {linkToViewAll && (
            <Link
              className="text-[#adaaaa] font-bold text-[13px] hover:underline cursor-pointer select-none"
              to={linkToViewAll || '/'}
            >
              Mostrar todos
            </Link>
          )}
        </div>
      )}

      <div
        className={`relative overflow-hidden ${isPrevBtn && window.innerWidth >= 640 ? 'slider-before' : ''} ${isNextBtn && window.innerWidth >= 640 ? 'slider-after' : ''}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <button
          className={`${isPrevBtn && isHover ? 'opacity-100 transition-all' : 'opacity-0 translate-x-[-200%]'} transition-opacity duration-100 cursor-pointer z-3 w-8 h-8 bg-[#2a2a2a] rounded-full absolute top-1/2 left-7 -translate-y-1/2`}
          onClick={() => {
            if (slider && slider.scrollLeft > 0) {
              slider.scrollBy({ left: -step(), behavior: 'smooth' });
            }
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
          className="flex overflow-auto relative hide-scrollbar slider"
          onScroll={(e) => {
            const target = e.currentTarget;
            setIsPrevBtn(target.scrollLeft > 0);

            const max = target.scrollWidth - target.clientWidth;
            setIsNextBtn(!(target.scrollLeft >= max - 1));
          }}
          ref={sliderRef}
        >
          {items.map((it) => {
            const cover = loadImage ? loadImage(it) : null;
            const title = getValue(it, keys.title);
            const isCurrent = isCurrentPlaying?.(it) || false;
            const isCoverImgs = it.coverImages && it.coverImages.length > 3;

            return (
              <div
                className={`min-w-50 grow max-w-50 group h-fit group hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 flex flex-col playlist-item ${linkToRedirect ? 'cursor-pointer' : ''}`}
                onClick={() => linkToRedirect && navigate(`${linkToRedirect}/${it.id}`)}
                key={it.id}
              >
                <div className="shadow-[0_8px_24px_#00000080] relative mb-2 aspect-square rounded-md overflow-hidden bg-[#333333]">
                  <SmartImage
                    wrapClassName="bg-transparent"
                    referrerPolicy="no-referrer"
                    url={cover}
                    icon={icon}
                    styles={{
                      imgWrap: 'w-full h-full bg-transparent',
                      icon: 'w-[40%] h-[40%]'
                    }}
                  />

                  {!cover && isCoverImgs && (
                    <PlaylistCoverImgs images={it.coverImages || []} />
                  )}

                  {playable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isCurrent ? togglePlay() : onPlay?.(it);
                      }}
                      className={`shadow-[0_8px_8px_rgba(0,0,0,0.3)] absolute bottom-3 right-3 bg-primary text-black p-3 rounded-full opacity-0 ${isPlaying && isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
                      type="button"
                    >
                      {isPlaying && isCurrent
                        ? <PauseIcon size={24} fill="currentColor" stroke="none" />
                        : <PlayIcon size={24} fill="currentColor" stroke="none" />
                      }
                    </button>
                  )}
                </div>

                {linkToRedirect ? (
                  <Link
                    className="hover:underline"
                    to={`${linkToRedirect}/${it.id}`}
                  >
                    <h3
                      className="font-light text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
                      title={title || undefined}
                    >
                      {title || ''}
                    </h3>
                  </Link>
                ) : (
                  <h3
                    className="font-light text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
                    title={title || undefined}
                  >
                    {title || ''}
                  </h3>
                )}

                {(keys.subtext || subtext) && (
                  <p className="text-sm text-[#adaaaa] line-clamp-2 leading-relaxed">
                    {keys.subtext ? getValue(it, it[keys.subtext]) : subtext}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <button
          className={`${isNextBtn && isHover ? 'opacity-100 transition-all' : 'opacity-0 translate-x-[200%]'} transition-opacity duration-100 cursor-pointer z-3 w-8 h-8 bg-[#2a2a2a] rounded-full absolute top-1/2 right-7 -translate-y-1/2`}
          onClick={() => {
            if (!slider) return;
            const max = slider.scrollWidth - slider.clientWidth;
            if (!(slider.scrollLeft >= max - 1)) {
              slider.scrollBy({ left: step(), behavior: 'smooth' });
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
    </section>
  )
}

export default Slider;