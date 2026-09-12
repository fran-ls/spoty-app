import { useEffect, useState } from "react";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import SmartImage from "../../../shared/components/SmartImage";
import Loader from "../../../shared/components/Loader";
import songService from "../../song/services/song.service";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import { CustomScrollbar } from "../../../shared/components/CustomScrollbar";

const Queue = () => {
  const {
    queue, queueMeta, currentSong, isPlaying, isQueue, isLoading, currentPlaylist,
    currentIndex, setIsQueue, playQueueSong, togglePlay, getQueueSongs
  } = usePlayer();

  const [queueScrollTop, setQueueScrollTop] = useState(0);
  const [hoverId, setHoverId] = useState('');
  const [page, setPage] = useState(0);

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page > queueMeta.totalPages || isLoading) return;
    const nextPage = page + 1;
    await getQueueSongs(nextPage);
    setPage(nextPage);
  });

  const hasMore = !isLoading && page < queueMeta.totalPages;

  useEffect(() => { setPage(1) }, [currentPlaylist]);

  useEffect(() => {
    const lastIndex = queue.length - 1;

    if (currentIndex === lastIndex && queue.length < queueMeta.total) {
      getQueueSongs(page);
    }
  }, [currentIndex]);

  return (
    <div className={`bg-[#131313] rounded-lg min-h-[calc(100vh-64px-88px)] max-h-[calc(100vh-64px-88px)] w-full transition-all duration-300 absolute left-0  ${isQueue ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      <header
        className="p-4 text-[#adaaaa] relative transition-shadow duration-75"
        style={{
          ...(queueScrollTop && {
            boxShadow: '0 6px 10px #0009'
          })
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-nowrap">
            Cola
          </h3>

          <button
            onClick={() => setIsQueue(false)}
            className="p-1.5 text-[#adaaaa] hover:text-white cursor-pointer rounded-full hover:bg-[#1f1f1f] transition-colors duration-100"
            title="Cerrar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <CustomScrollbar
        scrollbarMode="vertical"
        viewport={{
          className: "overflow-x-hidden relative sidebar-queue",
          style: {
            height: `calc(100vh - 64px - 88px - 64px)`
          },
          onScroll: (e) => setQueueScrollTop(e.currentTarget.scrollTop)
        }}
      >
        <ul className="px-2 pb-2 w-full">
          {queue.map((track, i) => {
            const cover = songService.songCoverUrl(track.id, track.cover);

            return (
              <li
                onPointerEnter={() => setHoverId(track.id)}
                onPointerLeave={() => setHoverId('')}
                className="justify-start p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center"
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
              </li>
            )
          })}

          {hasMore && (
            <li className="flex items-center justify-center py-1 overflow-hidden">
              <div
                className="flex-1 flex items-center justify-center"
                ref={loaderRef}
              >
                <Loader
                  className="border-transparent border-t-slate-200"
                  size={20}
                  stroke={2}
                />
              </div>
            </li>
          )}
        </ul>
      </CustomScrollbar>
    </div>
  )
}

export default Queue;