import { Link } from "react-router-dom";
import { HeartIcon, Music2Icon, MusicIcon, Share2Icon, UserIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import usePlayer from "../hooks/usePlayer";
import { routes } from "../../../shared/utils/routes";

type Song = {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  cover: string | null;
}

interface MobilePlayerModalProps {
  song: Song;
  isLiked: boolean;
  toggleLikeTrack: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

const MobilePlayerModal = (props: MobilePlayerModalProps) => {
  const { song, isLiked, toggleLikeTrack, onMinimize, onClose } = props;
  const { currentPlaylist } = usePlayer();

  return (
    <>
      <div className="mt-12 flex items-center gap-4">
        <SmartImage
          styles={{
            imgWrap: {
              ...(!song.cover && {
                boxShadow: '0 0 25px rgb(0, 0, 0, 0.25)',
                ...(currentPlaylist && {
                  background: currentPlaylist.bgColor,
                })
              })
            }
          }}
          wrapClassName="w-15 h-15 bg-[#262626] overflow-hidden shadow-2xl shrink-0 group relative cursor-pointer"
          className="aspect-square w-full h-full object-cover transition-transform duration-300"
          url={song.cover}
          icon={(
            <MusicIcon className="w-[35%] h-[35%] absolute top-1/2 left-1/2 -translate-1/2" />
          )}
          onErr={({ e, selectors }) => {
            const el = e.currentTarget.closest(`.${selectors.wrap}`) as HTMLDivElement;
            if (el) el.style.background = 'transparent';
          }}
        />

        <div className="flex flex-col overflow-hidden">
          <h2
            className="text-base font-bold text-white hover:underline cursor-pointer truncate"
            title={song.title}
          >
            {song.title}
          </h2>

          <span
            className="font-medium text-xs text-[#adaaaa] hover:text-white hover:underline cursor-pointer truncate"
            title={song.artistName}
          >
            {song.artistName}
          </span>
        </div>
      </div>

      <button
        className="flex items-center gap-3 text-white w-fit h-fit transition-colors duration-200 cursor-pointer"
        onClick={toggleLikeTrack}
      >
        <HeartIcon className={isLiked ? 'fill-primary stroke-0' : ''} size={24} />
        <span className="font-semibold">Me gusta</span>
      </button>

      <button className="flex items-center gap-3 text-white w-fit h-fit transition-colors duration-200 cursor-pointer">
        <Share2Icon size={24} />
        <span className="font-semibold">Compartir</span>
      </button>

      <Link
        to={`${routes.tracks}/${song.id}`}
        onClick={onMinimize}
        className="flex items-center gap-3 text-white w-fit h-fit transition-colors duration-200 cursor-pointer"
      >
        <Music2Icon size={20} />
        <span className="font-semibold">Ver pista</span>
      </Link>

      <Link
        to={`${routes.artists}/${song.artistId}`}
        onClick={onMinimize}
        className="flex items-center gap-3 text-white w-fit h-fit transition-colors duration-200 cursor-pointer"
      >
        <UserIcon strokeWidth={2.5} size={20} />
        <span className="font-semibold">Ver artista</span>
      </Link>

      <button
        type="button"
        onClick={onClose}
        className="mx-auto mt-auto flex items-center gap-2 text-white w-fit h-fit transition-colors duration-200 cursor-pointer"
      >
        <span className="font-semibold">Cerrar</span>
      </button>
    </>
  )
}

export default MobilePlayerModal;