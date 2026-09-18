import { useState } from 'react';
import { PlayIcon, MusicIcon, EllipsisIcon, CheckIcon } from 'lucide-react';
import type { PaginationMeta } from '../../../shared/types/common.types';
import type { Track } from '../../song/song.types';
import { PlaylistLayout } from '../../library/library.types';
import { formatTime } from '../../../shared/utils/formatTime';
import { getFmtDate } from '../../../shared/utils/getFormatDate';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import songService from '../../song/services/song.service';
import SmartImage from '../../../shared/components/SmartImage';
import usePlayer from '../../player/hooks/usePlayer';
import SongActionsMenu from '../../song/components/SongActionsMenu';

interface ArtistSongsProps {
  layout: PlaylistLayout;
  items: Track[];
  paginationMeta: PaginationMeta;
  getItem?: (item: Track) => void;
  loadMore: () => void;
}

const ArtistSongs = (props: ArtistSongsProps) => {
  const { items, paginationMeta, layout, loadMore, getItem } = props;
  const { currentSong, play } = usePlayer();
  const { loaderRef } = useInfiniteScroll(() => loadMore());

  const [activeTrack, setActiveTrack] = useState<Track | null>(null);

  const grid = {
    s: 'grid-cols-[minmax(200px,2fr)_28px]',
    sm: 'sm:grid-cols-[5vw_minmax(200px,2fr)_40px_40px_28px]',
    md: 'md:grid-cols-[4vw_minmax(200px,2fr)_40px_40px_28px]',
    lg: 'lg:grid-cols-[2.5vw_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_40px_40px_28px]'
  }

  return (
    <section className={`sm:px-5 p-1 animate-fade-in overflow-x--auto relative ${window.innerWidth <= 768 ? 'hide-scrollbar' : ''}`}>
      <h2 className="md:text-2xl sm:text-xl max-[640px]:mx-4 text-lg font-bold ml-1 mb-4">
        Canciones
      </h2>

      <div className="pb-3 min-w-fit">
        {items.map((t, i) => {
          const isPlayingNow = currentSong?.id === t.id;
          const cover = songService.songCoverUrl(t.id, t.cover);

          return (
            <div
              onClick={() => play(items, i, paginationMeta)}
              className={`min-w-fit grid ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} ${layout === PlaylistLayout.LIST ? 'py-2' : 'py-1'} gap-4 sm:pr-4 sm:px-0 px-4 items-center sm:rounded hover:bg-white/5 transition-colors group cursor-pointer duration-200 relative`}
              key={t.id}
            >
              <div className={`${isPlayingNow ? 'text-primary' : 'text-[#adaaaa]'} group-hover:pl-4 sm:flex hidden items-center text-sm font-medium`}>
                <span className="group-hover:hidden ml-auto text-base text-right font-normal">
                  {i + 1}
                </span>

                <PlayIcon
                  className="ml-auto min-w-4 min-h-4 group-hover:flex hidden"
                  fill="currentColor"
                  stroke="none"
                  size={16}
                />
              </div>

              <div className="min-h-6 flex items-center gap-3 overflow-hidden">
                {layout === PlaylistLayout.LIST && (
                  <SmartImage
                    wrapClassName="min-w-10 w-10 h-10 bg-[#262626] text-white rounded overflow-hidden relative"
                    url={cover}
                    icon={(
                      <MusicIcon className="text-[#adaaaa] w-[40%] h-[40%]" />
                    )}
                  />
                )}

                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-semibold truncate text-sm ${isPlayingNow ? 'text-primary' : 'text-white'}`}
                    title={t?.title}
                  >
                    {t?.title}
                  </span>

                  {layout === PlaylistLayout.LIST && (
                    <span
                      className="text-[#adaaaa] text-xs truncate transition-colors hover:text-white hover:underline mt-0.5"
                      title={t.artist?.name || ''}
                    >
                      {t?.artist?.name || ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:block hidden text-[#adaaaa] text-sm truncate group-hover:text-white transition-colors">
                {t?.album?.title || ''}
              </div>

              <div className="lg:block hidden text-[#adaaaa] text-sm truncate select-none">
                {t?.createdAt ? getFmtDate(t?.createdAt, 'dd MMM yyyy') : ''}
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
                {formatTime(t?.duration ?? 0)}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  getItem?.(t);
                  setActiveTrack(t);
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
                  getItem?.(t);
                  setActiveTrack(t);
                }}
                className="sm:group-hover:block hidden ml-auto hover:text-white cursor-pointer"
                type="button"
              >
                <EllipsisIcon size={20} />
              </button>

              {(t.id === activeTrack?.id) && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`z-3 absolute right-1 bottom-1 shadow-[0_16px_24px_#0000004d,0_6px_8px_#0003]`}
                  onMouseLeave={() => setActiveTrack(null)}
                >
                  <SongActionsMenu
                    unbox={true}
                    track={t}
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
    </section>
  )
}

export default ArtistSongs;