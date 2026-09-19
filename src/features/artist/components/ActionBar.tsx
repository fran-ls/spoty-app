import { useState } from "react";
import { EllipsisIcon, HeartIcon, ListIcon, PaletteIcon, PauseIcon, PlayIcon, Share2Icon, TextAlignJustifyIcon } from "lucide-react";
import type { PlaylistColors } from "../../playlist/playlist.types";
import type { Artist } from "../artist.types";
import LayoutMenu from "../../playlist/components/LayoutMenu";
import usePlayer from "../../player/hooks/usePlayer";
import { getDeviceType } from "../../../shared/utils/getDeviceType";
import artistService from "../services/artist.service";
import { PlaylistLayout } from "../../library/library.types";
import ActionMenu from "../../../shared/components/ActionMenu";
import useAuth from "../../auth/hooks/useAuth";

interface ActionBarProps {
  layout: PlaylistLayout;
  artist: Artist | null;
  colors: PlaylistColors;
  playable: boolean;
  isOwner: boolean;
  onPlay: () => void;
  setLayout: React.Dispatch<React.SetStateAction<PlaylistLayout>>;
  setOpenBgEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionBar = (props: ActionBarProps) => {
  const { artist, colors, playable, layout, isOwner, onPlay, setLayout, setOpenBgEditor } = props;
  const { isPlaying, togglePlay } = usePlayer();
  const { user } = useAuth();

  const [isLayoutMenu, setIsLayoutMenu] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [playingNow, setPlayingNow] = useState(false);

  const cover = artist ? artistService.artistImage(artist.id, artist.image) : null;
  const isDesktop = getDeviceType() === 'desktop';
  const owner = isOwner || user?.role === 'ADMIN';

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
        }}
        className="block absolute left-0 sm:h-43.25 min-[500px]:h-25 h-43.25 w-full"
      />

      <div className="flex min-[500px]:py-5 px-6 mb-2 text-sm text-[#adaaaa] items-center justify-between relative">
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
              if (playingNow) return togglePlay();
              setPlayingNow(true);
              onPlay();
            }}
            disabled={!playable}
            className={`max-[500px]:ml-auto max-[500px]:order-4 min-[500px]:w-[10vw] min-[500px]:h-[10vw] max-w-14 max-h-14 w-[14vw] h-[14vw] rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black ${!playable ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82] cursor-pointer'}`}
            title={isPlaying ? "Pausar lista" : "Reproducir lista"}
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

          {cover && (
            <div className="min-[500px]:block hidden w-10 h-12 p-0.5 border-2 border-[#adaaaa] rounded-lg overflow-hidden">
              <img
                className="rounded w-full h-full object-cover"
                src={cover}
                onError={(e) => e.currentTarget.style.display = 'none'}
                alt="cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="max-[500px]:order-3 relative">
            <button
              onClick={() => owner && setIsOpenMenu(!isOpenMenu)}
              className="flex items-center justify-center h-8 cursor-pointer"
              type="button"
            >
              <EllipsisIcon className="min-[500px]:w-8 min-[500px]:h-8 min-[500px]:rotate-0 w-6 h-6 rotate-90" />
            </button>

            {(isOpenMenu && owner) &&
              <div
                onMouseLeave={() => setIsOpenMenu(false)}
                className="z-10 absolute bottom-10 left-0"
                style={{
                  boxShadow: '0 16px 24px #0000004d,0 6px 8px #0003'
                }}
              >
                <ActionMenu
                  onClose={() => setIsOpenMenu(false)}
                  styles={{
                    wrap: "min-w-[160px]"
                  }}
                  items={[{
                    label: 'Fondo',
                    icon: (
                      <PaletteIcon size={18} />
                    ),
                    onAction: () => setOpenBgEditor(true)
                  }]}
                />
              </div>
            }
          </div>
        </div>

        <div
          className="min-[500px]:block hidden relative"
          onMouseLeave={() => setIsLayoutMenu(false)}
        >
          {isLayoutMenu && (
            <div
              onMouseOver={() => setIsLayoutMenu(true)}
              className="h-6 w-full absolute top-[95%]"
            />
          )}

          <button
            onClick={() => setIsLayoutMenu(!isLayoutMenu)}
            className="font-semibold hover:text-white cursor-pointer h-8 flex items-center gap-2"
            type="button"
          >
            {layout === 'LIST' && (
              <>
                <span>Lista</span>
                <ListIcon className="inline-flex" size={20} />
              </>
            )}
            {layout === 'COMPACT_LIST' && (
              <>
                <span>Compacto</span>
                <TextAlignJustifyIcon className="inline-flex" size={20} />
              </>
            )}
          </button>

          {isLayoutMenu && (
            <LayoutMenu
              layout={layout}
              backdrop={false}
              setLayout={setLayout}
              onClose={() => setIsLayoutMenu(!isLayoutMenu)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ActionBar;