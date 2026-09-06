import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "lucide-react";
import useArtist from "../hooks/useArtist";
import SmartImage from "../../../shared/components/SmartImage";
import artistService from "../services/artist.service";
import { routes } from "../../../shared/utils/routes";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";

const ArtistsPage = () => {
  const { artists, artistMeta, searchArtists } = useArtist();

  const [page, setPage] = useState(1);

  const { loaderRef } = useInfiniteScroll(async () => {
    if (!artistMeta.hasNextPage) return;
    const nextPage = page + 1;
    await searchArtists({ page: nextPage });
    setPage(nextPage);
  });

  useEffect(() => { searchArtists({ page }) }, []);

  return (
    <div className="sm:px-8 px-4 py-8 text-white">
      <h1 className="mb-5 text-2xl font-bold font-headline tracking-tight">
        Artistas
      </h1>

      <ul className="md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] min-[500px]:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] grid grid-cols-2 overflow-x-hidden overflow-y-auto relative">
        {artists.map((a) => {
          const cover = artistService.artistImage(a.id, a.image);

          return (
            <li
              className={`min-w-full grow max-w-50 group h-fit group hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 flex flex-col playlist-item cursor-pointer`}
              key={a.id}
            >
              <Link to={`${routes.artists}/${a.id}`}>
                <div className="shadow-[0_8px_24px_#00000080] relative mb-2 aspect-square rounded-full overflow-hidden bg-[#333333]">
                  <SmartImage
                    wrapClassName="w-full h-full bg-transparent"
                    referrerPolicy="no-referrer"
                    url={cover}
                    icon={(
                      <UserIcon className="w-1/4 h-1/4" />
                    )}
                  />
                </div>

                <h3
                  className="hover:underline text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
                  style={{
                    fontWeight: 500
                  }}
                  title={a.name}
                >
                  {a.name || ''}
                </h3>

                <span className="text-sm text-[#adaaaa] leading-relaxed">
                  Artista
                </span>
              </Link>
            </li>
          )
        })}

        {artistMeta.hasNextPage && (
          <li className="flex-1 flex items-center justify-center py-1 overflow-hidden">
            <div
              className="flex-1 flex items-center justify-center"
              ref={loaderRef}
            >
              <Loader
                className="border-transparent border-t-slate-200"
                size={20}
                stroke={2}
              />
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default ArtistsPage;