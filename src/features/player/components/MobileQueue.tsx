import { useState } from "react";
import { XIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import songService from "../../song/services/song.service";
import usePlayer from "../hooks/usePlayer";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import { getDeviceType } from "../../../shared/utils/getDeviceType";

interface MobileQueueProps {
  isExpanded: boolean;
  isMobileQueue: boolean;
  playerWrap: HTMLDivElement | null;
  setIsMobileQueue: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileQueue = (props: MobileQueueProps) => {
  const { isExpanded, isMobileQueue, playerWrap, setIsMobileQueue } = props;
  const {
    currentSong, currentPlaylist, queue, queueMeta, isLoading,
    playQueueSong, getQueueSongs
  } = usePlayer();

  const [queueScrollTop, setQueueScrollTop] = useState(0);

  const [page, setPage] = useState(0);
  const { loaderRef } = useInfiniteScroll(async () => {
    if (page > queueMeta.totalPages) return;
    const nextPage = page + 1;
    await getQueueSongs(nextPage);
    setPage(nextPage);
  });

  const device = getDeviceType();
  const isDesktop = device === 'desktop';

  return (
    <div
      style={{
        transform: `translateY(${(isMobileQueue && isExpanded) ? 0 : 100}%)`,
        maxWidth: playerWrap?.offsetWidth || '400px',
        boxShadow: '0 0 12px #0009',
        ...(currentPlaylist && {
          background: `linear-gradient(to bottom, ${currentPlaylist.bgColor} 50%, ${currentPlaylist.bgColor} 100%)`
        })
      }}
      className="transition-all duration-100 bg-[#131313] w-full h-[70dvh] z-100 fixed bottom-0 left-0 rounded-t-3xl overflow-hidden"
    >
      <header
        style={{
          boxShadow: queueScrollTop ? '0 3px 12px #0005' : ''
        }}
        className="flex items-center justify-between gap-2 py-4 pt-5 px-5 transition-shadow duration-75"
      >
        <h2 className="text-white font-black truncate">
          {currentPlaylist?.name || 'Cola'}
        </h2>
        <button
          onClick={() => setIsMobileQueue(false)}
          className="text-gray-400 p-1"
          type="button"
        >
          <XIcon size={20} />
        </button>
      </header>

      <ul
        className={`px-2 pb-4 w-full h-full max-h-[calc(100%-64px)] overflow-y-auto ${!isDesktop ? 'hide-scrollbar' : ''}`}
        onScroll={(e) => setQueueScrollTop(e.currentTarget.scrollTop)}
      >
        {queue.map((track, i) => {
          const cover = songService.songCoverUrl(track.id, track.cover);

          return (
            <li
              className={`py-2 px-3 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] gap-3 flex items-center`}
              onClick={() => playQueueSong(track, i)}
              onPointerOver={(e) => {
                e.currentTarget.style.background = '#ffffff2f';
              }}
              onPointerOut={(e) => {
                e.currentTarget.style.background = '';
              }}
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
                    boxShadow: '0 0 12px rgb(0, 0, 0, 0.25)',
                    ...(!cover && {
                      background: 'transparent'
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

        {(!isLoading && page < queueMeta.totalPages) && (
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