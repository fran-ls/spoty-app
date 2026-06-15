import { CircleMinusIcon, ListPlusIcon, UploadIcon } from "lucide-react";

interface PlaylistMenuProps {
  onRemove: () => void;
  onClose: () => void;
}

const PlaylistMenu = ({ onRemove, onClose }: PlaylistMenuProps) => {
  return (
    <>
      <div
        className="bg-transparent z-15 fixed min-h-screen w-full left-0 top-0"
        onClick={onClose}
      />

      <div className="w-42 z-15 bg-[#282828] text-sm p-1 rounded absolute bottom-5 right-0">
        <ul className="text-[#adaaaa] flex flex-col items-center justify-between">
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={onRemove}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <CircleMinusIcon className="w-5 h-5" />
              <span>Quitar de la lista</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <ListPlusIcon className="w-5 h-5" />
              <span>Añadir a cola</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
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