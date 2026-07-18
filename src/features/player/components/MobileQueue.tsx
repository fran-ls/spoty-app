import { useState } from "react";
import { XIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import songService from "../../song/services/song.service";
import { usePlayer } from "../../../shared/context/PlayerContext";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import playlistService from "../../playlist/services/playlist.service";
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
    currentSong, currentPlaylist, queue, queueMeta,
    setQueueMeta, setQueue, playQueueSong
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

  async function getQueueSongs(page: number) {
    if (page <= 1) return;

    if (!queueMeta.playlistId) {
      const { data } = await songService.searchSongs({ page, limit: 10 });
      if (!data) return;
      setQueueMeta({ ...queueMeta, ...data.meta });
      setQueue((prev) => [...prev, ...data.items]);
      return;
    }

    const { data } = await playlistService.getPlaylistSongs(
      queueMeta.playlistId,
      { page, limit: 10 }
    );
    if (!data) return;
    setQueueMeta(data.meta);
    setQueue((prev) => [...prev, ...data.songs]);
  }

  return (
    <div
      style={{
        transform: `translateY(${(isMobileQueue && isExpanded) ? 0 : 100}%)`,
        maxWidth: playerWrap?.offsetWidth || '400px',
        boxShadow: '0 0 10px #0009',
        background: `linear-gradient(to bottom, ${currentPlaylist.bgColor} 50%, ${currentPlaylist.bgColor} 100%)`
      }}
      className="transition-all duration-100 bg-[#131313] w-full h-[70dvh] z-100 fixed bottom-0 left-0 rounded-t-3xl overflow-hidden"
    >
      <div
        style={{
          boxShadow: queueScrollTop ? '0 6px 12px #0005' : ''
        }}
        className="flex items-center justify-between gap-2 py-4 pt-5 px-5 transition-shadow duration-75"
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
        className={`px-3 pb-4 w-full h-full max-h-[calc(100%-64px)] overflow-y-auto ${!isDesktop ? 'hide-scrollbar' : ''}`}
        onScroll={(e) => setQueueScrollTop(e.currentTarget.scrollTop)}
      >
        {queue.map((track, i) => {
          const cover = songService.songCoverUrl(track.id, track.cover);

          return (
            <li
              className={`p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] gap-3 flex items-center`}
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