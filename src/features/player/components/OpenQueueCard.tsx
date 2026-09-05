import { useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import usePlayer from "../hooks/usePlayer";
import songService from "../../song/services/song.service";

const OpenQueueCard = () => {
  const { isPlaying, currentSong, queue, currentIndex, playQueueSong, togglePlay, setIsQueue } = usePlayer();
  const [hover, setHover] = useState(false);

  const lastIndex = queue.length - 1;
  const nextIndex = currentIndex + 1;
  const nextTrack = nextIndex > lastIndex ? queue[lastIndex] : queue[nextIndex];

  const cover = songService.songCoverUrl(currentSong?.id || '', currentSong?.cover);

  return (
    <div className="p-2 mx-4 mt-1 mb-4 bg-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-2 pb-3 flex items-center justify-between gap-3">
        <span className="text-sm truncate font-bold">
          {nextIndex > lastIndex ? 'Sonando' : 'A continuación en la cola'}
        </span>

        <button
          className="text-[#adaaaa] text-sm text-nowrap font-bold cursor-pointer"
          onClick={() => setIsQueue(true)}
          type="button"
        >
          Abrir cola
        </button>
      </div>

      <div
        className="p-2 justify-start cursor-pointer text-[#adaaaa] hover:bg-[#3f3f3f] rounded-md gap-3 flex items-center"
        onPointerEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="min-w-12 w-12 h-12 rounded relative overflow-hidden hover:badge:bg-blue-500">
          <SmartImage
            referrerPolicy="no-referrer"
            wrapClassName="bg-[#333333]"
            url={cover}
          />

          {(hover && currentSong && currentSong.id !== nextTrack.id) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playQueueSong(nextTrack, nextIndex);
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
          )}

          {(hover && currentSong && currentSong.id === nextTrack.id) && (
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
          )}
        </div>

        <div
          onDoubleClick={() => playQueueSong(nextTrack, nextIndex)}
          className="w-full"
        >
          <h4
            className="mt-1 text-[15px] font-semibold line-clamp-1 text-white"
            title={nextTrack?.title}
          >
            {nextTrack?.title}
          </h4>
          <div className="text-[13px] font-medium">
            <span className="line-clamp-1 w-full">
              {nextTrack?.artist?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenQueueCard;