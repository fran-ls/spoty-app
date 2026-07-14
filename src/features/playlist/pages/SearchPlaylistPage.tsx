import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusicIcon } from 'lucide-react';
import type { Playlist, PlaylistFilters } from '../playlist.types';
import playlistService from '../services/playlist.service';
import SmartImage from '../../../shared/components/SmartImage';
import { routes } from '../../../shared/utils/routes';
import Loader from '../../../shared/components/Loader';
import useSearch from '../../../shared/hooks/useSearch';
import { useAppCtx } from '../../../shared/context/AppContext';

const SearchPlaylistPage = () => {
  const { searchQuery } = useAppCtx();

  const [filters] = useState<PlaylistFilters>({
    page: 0,
    limit: 10,
    name: searchQuery.trim()
  });

  const { data, hasMore, loaderRef, getSearch } = useSearch<Playlist>(
    { filters },
    playlistService.searchPublicPlaylists
  );

  useEffect(() => {
    setTimeout(() => getSearch({ ...filters, name: searchQuery.trim() }), 300)
  }, [filters, searchQuery]);

  const grid = {
    s: 'grid-cols-1',
    sm: 'min-[460px]:grid-cols-[repeat(2,1fr)]',
    md: 'min-[940px]:grid-cols-[repeat(3,1fr)]',
    xl: 'xl:grid-cols-[repeat(4,1fr)]'
  }

  const card = {
    s: 'h-[40vw]',
    sm: 'min-[460px]:h-[20vw] min-[460px]:min-h-[120px]',
    md: 'min-[940px]:h-[12vw] min-[940px]:min-h-[130px]',
    xl: 'xl:h-[10vw] min-[940px]:min-h--[150px]'
  }

  const img = {
    s: 'w-[31vw] h-[31vw]',
    sm: 'min-[460px]:w-[16vw] min-[460px]:h-[16vw] min-[460px]:min-w--[130px] min-[460px]:min--h-[130px]',
    md: 'min-[940px]:w-[10vw] min-[940px]:h-[10vw]',
    xl: 'xl:w-[8vw] xl:h-[8vw]'
  }

  return (
    <div
      className="sm:px-6 px-3 py-10 min-h-full bg-surface text-white select-none scroll-smooth animate-fade-in bg-main"
      id="spotify-search-stage"
    >
      {/* Bento Grid Header */}
      <div className="flex justify-between items-end mb-4 px-3">
        <h1 className="text-2xl font-headline font-extrabold tracking-tight text-white select-none">
          Explorar
        </h1>
      </div>

      <div className={`${grid.s} ${grid.sm} ${grid.md} ${grid.xl} grid`}>
        {data.items.map((p) => {
          const cover = playlistService.playlistCover(p.id, p.cover);

          return (
            <div
              className="p-3"
              key={p.id}
            >
              <Link to={`${routes.playlists}/${p.id}`}>
                <div
                  style={{ backgroundColor: p.bgColor }}
                  className={`${card.s} ${card.sm} ${card.md} ${card.xl} group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] shadow-lg flex flex-col justify-between p-4 selection:bg-none`}
                >
                  <h3
                    className="w-[70%] text-2xl font-headline font-extrabold text-white tracking-tight leading-snug wrap-break-word line-clamp-2"
                    title={p.name}
                  >
                    {p.name}
                  </h3>

                  <SmartImage
                    url={cover}
                    icon={(
                      <MusicIcon className="w-[30%] h-[30%] absolute top-1/2 left-1/2 -translate-1/2" />
                    )}
                    styles={{
                      imgWrap: {
                        background: `linear-gradient(to bottom, ${p.bgColor} 0%, ${p.bgColor} 100%)`,
                        boxShadow: '0 0 4px rgb(0, 0, 0, 0.15)'
                      }
                    }}
                    wrapClassName={`${img.s} ${img.sm} ${img.md} ${img.xl} bg-[#262626] absolute -right-5 -bottom-1 rotate-25 rounded shadow-2xl transition-transform duration-500 group-hover:scale-108 group-hover:rotate-20 flex items-center justify-center`}
                  />
                </div>
              </Link>
            </div>
          )
        })}

        {hasMore && (
          <div
            className="flex-1 flex items-center justify-center"
            ref={loaderRef}
          >
            <Loader
              className="border-transparent border-t-slate-200"
              size={28}
              stroke={2}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPlaylistPage;