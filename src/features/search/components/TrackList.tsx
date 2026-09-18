import { useState } from 'react';
import { PlayIcon, MusicIcon, EllipsisIcon, ClockIcon, CheckIcon, PauseIcon } from 'lucide-react';
import type { PaginationMeta } from '../../../shared/types/common.types';
import type { Track } from '../../song/song.types';
import { formatTime } from '../../../shared/utils/formatTime';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import songService from '../../song/services/song.service';
import { DropdownIcon } from '../../../shared/components/Icons';
import SmartImage from '../../../shared/components/SmartImage';
import usePlayer from '../../player/hooks/usePlayer';
import SongActionsMenu from '../../song/components/SongActionsMenu';

interface TrackListProps {
  items: Track[];
  paginationMeta: PaginationMeta;
  loadMore: () => void;
}

const TrackList = (props: TrackListProps) => {
  const { items, paginationMeta, loadMore } = props;
  const { isPlaying, currentSong, togglePlay, play, onPlaylistChange } = usePlayer();
  const { loaderRef } = useInfiniteScroll(() => loadMore());

  const [activeTrack, setActiveTrack] = useState<Track | null>(null);

  const grid = {
    s: 'grid-cols-[minmax(200px,2fr)_28px]',
    sm: 'sm:grid-cols-[5vw_minmax(200px,2fr)_40px_40px_28px]',
    md: 'md:grid-cols-[4vw_minmax(200px,2fr)_40px_40px_28px]',
    lg: 'lg:grid-cols-[2.5vw_minmax(200px,2fr)_minmax(120px,1fr)_40px_40px_28px]'
  }

  const onPlay = (track: Track, isPlayingNow: boolean) => {
    if (isPlayingNow) return togglePlay();
    play([track], 0, paginationMeta);
    onPlaylistChange(null);
  }

  return (
    <div className={`relative ${window.innerWidth <= 768 ? 'hide-scrollbar' : ''}`}>
      <div className={`sm:grid hidden min-w-fit ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} gap-4 pr-4 py-2 border-b border-white/10 text-[#adaaaa] text-xs font-semibold tracking-wider`}>
        <span className="-mt-1 text-base text-right font-normal block">#</span>
        <span>Título</span>
        <span className="lg:inline-flex hidden">Álbum</span>
        <span className="sm:inline-flex hidden" />
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

      <div className="pb-3 bg--[#131313] min-w-fit">
        {items.map((track, i) => {
          const isPlayingNow = track.id === currentSong?.id;
          const cover = songService.songCoverUrl(track?.id, track?.cover);

          return (
            <div
              className={`min-w-fit grid ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} gap-4 sm:pr-4 sm:px-0 px-4 py-2 items-center sm:rounded hover:bg-white/5 transition-colors group cursor-pointer duration-200 relative`}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onPlay(track, isPlayingNow);
              }}
              key={track.id}
            >
              <button
                className={`${isPlayingNow ? 'text-primary' : 'text-[#adaaaa]'} group-hover:pl-4 sm:flex hidden items-center text-sm font-medium`}
                onClick={() => onPlay(track, isPlayingNow)}
                type="button"
              >
                <span className="group-hover:hidden ml-auto text-base text-right font-normal">
                  {i + 1}
                </span>

                {(isPlayingNow && isPlaying) ? (
                  <PauseIcon
                    className="ml-auto min-w-4 min-h-4 group-hover:flex hidden"
                    fill="#b3b3b3"
                    stroke="none"
                    size={16}
                  />
                ) : (
                  <PlayIcon
                    className="ml-auto min-w-4 min-h-4 group-hover:flex hidden"
                    fill="#b3b3b3"
                    stroke="none"
                    size={16}
                  />
                )}
              </button>

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
                    className={`font-semibold truncate text-sm ${isPlayingNow ? 'text-primary' : 'text-white'}`}
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
                  setActiveTrack(track);
                }}
                className="sm:group-hover:block sm:hidden ml-auto text-[#b3b3b3] cursor-pointer"
                type="button"
              >
                <EllipsisIcon
                  className="sm:rotate-0 rotate-90"
                  size={20}
                />
              </button>

              {(track.id === activeTrack?.id) && (
                <div
                  className={`z-3 absolute right-1 shadow-[0_16px_24px_#0000004d,0_6px_8px_#0003] ${i > 1 ? 'bottom-1' : 'top-1'}`}
                  onMouseLeave={() => setActiveTrack(null)}
                >
                  <SongActionsMenu
                    unbox={true}
                    track={track}
                    isPlaylistOwner={false}
                    onClose={() => setActiveTrack(null)}
                  />
                </div>
              )}
            </div>
          )
        })}

        {paginationMeta.hasNextPage && (
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
        )}
      </div>
    </div>
  )
}

export default TrackList;