import { useState } from "react";
import { CircleMinusIcon, EllipsisIcon, PaletteIcon, PenIcon } from "lucide-react";
import ActionMenu from "../../../shared/components/ActionMenu";

interface SongActionBarMenuProps {
  isOwner: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemove: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenBgEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongActionBarMenu = (props: SongActionBarMenuProps) => {
  const { isOwner, setIsEdit, setIsRemove, setOpenBgEditor } = props;
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <div className="max-[500px]:order-3 relative">
      <button
        onClick={() => isOwner && setIsOpenMenu(true)}
        className="flex items-center justify-center h-8 cursor-pointer"
        type="button"
      >
        <EllipsisIcon className="min-[500px]:w-8 min-[500px]:h-8 min-[500px]:rotate-0 w-6 h-6 rotate-90" />
      </button>

      {(isOpenMenu && isOwner) &&
        <div
          onMouseLeave={() => setIsOpenMenu(false)}
          className="z-10 absolute top-0 left-0"
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
            }, {
              label: 'Editar datos',
              icon: (
                <PenIcon size={18} />
              ),
              onAction: () => {
                setIsEdit(true);
                setIsOpenMenu(false);
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
                setIsOpenMenu(false);
                setOpenBgEditor(false);
                setIsRemove(true);
              }
            }]}
          />
        </div>
      }
    </div>
  )
}

export default SongActionBarMenu;