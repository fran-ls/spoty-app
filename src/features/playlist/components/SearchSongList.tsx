import { MusicIcon, PlusIcon } from 'lucide-react';
import type { Song } from '../../song/song.types';
import type { SearchMeta } from '../../../shared/types/common.types';
import Loader from '../../../shared/components/Loader';
import SmartImage from '../../../shared/components/SmartImage';
import songService from '../../song/services/song.service';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';

interface SearchSongListProps {
  songs: Song[];
  paginationMeta: SearchMeta;
  loadMore: () => any;
  addSongToPlaylist: (id: string) => void;
}

const SearchSongList = (props: SearchSongListProps) => {
  const { songs, paginationMeta, loadMore, addSongToPlaylist } = props;
  const { loaderRef } = useInfiniteScroll(() => paginationMeta.hasNextPage && loadMore());

  const grid = {
    s: 'grid-cols-[1fr_40px]',
    sm: 'sm:grid-cols-[minmax(200px,2fr)_80px]',
    md: 'md:grid-cols-[minmax(200px,2fr)_minmax(120px,1fr)_80px]'
  }

  return (
    <div className="flex flex-col gap-1 animate-fade-in bg-[#131313] overflow-x-auto">
      {songs.map((track) => {
        const cover = songService.songCoverUrl(track.id, track.cover);

        return (
          <div
            className={`min-w-fit grid ${grid.s} ${grid.sm} ${grid.md} gap-4 p-2.5 items-center sm:rounded hover:bg-white/5 group transition-colors duration-200`}
            key={track.id}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <SmartImage
                wrapClassName="min-w-10 w-10 h-10 bg-[#262626] text-white rounded overflow-hidden relative"
                icon={<MusicIcon size={20} />}
                url={cover}
              />

              <div className="flex flex-col min-w-0 select-none">
                <span
                  className="block font-semibold truncate text-sm leading-tight text-white"
                  title={track.title}
                >
                  {track.title}
                </span>
                <span
                  className="block line-clamp-1 w-full text-[#adaaaa] text-xs truncate hover:text-white hover:underline mt-0.5"
                  title={track.artist?.name}
                >
                  {track.artist?.name}
                </span>
              </div>
            </div>

            <div className="md:block hidden text-[#adaaaa] text-sm truncate hover:text-white transition-colors select-none">
              {track?.album?.title || ''}
            </div>

            <div className="text-xs text-white flex items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addSongToPlaylist(track.id);
                }}
                className=" hover:bg-[#0e0e0e] font-semibold sm:px-4 sm:py-1.5 p-1 sm:w-fit sm:h-fit w-5 h-5 sm:border border-2 sm:border-white/40 border-white rounded-full duration-200 cursor-pointer hover:border-white hover:text-white relative"
              >
                <span className="sm:block hidden">Añadir</span>
                <PlusIcon
                  className="sm:fill-current fill-white sm:hidden block absolute top-1/2 left-1/2 -translate-1/2"
                  strokeWidth={3}
                  size={16}
                />
              </button>
            </div>
          </div>
        )
      })}

      {(paginationMeta.page < paginationMeta.totalPages) && (
        <div
          className="flex items-center justify-center px-6 py-1 overflow-hidden"
          ref={loaderRef}
        >
          <Loader
            className="border-transparent border-t-slate-200"
            size={20}
            stroke={2}
          />
        </div>
      )}
    </div>
  )
}

export default SearchSongList;