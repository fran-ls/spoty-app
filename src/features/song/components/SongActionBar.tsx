import { HeartIcon, PauseIcon, PlayIcon, Share2Icon } from "lucide-react";
import type { PlaylistColors } from "../../playlist/playlist.types";
import type { Track } from "../song.types";
import usePlayer from "../../player/hooks/usePlayer";
import { getDeviceType } from "../../../shared/utils/getDeviceType";
import SongActionBarMenu from "./SongActionBarMenu";
import useAuth from "../../auth/hooks/useAuth";

interface SongActionBarProps {
  track: Track | null;
  colors: PlaylistColors;
  playable: boolean;
  onPlay: () => void;
  setOpenBgEditor: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemove: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongActionBar = (props: SongActionBarProps) => {
  const { track, colors, playable, onPlay, setIsEdit, setIsRemove, setOpenBgEditor } = props;
  const { isPlaying, currentSong, togglePlay } = usePlayer();
  const { user } = useAuth();

  const playingNow = track ? track.id === currentSong?.id : false;
  const isDesktop = getDeviceType() === 'desktop';

  return (
    <>
      {/* Gradient banner */}
      <div
        style={{
          backgroundImage: (
            isDesktop && window.innerWidth >= 500
              ? `linear-gradient(in oklch to bottom, ${colors.base70}, transparent), none`
              : `linear-gradient(in oklch to bottom, ${colors.base} 0%, transparent 40%)`
          ),
          // backgroundImage: `linear-gradient(in oklch to bottom, ${colors.base70}, transparent), none`
        }}
        className="block absolute left-0 sm:h-43.25 min-[500px]:h-25 h-43.25 w-full"
      />

      <div className="flex py-5 px-6 mb-2 text-sm text-[#adaaaa] items-center justify-between relative">
        <div className="max-[500px]:w-full md:gap-5 gap-6 flex items-center">
          {!isDesktop && (
            <>
              <button
                className="max-[500px]:order-1 min-[500px]:hidden flex items-center justify-center h-8 cursor-pointer"
                type="button"
              >
                <HeartIcon className="w-6 h-6" />
              </button>
              <button
                className="max-[500px]:order-2 min-[500px]:hidden flex items-center justify-center h-8 cursor-pointer"
                type="button"
              >
                <Share2Icon className="w-5.5 h-5.5" />
              </button>
            </>
          )}

          <button
            className={`max-[500px]:ml-auto max-[500px]:order-4 min-[500px]:w-[10vw] min-[500px]:h-[10vw] max-w-14 max-h-14 w-[14vw] h-[14vw] rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black ${!playable ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82] cursor-pointer'}`}
            onClick={() => playingNow ? togglePlay() : onPlay()}
            disabled={!playable}
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {(isPlaying && playable && playingNow) ?
              <PauseIcon
                className="w-1/2 h-1/2 max-w-6 max-h-6 translate-x-0"
                fill="currentColor"
                stroke="none"
              /> :
              <PlayIcon
                className="w-1/2 h-1/2 max-w-6 max-h-6 translate-x-px"
                fill="currentColor"
                stroke="none"
              />
            }
          </button>

          <SongActionBarMenu
            isOwner={user?.role === 'ADMIN'}
            setIsEdit={setIsEdit}
            setOpenBgEditor={setOpenBgEditor}
            setIsRemove={setIsRemove}
          />
        </div>
      </div>
    </>
  )
}

export default SongActionBar;