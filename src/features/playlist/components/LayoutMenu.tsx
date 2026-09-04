import { CheckIcon, ListIcon, TextAlignJustify } from "lucide-react";
import { PlaylistLayout } from "../../library/library.types";

interface CustomMenuProps {
  layout: PlaylistLayout;
  backdrop?: boolean;
  onClose: () => void;
  setLayout: React.Dispatch<React.SetStateAction<PlaylistLayout>>;
}

const LayoutMenu = ({ layout, backdrop = true, onClose, setLayout }: CustomMenuProps) => {
  return (
    <>
      {backdrop && (
        <div
          className="bg-transparent z-15 fixed min-h-screen w-full left-0 top-0"
          onClick={onClose}
        />
      )}

      <div className="w-42 z-15 bg-[#282828] text-sm p-1 rounded absolute top-[calc(100%+10px)] right-0">
        <h3 className="px-4 py-2 font-medium">Ver como</h3>
        <ul className="text-[#adaaaa] flex flex-col items-center justify-between">
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => setLayout(PlaylistLayout.COMPACT_LIST)}
              className={`${layout === PlaylistLayout.COMPACT_LIST ? 'text-primary' : ''} w-full flex items-center gap-2 cursor-pointer px-3 py-2`}
              type="button"
            >
              <TextAlignJustify className="w-5 h-5" />
              <span>Compacto</span>

              {layout === PlaylistLayout.COMPACT_LIST && (
                <CheckIcon className="w-5 h-5 ml-auto" />
              )}
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={() => setLayout(PlaylistLayout.LIST)}
              className={`${layout === PlaylistLayout.LIST ? 'text-primary' : ''} w-full flex items-center gap-2  cursor-pointer px-3 py-2`}
              type="button"
            >
              <ListIcon className="w-5 h-5" />
              <span>Lista</span>

              {layout === PlaylistLayout.LIST && (
                <CheckIcon className="w-5 h-5 ml-auto" />
              )}
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default LayoutMenu;