import React, { useState } from 'react';
import { MusicIcon, XIcon, PauseIcon, PlayIcon, PanelTopCloseIcon } from 'lucide-react';
import { usePlayer } from '../../shared/context/PlayerContext';
import apiService from '../../shared/services/api.service';
import { showMusicIcon } from '../../shared/utils/showMusicIcon';

export const QueueList: React.FC = () => {
  const {
    queue, isPlaying, isQueue, currentSong,
    setIsQueue, playQueueSong, togglePlay
  } = usePlayer();
  const isCollapsed = isQueue;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <aside
      className={`${isCollapsed ? 'w-13' : 'w-72'} rounded-lg hidden md:flex h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 transition-all duration-300 ease-in-out relative`}
      id="spotify-sidebar"
    >
      <div className="rounded-lg min-h-[calc(100vh-64px-88px)] max-h-[calc(100vh-64px-88px)]">
        <header className={`p-4 text-[#adaaaa] relative`}>
          <div className={`${isCollapsed ? 'flex-col gap-4' : 'flex-row'} flex items-center justify-between`}>
            {!isCollapsed &&
              <h3 className="text-white font-black text-nowrap">
                Cola
              </h3>
            }

            <button
              onClick={() => setIsQueue(!isCollapsed)}
              className={`p-1.5 hover:bg-[#1f1f1f] text-[#adaaaa] hover:text-white cursor-pointer ${isCollapsed ? 'bg-white/5 rounded-lg' : 'rounded-full'}`}
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

        <nav className={`${isCollapsed ? 'h-[calc(100vh-64px-88px-64px)]' : 'h-[calc(100vh-64px-88px-64px)]'} overflow-y-auto overflow-x-hidden relative`}>
          <ul className={`${isCollapsed ? 'pl-0 pb-0' : 'pl-2 pb-2'} w-full absolute top-0 left-0`}>
            {queue.map((track, i) => {
              const cover = apiService.songCoverUrl(track.id, track.cover);

              return (
                <li
                  onPointerEnter={() => setHoverIndex(i)}
                  onPointerLeave={() => setHoverIndex(null)}
                  className={`${isCollapsed ? 'justify-center' : 'justify-start'} p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center queue-item`}
                  data-id={track.id}
                  key={track.id}
                >
                  <div className="min-w-12 w-12 h-12 bg-[#262626] rounded relative overflow-hidden hover:badge:bg-blue-500">
                    <MusicIcon className={`${!cover ? '' : 'hidden opacity-0'} absolute top-1/2 left-1/2 -translate-1/2 music-icon`} />

                    {cover && (
                      <img
                        onError={(e) => showMusicIcon(e.currentTarget, '.queue-item')}
                        src={cover}
                        className="object-cover w-full h-full"
                        alt=""
                      />
                    )}

                    {(hoverIndex !== null && hoverIndex === i && currentSong?.id !== track.id) &&
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

                    {(currentSong?.id === track.id && hoverIndex === i) &&
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
                      <div className="text-[13px] font-semibold">
                        <span className="line-clamp-1 w-full">
                          {track.artist.name}
                          {/* {track.albumId} • {track.artist.name} */}
                        </span>
                      </div>
                      <div className="hidden text-[13px] font-semibold className">
                        <span className="line-clamp-1">
                          {track.id}
                        </span> • <span className="truncate">
                          {track.artist.name}
                        </span>
                      </div>
                    </div>
                  }
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
