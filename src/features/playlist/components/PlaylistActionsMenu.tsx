import { useState } from "react";
import { CircleMinusIcon, EllipsisIcon, GlobeIcon, LockIcon, PaletteIcon, PenIcon } from "lucide-react";
import type { PlaylistDTO } from "../playlist.types";
import ActionMenu from "../../../shared/components/ActionMenu";

interface PlaylistActionsMenuProps {
  form: PlaylistDTO;
  isPlaylistOwner: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemove: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenBgEditor: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeVisibility: () => void;
}

const PlaylistActionsMenu = (props: PlaylistActionsMenuProps) => {
  const { isPlaylistOwner, form, setIsEdit, setIsRemove, setOpenBgEditor, onChangeVisibility } = props;
  const [isPlaylistMenu, setIsPlaylistMenu] = useState(false);

  return (
    <div className="max-[500px]:order-3 relative">
      <button
        onClick={() => setIsPlaylistMenu(true)}
        className="flex items-center justify-center h-8 cursor-pointer"
        type="button"
      >
        <EllipsisIcon className="min-[500px]:w-8 min-[500px]:h-8 min-[500px]:rotate-0 w-6 h-6 rotate-90" />
      </button>

      {(isPlaylistMenu && isPlaylistOwner) &&
        <div
          onMouseLeave={() => setIsPlaylistMenu(false)}
          className="z-10 absolute top-0 left-0"
        >
          <ActionMenu
            onClose={() => setIsPlaylistMenu(false)}
            styles={{
              wrap: "min-w-[160px]"
            }}
            items={[{
              label: 'Fondo',
              icon: (
                <PaletteIcon size={18} />
              ),
              onAction: () => setOpenBgEditor(true)
            }, {
              label: 'Editar datos',
              icon: (
                <PenIcon size={18} />
              ),
              onAction: () => {
                setIsEdit(true);
                setIsPlaylistMenu(false);
                setOpenBgEditor(false);
                setIsRemove(false);
              }
            }, {
              label: 'Eliminar',
              icon: (
                <CircleMinusIcon size={18} />
              ),
              onAction: () => {
                setIsEdit(false);
                setIsPlaylistMenu(false);
                setOpenBgEditor(false);
                setIsRemove(true);
              }
            }, {
              label: `Hacer ${form.isPublic ? 'privada' : 'pública'}`,
              icon: (
                !form.isPublic
                  ? <GlobeIcon size={18} />
                  : <LockIcon size={18} />
              ),
              onAction: () => onChangeVisibility()
            }]}
          />
        </div>
      }
    </div>
  )
}

export default PlaylistActionsMenu;