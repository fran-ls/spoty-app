import { useState } from 'react';
import { Play, Heart, Clock, MusicIcon, EllipsisIcon } from 'lucide-react';
import type { Song } from '../song.types';
import type { PaginationMeta } from '../../../shared/types/common.types';
import { usePlayer } from '../../../shared/context/PlayerContext';
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
  loadMore: () => void;
  onOpenPlaylistMenu: (track: Song, index: number) => void;
}

const SongList: React.FC<SongListProps> = (props) => {
  const { songs, searchMeta, loadMore, onOpenPlaylistMenu } = props
  const { currentSong, play } = usePlayer();
  const { loaderRef } = useInfiniteScroll(() => loadMore());

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isTrackLiked = true;

  return (
    <div className="min-w-0 w-full">
      <div className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px_28px] gap-4 px-4 py-3 mx-8 border-b border-white/10 text-[#adaaaa] text-sm font-medium tracking-wider select-none">
        <span>#</span>
        <span>Título</span>
        <span>Álbum</span>
        <span className="text-nowrap">
          Fecha de publicación
        </span>
        <div className="flex justify-end pr-1">
          <Clock size={16} />
        </div>
        <div className="relative flex justify-end pr-1">
          <DropdownIcon className="absolute top-[calc(100%-12px)] left-1/2 -translate-1/2" size={28} />
        </div>
      </div>

      <div className="overflow-x-auto w-full px-8 pb-8 flex flex-col gap-1 animate-fade-in bg-[#131313]">
        {songs.map((track, i) => {
          const isCurrentPlayingNow = currentSong?.id === track.id;
          const cover = songService.songCoverUrl(track.id, track.cover);

          return (
            <div
              onClick={() => play(songs, i, { ...searchMeta, playlistId: '', totalDuration: 0 })}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px_28px] gap-4 px-4 py-2.5 items-center rounded hover:bg-white/5 group cursor-pointer transition-colors duration-200 song-item"
              key={track.id}
            >
              {/* # column - shows number or nice Play/Pause icon on hover */}
              <div className={`${isCurrentPlayingNow ? 'text-primary' : 'text-[#adaaaa] hover:text-[#72fe8f]'} text-sm font-medium flex items-center`}>
                <span className="group-hover:hidden select-none">{i + 1}</span>
                <Play
                  className="hidden group-hover:block text-white"
                  fill="currentColor"
                  stroke="none"
                  size={13}
                />
              </div>

              {/* TITLE column - thumb, name status highlights */}
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
                    title={track.title}
                  >
                    {track.title}
                  </span>
                  <span className="text-[#adaaaa] text-xs truncate hover:text-white hover:underline mt-0.5">
                    {track.artist?.name}
                  </span>
                </div>
              </div>

              <div className="text-[#adaaaa] text-sm truncate hover:text-white transition-colors select-none">
                {track.albumId ?? 'Sin albúm'}
              </div>

              <div className="text-[#adaaaa] text-sm truncate select-none">
                {getFmtDate(track.createdAt, 'dd MMM yyyy')}
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
                  {formatTime(track.duration)}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlaylistMenu(track, i);
                }}
                className={`${hoverIndex === i ? 'block' : 'hidden'} p-1 hover:text-white cursor-pointer`}
                type="button"
              >
                <EllipsisIcon size={20} />
              </button>
            </div>
          )
        })}

        {searchMeta.page < searchMeta.totalPages &&
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

export default SongList;