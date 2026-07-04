import { Play, Heart, Clock, MusicIcon, EllipsisIcon, ChevronDown } from 'lucide-react';
import type { PlaylistMeta, PlaylistSong } from '../playlist.types';
import type { Song } from '../../song/song.types';
import { usePlayer } from '../../../shared/context/PlayerContext';
import { formatTime } from '../../../shared/utils/formatTime';
import { getFmtDate } from '../../../shared/utils/getFormatDate';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import { useState } from 'react';
import songService from '../../song/services/song.service';
import { DropdownIcon } from '../../../shared/components/Icons';
import SmartImage from '../../../shared/components/SmartImage';

interface PlaylistSongsProps {
  songs: Song[];
  items: PlaylistSong[];
  playlistMeta: PlaylistMeta;
  setActiveItem: React.Dispatch<React.SetStateAction<PlaylistSong | null>>;
  loadMore: () => void;
}

const PlaylistSongs: React.FC<PlaylistSongsProps> = (props) => {
  const { songs, items, playlistMeta, loadMore, setActiveItem } = props;

  const { currentSong, play } = usePlayer();
  const { loaderRef } = useInfiniteScroll(() => loadMore());

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isTrackLiked = true;

  return (
    <div className="min-w-full overflow-x-auto overflow-y-hidden bg-[#131313] animate-fade-in z-0 relative">
      <div className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px_28px] gap-4 px-4 py-3 border-b border-white/10 text-[#adaaaa] text-sm font-medium tracking-wider select-none">
        <span>#</span>
        <span>Título</span>
        <span>Álbum</span>
        <span className="text-nowrap">
          Fecha de añadido
        </span>
        <div className="flex justify-end">
          <Clock size={16} />
        </div>
        <div className="relative flex justify-end pr-1">
          <ChevronDown className="hidden" size={16} />
          <DropdownIcon className="absolute top-[calc(100%-12px)] left-1/2 -translate-1/2" size={28} />
        </div>
      </div>

      <div className="flex flex-col gap-1 bg-[#131313]">
        {items.map((item, i) => {
          const track = item.song!;
          const isCurrentPlayingNow = currentSong?.id === item.id;
          const cover = songService.songCoverUrl(track?.id, track?.cover);

          return (
            <div
              onClick={() => play(songs, i, playlistMeta)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="relative grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px_28px] gap-4 px-4 py-2.5 items-center rounded hover:bg-white/5 group cursor-pointer transition-colors duration-200 song-item"
              key={item.id}
            >
              <div className={`${isCurrentPlayingNow ? 'text-primary' : 'text-[#adaaaa] hover:text-[#72fe8f]'} text-sm font-medium flex items-center`}>
                <span className="group-hover:hidden select-none">
                  {i + 1}
                </span>
                <Play
                  className="hidden group-hover:block text-white"
                  fill="currentColor"
                  stroke="none"
                  size={13}
                />
              </div>

              <div className="flex items-center gap-4 overflow-hidden">
                <SmartImage
                  wrapClassName="min-w-10 w-10 h-10 bg-[#262626] text-white rounded overflow-hidden relative"
                  url={cover}
                  icon={(
                    <MusicIcon className="text-white" size={20} />
                  )}
                />

                <div className="flex flex-col min-w-0 select-none">
                  <span
                    className={`font-semibold truncate text-sm leading-tight ${isCurrentPlayingNow ? 'text-primary' : 'text-white'
                      }`}
                    title={track?.title}
                  >
                    {track?.title}
                  </span>
                  <span className="text-[#adaaaa] text-xs truncate hover:text-white hover:underline mt-0.5">
                    {track?.artist?.name}
                  </span>
                </div>
              </div>

              <div className="text-[#adaaaa] text-sm truncate hover:text-white transition-colors select-none">
                {track?.album?.title || 'Sin albúm'}
              </div>

              <div className="text-[#adaaaa] text-sm truncate select-none">
                {track?.createdAt ? getFmtDate(track?.createdAt, 'dd MMM yyyy') : 'dd-MMM-yyyy'}
              </div>

              <div className="text-sm text-[#adaaaa] flex items-center justify-end gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-[#adaaaa] hover:text-white"
                  title="Like song"
                >
                  <Heart
                    size={15}
                    fill={isTrackLiked ? '#72fe8f' : 'transparent'}
                    className={isTrackLiked ? 'text-primary' : 'text-[#adaaaa] hover:text-[#72fe8f]'}
                  />
                </button>

                <span className="w-10 text-right pr-1 select-none">
                  {formatTime(track?.duration ?? 0)}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(item);
                }}
                className={`${hoverIndex === i ? 'block' : 'hidden'} p-1 hover:text-white cursor-pointer`}
                type="button"
              >
                <EllipsisIcon size={20} />
              </button>
            </div>
          )
        })}

        {playlistMeta.page < playlistMeta.totalPages &&
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
        }
      </div>
    </div>
  )
}

export default PlaylistSongs;