import { CircleMinusIcon, ListPlusIcon, Music2Icon, UploadIcon } from "lucide-react";
import { usePlayer } from "../../../shared/context/PlayerContext";

interface PlaylistMenuProps {
  onOpen: (action: "remove" | "add-to-queue" | "edit-track" | "share") => void;
  onClose: () => void;
}

const PlaylistMenu = ({ onOpen, onClose }: PlaylistMenuProps) => {
  const { isQueue } = usePlayer();

  return (
    <>
      <div
        className="bg-transparent z-100 fixed min-h-screen w-full left-0 top-0"
        onClick={onClose}
      />

      <div className={`${!isQueue ? 'md:right-76 right-2' : 'md:right-22 right-2'} w-45 z-100 bg-[#282828] text-sm p-1 rounded fixed bottom-22`}>
        <ul className="text-[#adaaaa] flex flex-col items-center justify-between">
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => onOpen('remove')}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <CircleMinusIcon className="w-5 h-5" />
              <span>Quitar de la lista</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => onOpen('add-to-queue')}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <ListPlusIcon className="w-5 h-5" />
              <span>Añadir a cola</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => onOpen('edit-track')}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <Music2Icon className="w-5 h-5" />
              <span>Ver canción</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => onOpen('share')}
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