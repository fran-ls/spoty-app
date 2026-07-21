import { useEffect, useRef, useState } from 'react';
import { XIcon, PauseIcon, PlayIcon, PanelTopCloseIcon } from 'lucide-react';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import songService from '../../song/services/song.service';
import SmartImage from '../../../shared/components/SmartImage';
import { hasScroll } from '../../../shared/utils/scroll';
import usePlayer from '../hooks/usePlayer';

export const QueueList = () => {
  const {
    currentPlaylist, queue, queueMeta, isPlaying, isQueue, currentSong, currentIndex,
    isLoading, setIsQueue, playQueueSong, togglePlay, getQueueSongs
  } = usePlayer();

  const [page, setPage] = useState(0);
  const { loaderRef } = useInfiniteScroll(async () => {
    if (page > queueMeta.totalPages || isLoading) return;
    const nextPage = page + 1;
    await getQueueSongs(nextPage);
    setPage(nextPage);
  });

  const navRef = useRef<HTMLElement>(null);

  const [queueVerticalScroll, setQueueVerticalScroll] = useState(false);
  const [queueScrollTop, setQueueScrollTop] = useState(0);
  const [isHoverQueue, setIsHoverQueue] = useState(false);
  const [hoverId, setHoverId] = useState('');

  const hasMore = !isLoading && page < queueMeta.totalPages;
  const isCollapsed = isQueue;

  useEffect(() => { currentPlaylist && getQueueSongs(1) }, [currentPlaylist]);

  useEffect(() => {
    const lastIndex = queue.length - 1;

    if (currentIndex === lastIndex && queue.length < queueMeta.total) {
      getQueueSongs(page);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (navRef.current) {
      const verticalScroll = hasScroll(navRef.current).vertical;
      setQueueVerticalScroll(verticalScroll);
    }
  }, [queue, isCollapsed]);

  return (
    <aside
      className={`${isCollapsed ? 'w-18' : 'w-72'} rounded-lg hidden md:flex h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 transition-all duration-300 ease-in-out relative`}
      id="spotify-sidebar"
    >
      <div className="rounded-lg min-h-[calc(100vh-64px-88px)] max-h-[calc(100vh-64px-88px)]">
        <header
          style={{
            ...(queueScrollTop && {
              boxShadow: '0 6px 10px #0009'
            })
          }}
          className="p-4 text-[#adaaaa] relative transition-shadow duration-75"
        >
          <div className={`${isCollapsed ? 'flex-col gap-4' : 'flex-row'} flex items-center justify-between`}>
            {!isCollapsed &&
              <h3 className="text-white font-black text-nowrap">
                Cola
              </h3>
            }

            <button
              onClick={() => setIsQueue(!isCollapsed)}
              className={`p-1.5 text-[#adaaaa] hover:text-white cursor-pointer ${isCollapsed ? 'rounded-lg' : 'rounded-full hover:bg-[#1f1f1f]'} transition-colors duration-100`}
              title={isCollapsed ? "Abrir Cola" : "Cerrar"}
            >
              {isCollapsed ? (
                <PanelTopCloseIcon
                  className="-rotate-90"
                  size={20}
                />
              ) : (
                <XIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <nav
          className={`${isCollapsed ? 'h-[calc(100vh-64px-88px-64px)]' : 'h-[calc(100vh-64px-88px-64px)]'} ${isHoverQueue ? '' : 'hide---scrollbar'} overflow-y-auto overflow-x-hidden relative sidebar-queue`}
          onScroll={(e) => setQueueScrollTop(e.currentTarget.scrollTop)}
          onMouseEnter={() => setIsHoverQueue(true)}
          onMouseLeave={() => setIsHoverQueue(false)}
          ref={navRef}
        >
          <ul
            style={{
              ...((!queueVerticalScroll && !isCollapsed) && {
                paddingRight: '8px'
              })
            }}
            className={`${isCollapsed ? 'pl-0 pb-0' : 'pl-2 pb-2'} w-full absolute top-0 left-0`}
          >
            {queue.map((track, i) => {
              const cover = songService.songCoverUrl(track.id, track.cover);

              return (
                <li
                  onPointerEnter={() => setHoverId(track.id)}
                  onPointerLeave={() => setHoverId('')}
                  className={`${isCollapsed ? 'justify-center' : 'justify-start'} p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center`}
                  data-id={track.id}
                  key={track.id}
                >
                  <div className="min-w-12 w-12 h-12 rounded relative overflow-hidden hover:badge:bg-blue-500">
                    <SmartImage
                      wrapClassName="bg-[#333333]"
                      url={cover}
                    />

                    {(hoverId !== null && hoverId === track.id && currentSong?.id !== track.id) &&
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playQueueSong(track, i);
                        }}
                        className="cursor-pointer text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center"
                        type="button"
                      >
                        <PlayIcon
                          fill="currentColor"
                          className="min-w-5.5 w-5.5 h-5.5"
                          stroke="0"
                        />
                      </button>
                    }

                    {(currentSong?.id === track.id && hoverId === track.id) &&
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="cursor-pointer text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center"
                        type="button"
                      >
                        {!isPlaying ? (
                          <PlayIcon
                            fill="currentColor"
                            className="min-w-5.5 w-5.5 h-5.5"
                            stroke="0"
                          />
                        ) : (
                          <PauseIcon
                            fill="currentColor"
                            className="min-w-5 w-5 h-5"
                            stroke="0"
                          />
                        )}
                      </button>
                    }
                  </div>

                  {!isCollapsed &&
                    <div onDoubleClick={() => playQueueSong(track, i)}>
                      <h4
                        className={`mt-1 text-[15px] font-semibold line-clamp-1 ${track.id === currentSong?.id ? 'text-primary' : 'text-white'}`}
                        title={track.title}
                      >
                        {track.title}
                      </h4>
                      <div className="text-[13px] font-medium">
                        <span className="line-clamp-1 w-full">
                          {track.artist?.name}
                        </span>
                      </div>
                    </div>
                  }
                </li>
              )
            })}

            {hasMore && (
              <li
                className="flex items-center justify-center px-6 py-1 overflow-hidden"
                ref={loaderRef}
              >
                <Loader
                  className="border-transparent border-t-slate-200"
                  size={20}
                  stroke={2}
                />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
