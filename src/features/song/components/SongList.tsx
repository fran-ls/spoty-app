import { Play, MusicIcon, EllipsisIcon, ClockIcon, CheckIcon } from 'lucide-react';
import type { Song } from '../song.types';
import type { PaginationMeta } from '../../../shared/types/common.types';
import usePlayer from '../../player/hooks/usePlayer';
import { formatTime } from '../../../shared/utils/formatTime';
import { getFmtDate } from '../../../shared/utils/getFormatDate';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import songService from '../services/song.service';
import { DropdownIcon } from '../../../shared/components/Icons';
import SmartImage from '../../../shared/components/SmartImage';

interface SongListProps {
  songs: Song[];
  searchMeta: PaginationMeta;
  hasMore: boolean;
  onPlay: (index: number) => void;
  loadMore: () => void;
  onOpenPlaylistMenu: (track: Song, index: number) => void;
}

const SongList: React.FC<SongListProps> = (props) => {
  const { songs, hasMore, loadMore, onOpenPlaylistMenu, onPlay } = props
  const { currentSong } = usePlayer();
  const { loaderRef } = useInfiniteScroll(() => loadMore());

  const grid = {
    s: 'grid-cols-[minmax(200px,2fr)_28px]',
    sm: 'sm:grid-cols-[4vw_minmax(200px,2fr)_40px_40px_28px]',
    md: 'md:grid-cols-[2vw_minmax(200px,2fr)_40px_40px_28px]',
    lg: 'lg:grid-cols-[2.5vw_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_40px_40px_28px]'
  }

  return (
    <div className={`overflow-x-auto sm:pl-6 sm:pr-3 p-1 ${window.innerWidth <= 768 ? 'hide-scrollbar' : ''}`}>
      <div className={`sm:grid hidden min-w-fit ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} gap-4 px-4 py-2 border-b border-white/10 text-[#adaaaa] text-xs font-semibold tracking-wider`}>
        <span className="-mt-1 text-base text-right font-normal block">#</span>
        <span>Título</span>
        <span className="lg:block hidden">Álbum</span>
        <span
          className="lg:block hidden line-clamp-1 truncate text-nowrap"
          title="Fecha en la que se subió"
        >
          Fecha en la que se subió
        </span>
        <span className="sm:block hidden" />
        <span className="sm:flex hidden items-center justify-end">
          <ClockIcon size={16} strokeWidth={2.5} />
        </span>
        <span className="sm:flex hidden items-center justify-end">
          <div className="relative flex justify-end w-4 h-4">
            <DropdownIcon
              className="fill-[#adaaaa] absolute top-1/2 left-1/2 -translate-1/2"
              size={28}
            />
          </div>
        </span>
      </div>

      <div className="pb-3 min-w-fit">
        {songs.map((track, i) => {
          const isCurrentPlayingNow = currentSong?.id === track.id;
          const cover = songService.songCoverUrl(track.id, track.cover);

          return (
            <div
              className={`min-w-fit grid ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} gap-4 px-4 py-2 items-center sm:rounded hover:bg-white/5 transition-colors group cursor-pointer duration-200 relative`}
              onClick={() => onPlay(i)}
              key={track.id}
            >
              <div className={`${isCurrentPlayingNow ? 'text-primary' : 'text-[#adaaaa]'} sm:flex hidden text-sm font-medium items-center`}>
                <span className="group-hover:hidden text-base text-right font-normal w-full">
                  {i + 1}
                </span>
                <Play
                  className="mx-auto hidden group-hover:block"
                  fill="currentColor"
                  stroke="none"
                  size={13}
                />
              </div>

              <div className="flex items-center gap-3 overflow-hidden">
                <SmartImage
                  wrapClassName="min-w-10 w-10 h-10 bg-[#262626] text-white rounded overflow-hidden relative"
                  url={cover}
                  icon={(
                    <MusicIcon className="text-white" size={20} />
                  )}
                />

                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-semibold truncate text-sm ${isCurrentPlayingNow ? 'text-primary' : 'text-white'}`}
                    title={track.title}
                  >
                    {track.title}
                  </span>
                  <span
                    className="text-[#adaaaa] text-xs truncate transition-colors hover:text-white hover:underline mt-0.5"
                    title={track.artist?.name || ''}
                  >
                    {track.artist?.name || ''}
                  </span>
                </div>
              </div>

              <div className="lg:block hidden text-[#adaaaa] text-sm truncate group-hover:text-white transition-colors">
                {track.album?.title || ''}
              </div>

              <div className="lg:block hidden text-[#adaaaa] text-sm">
                {track?.createdAt ? getFmtDate(track.createdAt, 'dd MMM yyyy') : ''}
              </div>

              <div className="sm:flex hidden items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="group-hover:block hidden bg-primary text-[#131313] cursor-pointer rounded-full p-0.5 transition-transform hover:scale-110 active:scale-95"
                >
                  <CheckIcon fill="transparent" size={12} />
                </button>
              </div>

              <div className="sm:flex hidden text-[#adaaaa] text-sm justify-end">
                {formatTime(track.duration ?? 0)}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlaylistMenu(track, i);
                }}
                className="sm:hidden ml-auto hover:text-white cursor-pointer"
                type="button"
              >
                <EllipsisIcon className="rotate-90" size={20} />
              </button>

              {/* DESKTOP */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlaylistMenu(track, i);
                }}
                className="sm:group-hover:block hidden ml-auto hover:text-white cursor-pointer"
                type="button"
              >
                <EllipsisIcon strokeWidth={2} size={20} />
              </button>
            </div>
          )
        })}

        {hasMore &&
          <div
            className="flex items-center justify-center px-6 py-2 overflow-hidden"
            ref={loaderRef}
          >
            <Loader
              className="border-transparent border-t-slate-200"
              size={20}
              stroke={2}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default SongList;