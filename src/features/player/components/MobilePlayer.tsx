import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, EllipsisVerticalIcon, HeartIcon, ListMusicIcon, MusicIcon, PauseIcon, PlayIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import usePlayer from "../hooks/usePlayer";
import songService from "../../song/services/song.service";
import { formatTime } from "../../../shared/utils/formatTime";
import { getDeviceType } from "../../../shared/utils/getDeviceType";
import { RepeatIcon, ShuffleIcon, SkipForwardIcon } from "../../../shared/components/Icons";
import MobileQueue from "./MobileQueue";
import useAuth from "../../auth/hooks/useAuth";
import { routes } from "../../../shared/utils/routes";
import MobilePlayerModal from "./MobilePlayerModal";

const MobilePlayer = () => {
  const { user } = useAuth();
  const {
    player, currentPlaylist, currentSong, progress, duration, isPlaying, isRepeat, isShuffle,
    seek, next, prev, togglePlay, toggleShuffle, toggleRepeat, onPlayerChange,
    getPlayer, addToPlayHistory
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressEl = progressRef.current;
  const playerWrap = playerRef.current;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isMobileQueue, setIsMobileQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleProgressSeek = (clientX: number) => {
    if (!currentSong || !progressEl) return;
    const rect = progressEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, x / width));
    const targetSecond = Math.floor(ratio * duration);
    seek(targetSecond);
    addToPlayHistory({
      song: {
        ...currentSong,
        duration: duration - targetSecond
      }
    });
  }

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentSong) return;
    handleProgressSeek(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleProgressSeek(moveEvent.clientX);
    }

    const handleMouseUp = () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('pointerup', handleMouseUp);
    }

    window.addEventListener('pointermove', handleMouseMove);
    window.addEventListener('pointerup', handleMouseUp);
  }

  const toggleLikeTrack = async () => {
    if (!currentSong || !currentSong.id) return;
    setIsLiked(!isLiked);
  }

  const onMinimize = () => {
    setIsExpanded(false);
    setIsOpenModal(false);
    setIsMobileQueue(false);
  }

  const song = {
    id: currentSong?.id || '',
    title: currentSong?.title || 'Tema',
    artistName: currentSong?.artist?.name || 'Artista',
    artistId: currentSong?.artistId || '',
    cover: currentSong ? songService.songCoverUrl(currentSong.id, currentSong.cover) : ''
  }

  const playerBg = 'bg-[#212121]';
  const playerImgWidth = playerWrap ? `calc(${playerWrap.offsetWidth}px - 12px * 2)` : '';
  const progressPercent = Math.min(100, (progress / duration) * 100);

  const device = getDeviceType();
  const isDesktop = device === 'desktop';

  const colors = {
    icon: 'text-white/40',
    shadow: '0 0 25px rgb(0, 0, 0, 0.25)'
  }

  useEffect(() => { (user && user.id) && getPlayer(user.id) }, [user]);
  useEffect(() => { player && onPlayerChange(player) }, [player]);

  return (
    <>
      <div
        style={{
          ...(currentPlaylist && {
            background: `linear-gradient(to bottom, ${currentPlaylist.bgColor} 100%, ${currentPlaylist.gradientColor} 100%)`
          })
        }}
        className={`${playerBg} mx-2 w-[calc(100%-8px*2)] rounded-md h-fit overflow-hidden z-50 md:max-w-3xl fixed bottom-14 left-0 google-sans-flex-font`}
      >
        <div
          onClick={() => setIsExpanded(true)}
          className="cursor-pointer p-2 pb-1.5 w-full flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <SmartImage
              styles={{
                imgWrap: {
                  ...(!song.cover && {
                    boxShadow: colors.shadow,
                    background: 'transparent'
                  })
                }
              }}
              wrapClassName="min-w-9 w-9 h-9 bg-[#262626] rounded overflow-hidden shrink-0 group relative cursor-pointer"
              className="aspect-square w-full h-full object-cover transition-transform duration-300"
              url={song.cover}
              icon={(
                <MusicIcon className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-1/2" />
              )}
              onErr={({ e, selectors }) => {
                const el = e.currentTarget.closest(`.${selectors.wrap}`) as HTMLDivElement;
                if (!el) return;
                el.style.boxShadow = colors.shadow;
                el.style.background = 'transparent';
              }}
            />

            <div className="overflow-hidden">
              <h1
                className="text-[13px] font-bold text-white w-full line-clamp-1"
                title={song.title}
              >
                {song.title}
              </h1>
              <span
                className="font-medium text-xs text-white/95 line-clamp-1"
                title={song.artistName}
              >
                {song.artistName}
              </span>
            </div>
          </div>

          <button
            className="ml-auto mr-1 text-white/70 p-1 transition-colors duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeTrack();
            }}
          >
            <HeartIcon className={isLiked ? 'fill-primary stroke-0' : ''} size={25} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="p-1 text-[#adaaaa] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {isPlaying
              ? <PauseIcon fill="#ffffff" size={24} strokeWidth={0} />
              : <PlayIcon fill="#ffffff" size={24} strokeWidth={0} />
            }
          </button>
        </div>

        <div className="mx-2 h-0.5 bg-white/40 rounded-full pointer-events-none transition-all duration-75">
          <div
            style={{
              width: `${progressPercent}%`
            }}
            className="h-full bg-white rounded-full pointer-events-none transition-all duration-75"
          />
        </div>
      </div>

      <div
        style={{
          height: window.innerHeight,
          maxHeight: window.innerHeight,
          minHeight: window.innerHeight,
          transform: `translateY(${isExpanded ? 0 : 100}%)`,
          ...(currentPlaylist && {
            background: `linear-gradient(to bottom, ${currentPlaylist.bgColor} 50%, ${currentPlaylist.gradientColor} 100%)`
          })
        }}
        className={`sm:max-w-100 ${playerBg} overflow-x-hidden overflow-y-auto w-full z-100 fixed bottom-0 left-0 transition-all duration-200 ${!isDesktop ? 'hide-scrollbar' : ''}`}
        ref={playerRef}
      >
        <div className="h-full flex flex-1 flex-col">
          <header className="p-3 pb-4 w-full flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsExpanded(false);
                setIsMobileQueue(false);
              }}
              className="p-2 text-white hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <ChevronDownIcon size={28} />
            </button>

            <Link
              className="hover:underline cursor-pointer overflow-hidden"
              to={`${routes.tracks}/${song.id}`}
              onClick={onMinimize}
            >
              <h2
                className={`${!song.title ? 'uppercase' : ''} text-xs w-full text-center font-bold text-white truncate`}
                title={song.title}
              >
                {song.title}
              </h2>
            </Link>

            <button
              onClick={() => setIsOpenModal(true)}
              className="p-2 text-white hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <EllipsisVerticalIcon className="rotate-90" size={24} />
            </button>
          </header>

          <SmartImage
            styles={{
              imgWrap: {
                width: playerImgWidth || '100%',
                height: playerImgWidth || '100%',
                ...(!song.cover && {
                  borderRadius: '20px',
                  boxShadow: colors.shadow,
                  background: 'transparent'
                })
              }
            }}
            deps={[currentSong]}
            wrapClassName="sm:w-84 sm:h-84 mx-3 w-[calc(100vw-12px*2)] h-[calc(100vw-12px*2)] bg-[#262626] overflow-hidden shadow-2xl shrink-0 group relative"
            className="aspect-square w-full h-full object-cover transition-transform duration-300"
            url={song.cover}
            icon={(
              <MusicIcon className="w-1/4 h-1/4 text-white absolute top-1/2 left-1/2 -translate-1/2" />
            )}
            onErr={({ e, selectors }) => {
              const el = e.currentTarget.closest(`.${selectors.wrap}`) as HTMLDivElement;
              if (!el) return;
              el.style.boxShadow = 'none';
              el.style.background = 'transparent';
            }}
          />

          <div className="px-5 my-8 w-full flex items-center justify-between gap-2">
            <div className="flex flex-col overflow-hidden">
              <Link
                className="group text-white hover:underline cursor-pointer"
                to={`${routes.tracks}/${song.id}`}
                onClick={onMinimize}
              >
                <h1
                  className="text-lg font-bold text-white truncate"
                  title={song.title}
                >
                  {song.title}
                </h1>
              </Link>

              <Link
                className="group text-[#adaaaa] hover:underline truncate cursor-pointer"
                to={`${routes.artists}/${song.artistId}`}
                onClick={onMinimize}
              >
                <span
                  className="font-medium text-sm text-[#adaaaa] group-hover:text-white"
                  title={song.artistName}
                >
                  {song.artistName}
                </span>
              </Link>
            </div>
            <button
              onClick={toggleLikeTrack}
              className="p-1 w-fit h-fit text-[#adaaaa] hover:text-white transition-colors duration-200 cursor-pointer"
              title="Me gusta"
            >
              <HeartIcon className={isLiked ? 'fill-primary stroke-0' : ''} size={24} />
            </button>
          </div>

          {/* Playback Controls */}
          <div className="px-5 pb-3 font-normal flex flex-col items-center gap-2 w-full">
            {/* Timeline Slider Progress */}
            <div className="mb-4 w-full">
              <div
                ref={progressRef}
                onPointerDown={handleProgressMouseDown}
                className="flex-1 rounded-full relative cursor-pointer overflow-visible py-1.5 transition-all group"
              >
                {/* The actual slider line container */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-white/40 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="absolute h-full bg-white rounded-full transition-colors z-10"
                  />
                </div>

                {/* Floating indicator thumb only visible on group-hover */}
                <div
                  style={{ left: `${progressPercent}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-opacity pointer-events-none z-20"
                />
              </div>

              <div className="flex items-center justify-between gap-2.5">
                <span className="text-[12px] text-[#adaaaa] text-right select-none">
                  {formatTime(progress ?? 0)}
                </span>
                <span className="text-[12px] text-[#adaaaa] text-left select-none">
                  {formatTime(duration ?? 0)}
                </span>
              </div>
            </div>

            <div className="relative w-full flex items-center justify-between gap-4">
              <div className="w-full flex items-center gap-2">
                <button
                  onClick={toggleShuffle}
                  className={`h-fit transition-colors duration-100 cursor-pointer relative ${isShuffle ? 'text-primary' : `${colors.icon} hover:text-white`}`}
                  title="Habilitar la reproducción aleatoria"
                >
                  <ShuffleIcon size={30} />
                  {isShuffle && (
                    <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>

                <button
                  onClick={prev}
                  className={`ml-auto p-2 hover:text-white transition-colors duration-200 cursor-pointer ${colors.icon}`}
                  title="Anterior"
                >
                  <SkipForwardIcon className="-rotate-180" />
                </button>
              </div>

              <button
                onClick={togglePlay}
                className="bg-white text-black p-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <PauseIcon size={20} fill="currentColor" className="translate-x-0" />
                ) : (
                  <PlayIcon size={20} fill="currentColor" className="translate-x-px" />
                )}
              </button>

              <div className="w-full flex items-center gap-2">
                <button
                  onClick={next}
                  className={`mr-auto p-2 hover:text-white transition-colors duration-200 cursor-pointer ${colors.icon}`}
                  title="Siguiente"
                >
                  <SkipForwardIcon />
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`h-fit transition-colors duration-100 cursor-pointer relative ${isRepeat ? 'text-primary' : `${colors.icon} hover:text-white`}`}
                  title="Activar repetir"
                >
                  <RepeatIcon className="mb-0.5" size={26} />
                  {isRepeat && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <footer className="flex mt-auto pb-5 px-5">
            <button
              onClick={() => setIsMobileQueue(true)}
              className="text-white p-1 ml-auto cursor-pointer"
              type="button"
            >
              <ListMusicIcon />
            </button>
          </footer>
        </div>
      </div>

      <MobileQueue
        playerWrap={playerWrap}
        isExpanded={isExpanded}
        isMobileQueue={isMobileQueue}
        setIsMobileQueue={setIsMobileQueue}
      />

      {isOpenModal && (
        <div
          style={{
            width: playerWrap ? playerWrap.offsetWidth : '100%'
          }}
          className="google-sans-flex-font flex flex-col gap-8 z-100 bg-black/60 px-4 py-6 fixed top-0 left-0 h-dvh max-h-dvh min-h-dvh"
        >
          <MobilePlayerModal
            song={song}
            isLiked={isLiked}
            onMinimize={onMinimize}
            toggleLikeTrack={toggleLikeTrack}
            onClose={() => setIsOpenModal(false)}
          />
        </div>
      )}
    </>
  )
}

export default MobilePlayer;