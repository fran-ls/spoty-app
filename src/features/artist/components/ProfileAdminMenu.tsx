import { useState } from "react";
import { CircleMinus, EllipsisVerticalIcon, SquarePenIcon } from "lucide-react";

interface ProfileAdminMenuProps {
  onRemoveArtist: () => Promise<boolean>;
}

const ProfileAdminMenu = ({ onRemoveArtist }: ProfileAdminMenuProps) => {
  const [isActive, setIsActive] = useState(false);

  const onRemove = async () => {
    const ok = await onRemoveArtist();
    if (ok) setIsActive(false);
  }

  return (
    <div className="absolute top-0 right-0">
      <button
        onClick={() => setIsActive(!isActive)}
        className="p-1 text-white cursor-pointer"
        type="button"
      >
        <EllipsisVerticalIcon size={18} />
      </button>

      {isActive &&
        <ul className="w-30 overflow-hidden rounded border border-white/20 bg-[#202020] p-1 absolute right-0">
          <li>
            <button
              className="hover:bg-[#424242a0] w-full text-white flex items-center gap-2 p-1.5 px-2.5 text-sm cursor-pointer"
              type="button"
            >
              <SquarePenIcon size={16} />
              <span>Editar</span>
            </button>
          </li>
          <li>
            <button
              className="hover:bg-[#424242a0] w-full text-white flex items-center gap-2 p-1.5 px-2.5 text-sm cursor-pointer"
              onClick={onRemove}
              type="button"
            >
              <CircleMinus size={16} />
              <span>Eliminar</span>
            </button>
          </li>
        </ul>
      }
    </div>
  )
}

export default ProfileAdminMenu;