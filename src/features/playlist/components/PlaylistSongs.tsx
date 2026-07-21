import { PlayIcon, MusicIcon, EllipsisIcon, ClockIcon, CheckIcon } from 'lucide-react';
import type { PlaylistMeta, PlaylistSong } from '../playlist.types';
import { formatTime } from '../../../shared/utils/formatTime';
import { getFmtDate } from '../../../shared/utils/getFormatDate';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import songService from '../../song/services/song.service';
import { DropdownIcon } from '../../../shared/components/Icons';
import SmartImage from '../../../shared/components/SmartImage';
import usePlayer from '../../player/hooks/usePlayer';

interface PlaylistSongsProps {
  items: PlaylistSong[];
  playlistMeta: PlaylistMeta;
  getItem: (item: PlaylistSong) => void;
  onPlay: (index: number) => void;
  loadMore: () => void;
}

const PlaylistSongs: React.FC<PlaylistSongsProps> = (props) => {
  const { items, playlistMeta, loadMore, getItem, onPlay } = props;
  const { currentSong } = usePlayer();
  const { loaderRef } = useInfiniteScroll(() => loadMore());

  const grid = {
    s: 'grid-cols-[minmax(200px,2fr)_28px]',
    sm: 'sm:grid-cols-[40px_minmax(200px,2fr)_40px_40px_28px]',
    md: 'md:grid-cols-[40px_minmax(200px,2fr)_40px_40px_28px]',
    lg: 'lg:grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_40px_40px_28px]'
  }

  return (
    <div className={`overflow-x-auto bg-[#131313] relative ${window.innerWidth <= 768 ? 'hide-scrollbar' : ''}`}>
      <div className={`sm:grid hidden min-w-fit ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} gap-4 px-4 py-2 border-b border-white/10 text-[#adaaaa] text-xs font-semibold tracking-wider`}>
        <span className="text-sm">#</span>
        <span>Título</span>
        <span className="lg:block hidden">Álbum</span>
        <span
          className="lg:block hidden line-clamp-1 truncate text-nowrap"
          title="Fecha en la que se añadió"
        >
          Fecha en la que se añadió
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

      <div className="pb-3 bg-[#131313] min-w-fit">
        {items.map((item, i) => {
          const track = item.song!;
          const isCurrentPlayingNow = currentSong?.id === track.id;
          const cover = songService.songCoverUrl(track?.id, track?.cover);

          return (
            <div
              onClick={() => onPlay(i)}
              className={`min-w-fit grid ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} gap-4 px-4 py-2 items-center sm:rounded hover:bg-white/5 transition-colors group cursor-pointer duration-200 relative`}
              key={item.id}
            >
              <div className={`${isCurrentPlayingNow ? 'text-primary' : 'text-[#adaaaa]'} sm:flex hidden items-center text-sm font-medium`}>
                <span className="group-hover:hidden">
                  {i + 1}
                </span>
                <PlayIcon
                  className="hidden group-hover:block"
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
                    title={track?.title}
                  >
                    {track?.title}
                  </span>
                  <span
                    className="text-[#adaaaa] text-xs truncate transition-colors hover:text-white hover:underline mt-0.5"
                    title={track.artist?.name || ''}
                  >
                    {track?.artist?.name || ''}
                  </span>
                </div>
              </div>

              <div className="lg:block hidden text-[#adaaaa] text-sm truncate group-hover:text-white transition-colors">
                {track?.album?.title || ''}
              </div>

              <div className="lg:block hidden text-[#adaaaa] text-sm truncate select-none">
                {track?.createdAt ? getFmtDate(track?.createdAt, 'dd MMM yyyy') : ''}
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

              <span className="sm:flex hidden text-[#adaaaa] text-sm justify-end">
                {formatTime(track?.duration ?? 0)}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  getItem(item);
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
                  getItem(item);
                }}
                className="sm:group-hover:block hidden ml-auto hover:text-white cursor-pointer"
                type="button"
              >
                <EllipsisIcon size={20} />
              </button>
            </div>
          )
        })}

        {playlistMeta.hasNextPage &&
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

export default PlaylistSongs;