import { useMemo, useRef, useState } from 'react';
import { PauseIcon, PlayIcon, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../../../shared/utils/formatTime';

interface PlayerProps {
  file: File | null;
  url: string;
}

export const Player: React.FC<PlayerProps> = ({ file, url }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPause, setIsPause] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(1);

  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }

  const handleProgressSeek = (clientX: number) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, x / width));
    const targetSecond = Math.floor(ratio * duration);
    seek(targetSecond);
  }

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressSeek(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleProgressSeek(moveEvent.clientX);

      if (progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const hoverXPos = moveEvent.clientX - rect.left;
        const width = rect.width;
        const clickRatio = Math.max(0, Math.min(1, hoverXPos / width));
        const targetSecond = Math.floor(clickRatio * duration);
        setHoverTime(targetSecond);
        setHoverX(Math.max(0, Math.min(width, hoverXPos)));
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const hoverXPos = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = Math.max(0, Math.min(1, hoverXPos / width));
    const targetSecond = Math.floor(clickRatio * duration);
    setHoverTime(targetSecond);
    setHoverX(hoverXPos);
  }

  const handleProgressMouseLeave = () => {
    if (!isDragging) setHoverTime(null);
  }

  const volumeSeek = (clientX: number) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const clickRatio = Math.max(0, Math.min(1, clickX / width));
    setVolume(clickRatio);
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    volumeSeek(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      volumeSeek(moveEvent.clientX);
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  const play = () => {
    if (!audioRef.current || isPlaying) return;
    audioRef.current.src = url;
    setIsPlaying(true);
  }

  const togglePlay = () => {
    if (!audioRef.current || !file) return;

    play();

    if (!isPause) {
      audioRef.current.pause();
      setIsPause(true);
    } else {
      audioRef.current.play();
      setIsPause(false);
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }

  const progressPercent = Math.min(100, (progress / duration) * 100);
  const volumePercent = volume * 100;

  useMemo(() => {
    if (progress > 0 && progress === duration) {
      setIsPlaying(false);
      setIsPause(true);
    }
  }, [progress]);

  useMemo(() => {
    setIsPlaying(false);
    setIsPause(true);

    const audio = audioRef.current;

    if (audio) {
      setProgress(0);
      audio.src = url;
    }
  }, [file]);

  return (
    <>
      <div className="bg-surface-container-low w-full p-3 rounded-lg flex flex-col items-center gap-2">
        <div className="flex items-center justify-between gap-2.5 w-full group">
          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer"
            title={!isPause ? "Pausar" : "Reproducir"}
          >
            {!isPause
              ? <PauseIcon size={16} fill="currentColor" className="translate-x-0" />
              : <PlayIcon size={16} fill="currentColor" className="translate-x-px" />
            }
          </button>

          <div className="w-full">
            <div className="text-[#adaaaa] text-[10px] flex items-center justify-between">
              <span
                className="text-xs line-clamp-1 select-text"
                title={file?.name}
              >
                {file?.name}
              </span>
              <div className="flex items-center gap-1 font-medium">
                <span className="text-right select-none">
                  {formatTime(progress ?? 0)}
                </span>
                <span>/</span>
                <span className="text-left select-none">
                  {formatTime(duration ?? 0)}
                </span>
              </div>
            </div>

            <div
              ref={progressRef}
              onMouseDown={handleProgressMouseDown}
              onMouseOver={handleProgressMouseMove}
              onMouseMove={handleProgressMouseMove}
              onMouseLeave={handleProgressMouseLeave}
              className="flex-1 rounded-full relative cursor-pointer overflow-visible py-1.5 transition-all"
            >
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                {hoverTime !== null && progressRef.current && (
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, (hoverX / progressRef.current.getBoundingClientRect().width) * 100))}%`
                    }}
                    className="absolute h-full bg-white/50 rounded-full pointer-events-none transition-all duration-75"
                  />
                )}

                <div
                  style={{ width: `${progressPercent}%` }}
                  className="absolute h-full bg-primary rounded-full transition-colors group-hover:bg-[#63ef82] z-10"
                />
              </div>

              <div
                style={{ left: `${progressPercent}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
              />

              {hoverTime !== null && (
                <div
                  style={{ left: `${hoverX}px` }}
                  className="absolute bottom-3 -translate-x-1/2 bg-[#2a2a2a] backdrop-blur-md text-white text-[12px] px-2 py-1 rounded shadow-2xl pointer-events-none z-50 whitespace-nowrap"
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={() => {
            if (!audioRef.current) return;
            setProgress(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (!audioRef.current) return;
            setDuration(audioRef.current.duration);
          }}
          crossOrigin="anonymous"
        />
      </div>

      {/* VOLUME */}
      <div className="hidden items-center justify-end gap-4 w-[30%] min-w-50">
        <button
          onClick={toggleMute}
          className="text-[#adaaaa] hover:text-white transition-all cursor-pointer"
          title={isMuted || !volume ? 'No silenciar' : 'Silenciar'}
        >
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Volume Slider */}
        <div
          ref={volumeRef}
          onMouseDown={handleVolumeChange}
          className="py-1.5 flex items-center gap-2 w-24 group px-1 rounded-full"
        >
          <div className="flex-1 rounded-full relative cursor-pointer">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${volumePercent}%` }}
                className="h-full bg-white group-hover:bg-primary transition-colors"
              />
            </div>
            <div
              style={{ left: `${volumePercent}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            />
          </div>
        </div>
      </div>
    </>
  )
}
