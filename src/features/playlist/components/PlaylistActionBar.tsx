import { useState } from "react";
import { HeartIcon, ListIcon, PauseIcon, PlayIcon, Share2Icon } from "lucide-react";
import type { Playlist, PlaylistColors, PlaylistDTO } from "../playlist.types";
import type { PlaylistLayout } from "../../library/library.types";
import PlaylistActionsMenu from "./PlaylistActionsMenu";
import LayoutMenu from "./LayoutMenu";
import usePlayer from "../../player/hooks/usePlayer";
import { getDeviceType } from "../../../shared/utils/getDeviceType";

interface PlaylistActionBarProps {
  layout: PlaylistLayout;
  form: PlaylistDTO;
  playlist: Playlist | null;
  colors: PlaylistColors;
  isPlaylistOwner: boolean;
  playable: boolean;
  onPlay: () => void;
  onChangeVisibility: () => void;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemove: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenBgEditor: React.Dispatch<React.SetStateAction<boolean>>;
  setLayout: React.Dispatch<React.SetStateAction<PlaylistLayout>>;
}

const PlaylistActionBar = (props: PlaylistActionBarProps) => {
  const {
    playlist, form, isPlaylistOwner, colors, playable, layout, setLayout,
    onPlay, setIsEdit, setOpenBgEditor, setIsRemove, onChangeVisibility
  } = props;
  const { currentPlaylist, isPlaying, togglePlay, onPlaylistChange } = usePlayer();
  const [isLayoutMenu, setIsLayoutMenu] = useState(false);
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
          )
          // backgroundImage: `linear-gradient(in oklch to bottom, color-mix(in srgb, ${bgColor} 70%, transparent), transparent), none`
        }}
        className="block absolute left-0 sm:h-43.25 min-[500px]:h-25 h-43.25 w-full"
      />

      <div className="flex min-[500px]:pt-5 pb-5 px-6 mb-2 text-sm text-[#adaaaa] items-center justify-between relative">
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
            onClick={() => {
              if (currentPlaylist?.id === playlist?.id) {
                return togglePlay();
              }

              onPlaylistChange(playlist);
              onPlay();
            }}
            disabled={!playable}
            className={`max-[500px]:ml-auto max-[500px]:order-4 min-[500px]:w-[10vw] min-[500px]:h-[10vw] max-w-14 max-h-14 w-[14vw] h-[14vw] rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black ${!playable ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82] cursor-pointer'}`}
            title={isPlaying ? "Pausar lista" : "Reproducir lista"}
          >
            {(isPlaying && playable && playlist?.id === currentPlaylist?.id) ?
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

          <PlaylistActionsMenu
            form={form}
            isPlaylistOwner={isPlaylistOwner}
            setIsEdit={setIsEdit}
            setIsRemove={setIsRemove}
            setOpenBgEditor={setOpenBgEditor}
            onChangeVisibility={() => playlist?.id && onChangeVisibility()}
          />
        </div>

        <div className="min-[500px]:block hidden relative">
          <button
            onClick={() => setIsLayoutMenu(!isLayoutMenu)}
            className="font-semibold hover:text-white cursor-pointer h-8 flex items-center gap-2"
            type="button"
          >
            <span>Lista</span>
            <ListIcon className="inline-flex" size={20} />
          </button>

          {isLayoutMenu && (
            <LayoutMenu
              layout={layout}
              setLayout={setLayout}
              onClose={() => setIsLayoutMenu(!isLayoutMenu)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default PlaylistActionBar;