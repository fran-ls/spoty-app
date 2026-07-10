import { useRef, useState } from "react";
import { XIcon } from "lucide-react";
import SmartImage from "../../shared/components/SmartImage";
import songService from "../song/services/song.service";
import { usePlayer } from "../../shared/context/PlayerContext";
import Loader from "../../shared/components/Loader";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";
import playlistService from "../playlist/services/playlist.service";

interface MobileQueueProps {
  isExpanded: boolean;
  isMobileQueue: boolean;
  playerWrap: HTMLDivElement | null;
  setIsMobileQueue: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileQueue = (props: MobileQueueProps) => {
  const { isExpanded, isMobileQueue, playerWrap, setIsMobileQueue } = props;
  const {
    currentSong, currentPlaylist, queue, queueMeta,
    setQueueMeta, setQueue, playQueueSong
  } = usePlayer();

  const ulQueueRef = useRef<HTMLUListElement>(null);
  const ulQueue = ulQueueRef.current;

  const [page, setPage] = useState(0);
  const { loaderRef } = useInfiniteScroll(() => {
    if (page > queueMeta.totalPages) return;
    const nextPage = page + 1;
    getQueueSongs(nextPage);
    setPage(nextPage);
  });

  async function getQueueSongs(page: number) {
    if (page <= 1) return;

    if (!queueMeta.playlistId) {
      const { data } = await songService.searchSongs({ page, limit: 10 });
      if (!data) return;
      setQueueMeta({ ...queueMeta, ...data.meta });
      setQueue((prev) => [...prev, ...data.items]);
      return;
    }

    const { data } = await playlistService.getPlaylistSongs(queueMeta.playlistId, { page, limit: 10 });
    if (!data) return;
    setQueueMeta(data.meta);
    setQueue((prev) => [...prev, ...data.songs]);
  }

  return (
    <div
      style={{
        transform: `translateY(${(isMobileQueue && isExpanded) ? 0 : 100}%)`,
        maxWidth: playerWrap?.offsetWidth || '400px'
      }}
      className="transition-all duration-100 bg-[#262626] w-full h-[70dvh] z-100 fixed bottom-0 left-0 rounded-t-3xl overflow-hidden"
    >
      <div
        style={{
          boxShadow: ulQueue && ulQueue.scrollTop > 0 ? '0 0 20px #0e0e0e' : ''
        }}
        className="flex items-center justify-between gap-2 py-4 pt-5 px-5"
      >
        <h2 className="text-white font-black truncate">
          {currentPlaylist.name || 'Cola'}
        </h2>
        <button
          onClick={() => setIsMobileQueue(false)}
          className="text-gray-400 p-1"
          type="button"
        >
          <XIcon size={20} />
        </button>
      </div>

      <ul
        className="px-3 pb-4 w-full h-full max-h-[calc(100%-64px)] overflow-y-auto hide-scrollbar"
        ref={ulQueueRef}
      >
        {queue.map((track, i) => {
          const cover = songService.songCoverUrl(track.id, track.cover);

          return (
            <li
              className={`p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] gap-3 flex items-center`}
              onClick={() => playQueueSong(track, i)}
              data-id={track.id}
              key={track.id}
            >
              <SmartImage
                styles={{
                  imgWrap: {
                    width: '40px',
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    ...(!cover && {
                      background: 'transparent',
                      boxShadow: '0 0 12px rgb(0, 0, 0, 0.25)'
                    })
                  }
                }}
                url={cover}
              />

              <div>
                <h4
                  className={`mt-1 text-sm font-semibold line-clamp-1 ${track.id === currentSong?.id ? 'text-primary' : 'text-white'}`}
                  title={track.title}
                >
                  {track.title}
                </h4>
                <div className="text-xs">
                  <span className="line-clamp-1 w-full">
                    {track.artist?.name}
                  </span>
                </div>
              </div>
            </li>
          )
        })}

        {(queue.length > 0 && page < queueMeta.totalPages) && (
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
    </div>
  )
}

export default MobileQueue;