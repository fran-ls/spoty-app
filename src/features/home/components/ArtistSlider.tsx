import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, UserIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import { routes } from "../../../shared/utils/routes";
import { hasScroll } from "../../../shared/utils/scroll";
import useArtist from "../../artist/hooks/useArtist";
import artistService from "../../artist/services/artist.service";

const ArtistSlider = () => {
  const { artists, searchArtists } = useArtist();

  const sliderRef = useRef<HTMLDivElement>(null);
  const slider = sliderRef.current!;

  const [isPrevBtn, setIsPrevBtn] = useState(false);
  const [isNextBtn, setIsNextBtn] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const step = () => slider.clientWidth / 2;

  useEffect(() => { searchArtists() }, []);
  useEffect(() => { slider && setIsNextBtn(hasScroll(slider).horizontal) }, [artists]);

  return (
    <section className="mb-12" id="home-recommendations-section">
      <div className="px-8 flex justify-between items-end mb-3">
        <h2 className="text-2xl font-bold font-headline text-white hover:underline cursor-pointer tracking-tight">
          Artistas
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
          {artists.map((a) => {
            const cover = artistService.artistImage(a.id, a.image);

            return (
              <div
                className="min-w-50 grow max-w-50 group h-fit group hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 cursor-pointer flex flex-col playlist-item"
                // onClick={() => navigate(`${routes.playlists}/${h.id}`)}
                key={a.id}
              >
                <div className="relative mb-2 aspect-square rounded-full overflow-hidden bg-[#333333]">
                  <SmartImage
                    wrapClassName="bg-transparent"
                    url={cover}
                    styles={{
                      imgWrap: 'w-full h-full bg-transparent',
                      iconWrap: 'w-[20%] h-[20%]'
                    }}
                    icon={(
                      <UserIcon className="w-full h-full" />
                    )}
                  />
                </div>

                <Link
                  className="hover:underline"
                  to={`${routes.playlists}/${a.id}`}
                >
                  <h3
                    className="font-light text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
                    title={a.name}
                  >
                    {a.name}
                  </h3>
                </Link>
                <p className="text-sm text-[#adaaaa] line-clamp-2 leading-relaxed">
                  Artista
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

export default ArtistSlider;