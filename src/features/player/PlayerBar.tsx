import React, { useRef, useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart,
  Volume2, VolumeX, List, Radio, Laptop,
  MusicIcon,
} from 'lucide-react';
import { usePlayer } from '../../shared/context/PlayerContext';
import { formatTime } from '../../shared/utils/formatTime';
import { showMusicIcon } from '../../shared/utils/showMusicIcon';
import songService from '../song/services/song.service';

export const PlayerBar: React.FC = () => {
  const {
    currentSong, progress, duration, isPlaying, volume, isMuted, isQueue,
    seek, next, prev, togglePlay, setVolume, toggleMute, setIsQueue
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isRepeat: boolean = false;
  const isShuffle: boolean = false;
  const isLiked: boolean = true;

  const handleProgressSeek = (clientX: number) => {
    if (!currentSong || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, x / width));
    const targetSecond = Math.floor(ratio * duration);
    seek(targetSecond);
  }

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentSong) return;
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
    if (!currentSong || !progressRef.current) return;
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

  const progressPercent = Math.min(100, (progress / duration) * 100);
  const volumePercent = volume * 100;
  const songCover = currentSong ? songService.songCoverUrl(currentSong.id, currentSong.cover) : '';

  // useEffect(() => {
  //   if (currentIndex >= queue.length - 1 && progress === duration) {
  //     // setIsPlaying(false);
  //   }
  // }, [progress]);

  return (
    <footer
      className="px-4 py-2 fixed bottom-0 left-0 w-full z-50 h-22 bg-black backdrop-blur-3xl flex justify-between items-center select-none playback-bar"
      id="spotify-playback-bar"
    >
      {/* LEFT: Track Info */}
      <div className="lg:flex hidden items-center gap-4 w-[30%] min-w-50">
        <div className="w-14 h-14 bg-[#262626] rounded overflow-hidden shadow-2xl shrink-0 group relative cursor-pointer">
          <MusicIcon className={`${!songCover ? '' : 'hidden opacity-0'} text-white absolute top-1/2 left-1/2 -translate-1/2 music-icon`} />

          {songCover && (
            <img
              onError={(e) => showMusicIcon(e.currentTarget, '.playback-bar')}
              src={songCover}
              className="w-full h-full object-cover transition-transform duration-300"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              alt=""
            />
          )}
        </div>

        {currentSong &&
          <>
            <div className="flex flex-col truncate min-w-0 pr-2 max-w-64">
              <span className="text-sm font-bold text-white hover:underline cursor-pointer truncate">
                {currentSong?.title}
              </span>
              <span className="text-xs text-[#adaaaa] hover:text-white hover:underline cursor-pointer truncate mt-0.5">
                {currentSong?.artist?.name}
              </span>
            </div>
            <button
              // onClick={() => toggleLikeTrack(currentSong?.id)}
              className={`shrink-0 transition-transform duration-150 active:scale-75 hover:scale-115 cursor-pointer ${isLiked ? 'text-primary' : 'text-[#adaaaa] hover:text-white'
                }`}
            >
              <Heart size={16} fill={isLiked ? '#72fe8f' : 'transparent'} />
            </button>
          </>
        }
      </div>

      {/* CENTER: Playback Controls */}
      <div className="flex flex-col items-center gap-2 lg:w-[40%] w-full lg:max-w-150">
        {/* Buttons Grid */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              // onClick={toggleShuffle}
              className={`p-2 transition-colors duration-200 cursor-pointer relative ${isShuffle ? 'text-primary' : 'text-[#adaaaa] hover:text-white'
                }`}
              title="Habilitar la reproducción aleatoria"
            >
              <Shuffle size={16} />
              {isShuffle && (
                <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={prev}
              className="p-2 text-[#adaaaa] hover:text-white transition-colors duration-200 cursor-pointer"
              title="Anterior"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>
          </div>

          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <Pause size={16} fill="currentColor" className="translate-x-0" />
            ) : (
              <Play size={16} fill="currentColor" className="translate-x-px" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={next}
              className="p-2 text-[#adaaaa] hover:text-white transition-colors duration-200 cursor-pointer"
              title="Siguiente"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>

            <button
              // onClick={toggleRepeat}
              className={`p-2 transition-colors duration-200 cursor-pointer relative ${isRepeat ? 'text-primary' : 'text-[#adaaaa] hover:text-white'
                }`}
              title="Activar repetir"
            >
              <Repeat size={16} />
              {isRepeat && (
                <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Timeline Slider Progress */}
        <div className="max-w-125 flex items-center justify-between gap-2.5 w-full group">
          <span className="text-[12px] text-[#adaaaa] w-8 text-right select-none">
            {formatTime(progress ?? 0)}
          </span>
          <div
            ref={progressRef}
            onMouseDown={handleProgressMouseDown}
            onMouseOver={handleProgressMouseMove}
            onMouseMove={handleProgressMouseMove}
            onMouseLeave={handleProgressMouseLeave}
            className="flex-1 rounded-full relative cursor-pointer overflow-visible py-1.5 transition-all"
          >
            {/* The actual slider line container */}
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

            {/* Floating indicator thumb only visible on group-hover */}
            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
            />

            {/* Hover tooltip displaying the target time */}
            {hoverTime !== null && (
              <div
                style={{ left: `${hoverX}px` }}
                className="absolute bottom-3 -translate-x-1/2 bg-[#2a2a2a] backdrop-blur-md text-white text-[12px] px-2 py-1 rounded shadow-2xl pointer-events-none z-50 whitespace-nowrap"
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>
          <span className="text-[12px] text-[#adaaaa] w-8 text-left select-none">
            {formatTime(duration ?? 0)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume & Secondary Controls */}
      <div className="lg:flex hidden items-center justify-end gap-4 w-[30%] min-w-50">
        <button
          onClick={() => setIsQueue(!isQueue)}
          className="text-[#adaaaa] hover:text-primary transition-all cursor-pointer"
          title="Cola"
          type="button"
        >
          <List size={18} />
        </button>
        <button
          className="text-[#adaaaa] hover:text-primary transition-all cursor-pointer"
          title="Conectar a un dispositivo"
          type="button"
        >
          <Radio size={18} />
        </button>
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
        <button
          className="text-[#adaaaa] hover:text-primary transition-all cursor-pointer"
          title="Abrir el Minireproductor"
          type="button"
        >
          <Laptop size={18} />
        </button>
      </div>
    </footer>
  )
}
