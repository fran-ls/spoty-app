import { CircleMinusIcon, ListPlusIcon, Music2Icon, UploadIcon } from "lucide-react";
import usePlayer from "../../player/hooks/usePlayer";

export type PlaylistMenuAction = 'remove' | 'add-to-queue' | 'view-track' | 'share' | 'close';

interface PlaylistMenuProps {
  actions: (action: PlaylistMenuAction) => void;
  onClose: () => void;
}

const PlaylistMenu = ({ actions, onClose }: PlaylistMenuProps) => {
  const { isPlayer } = usePlayer();

  return (
    <>
      <div
        className="bg-transparent z-100 fixed min-h-screen w-full left-0 top-0"
        onClick={onClose}
      />

      <div className={`${isPlayer ? 'md:right-76 right-2' : 'md:right-15 right-2'} w-45 z-100 bg-[#282828] text-sm p-1 rounded fixed bottom-22`}>
        <ul className="text-[#adaaaa] flex flex-col items-center justify-between">
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => actions('remove')}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <CircleMinusIcon className="w-5 h-5" />
              <span>Quitar de la lista</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => actions('add-to-queue')}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <ListPlusIcon className="w-5 h-5" />
              <span>Añadir a la cola</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => actions('view-track')}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <Music2Icon className="w-5 h-5" />
              <span>Ver pista</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => actions('share')}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <UploadIcon className="w-5 h-5" />
              <span>Compartir</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default PlaylistMenu;