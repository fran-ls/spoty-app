import { Link, useNavigate } from "react-router-dom";
import { EllipsisIcon, ListIcon, ListPlusIcon, Music2Icon, MusicIcon, PauseIcon, PlayIcon, ShareIcon, UserIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import usePlayer from "../../player/hooks/usePlayer";
import ActionMenu from "../../../shared/components/ActionMenu";
import { getDeviceType } from "../../../shared/utils/getDeviceType";

interface SearchItemProps {
  type?: 'artist' | 'playlist' | 'song';
  isPlayingNow: boolean;
  isHover?: boolean;
  onPlay?: () => void;
  loadImage?: (item: any) => string;
  addToQueue?: () => void;
  payload: () => {
    id: string;
    title: string;
    link: string;
    sub?: string;
    sublink?: string;
  };
  setHoverId: React.Dispatch<React.SetStateAction<string>>;
}

const SearchItem = (props: SearchItemProps) => {
  const {
    isPlayingNow, isHover, type = 'song',
    payload, loadImage, onPlay, addToQueue, setHoverId
  } = props;
  const { isPlaying, togglePlay } = usePlayer();

  const navigate = useNavigate();

  const item = payload();
  const isDesktop = getDeviceType() === 'desktop';

  const is = {
    song: type === 'song',
    artist: type === 'artist',
    playlist: type === 'playlist'
  }

  const grid = {
    sm: 'grid-cols-[1fr_40px]',
    md: 'md:grid-cols-[1fr_250px]'
  }

  return (
    <div className={`hover:bg-[#262626] group rounded-md flex items-center gap-2 text-white google-sans-flex-font ${is.artist ? 'p-4' : 'px-3 py-2'}`}>
      <div className={`${isDesktop ? grid.sm : 'grid-cols-1'} ${grid.md} grid items-center w-full gap-3 relative`}>
        <div className={`flex items-center ${is.artist ? isDesktop ? 'gap-6' : 'gap-3' : 'gap-3'}`}>
          <div className="relative">
            <SmartImage
              wrapClassName={`${isDesktop ? 'w-16 h-16' : 'w-12 h-12'} shrink-0 text-[#7f7f7f]`}
              styles={{
                imgWrap: {
                  boxShadow: '0 4px 60px #00000080',
                  borderRadius: is.artist ? '100%' : '4px'
                }
              }}
              icon={(is.artist
                ? <UserIcon className="w-[40%] h-[40%]" />
                : <MusicIcon className="w-[40%] h-[40%]" />
              )}
              url={loadImage?.(item) || null}
            />

            {(!is.artist && !isPlayingNow) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.();
                }}
                className="group-hover:flex hidden cursor-pointer text-white badge w-full h-full absolute top-0 left-0 bg-black/50 items-center justify-center"
                type="button"
              >
                <PlayIcon
                  fill="currentColor"
                  className="min-w-5.5 w-5.5 h-5.5"
                  stroke="0"
                />
              </button>
            )}

            {(!is.artist && isPlayingNow) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isPlayingNow ? togglePlay() : onPlay?.();
                }}
                className="group-hover:flex hidden cursor-pointer text-white badge w-full h-full absolute top-0 left-0 bg-black/50 items-center justify-center"
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

          <div className="mt-1">
            <Link
              className="hover:underline block"
              to={item.link}
            >
              <span className={`block ${is.artist ? 'md:text-2xl text-base' : 'text-base'} ${!is.artist ? 'font-normal' : !isDesktop ? 'font-medium' : ''}`}>
                {item.title}
              </span>
            </Link>

            {item.sub && (
              item.sublink ? (
                <Link
                  className="hover:underline"
                  to={item.sublink}
                >
                  <span className="text-sm text-[#adaaaa] font-normal">
                    {item.sub}
                  </span>
                </Link>
              ) : (
                <span className="text-sm text-[#adaaaa] font-normal">
                  {item.sub}
                </span>
              )
            )}
          </div>
        </div>

        <div className="md:flex hidden items-center justify-between gap-4">
          <div>
            {!is.artist && (
              <span className="text-xs text-[#b3b3b3] bg-[#ffffff1a] rounded px-1 py-0.5">
                {is.playlist ? 'Lista' : 'Canción'}
              </span>
            )}
          </div>

          {is.artist ? (
            <button
              className={`shadow-[0_8px_8px_rgba(0,0,0,0.3)] bg-primary text-black p-3 rounded-full $$$isPlaying && isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
              onClick={onPlay}
              type="button"
            >
              {(isPlaying && isPlayingNow)
                ? <PauseIcon size={24} fill="currentColor" stroke="none" />
                : <PlayIcon size={24} fill="currentColor" stroke="none" />
              }
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHoverId(item.id);
              }}
              className="hover:text-white text-[#b3b3b3] cursor-pointer"
              type="button"
            >
              <EllipsisIcon size={20} />
            </button>
          )}

          <div
            className={`${isHover ? 'block' : 'hidden'} w-45 z-100 bg-[#282828] rounded absolute bottom-0 -right-1 shadow-[0_0_64px_#000]`}
            onMouseLeave={() => setHoverId('')}
          >
            <ActionMenu
              onClose={() => setHoverId('')}
              styles={{
                wrap: "min-w-[160px]"
              }}
              items={[{
                label: 'Añadir a la cola',
                icon: (
                  <ListPlusIcon size={18} />
                ),
                onAction: () => addToQueue?.()
              }, {
                label: is.playlist ? 'Ver lista' : 'Ver pista',
                icon: (
                  is.playlist
                    ? <ListIcon size={18} />
                    : <Music2Icon size={18} />
                ),
                onAction: () => item.link && navigate(item.link)
              }, {
                label: 'Compartir',
                icon: (
                  <ShareIcon size={18} />
                ),
                onAction: () => setHoverId('')
              }]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchItem;