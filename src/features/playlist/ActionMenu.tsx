import { CircleMinusIcon, GlobeIcon, LockIcon, PenIcon } from "lucide-react";

interface CustomMenuProps {
  isPrivate: boolean;
  onChangeVisibility: () => void;
  onIsEdit: () => void;
  onClose: () => void;
}

const ActionMenu = ({ isPrivate, onIsEdit, onChangeVisibility, onClose }: CustomMenuProps) => {

  return (
    <>
      <div
        className="bg-transparent z-15 fixed min-h-screen w-full left-0 top-0"
        onClick={onClose}
      />

      <div className="w-42 z-15 bg-[#282828] text-sm p-1 rounded absolute top-0 left-0">
        <ul className="text-[#adaaaa] flex flex-col items-center justify-between">
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={onIsEdit}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <PenIcon className="w-4 h-4" />
              <span>Editar datos</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              <CircleMinusIcon className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </li>
          <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              onClick={onChangeVisibility}
              className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
              type="button"
            >
              {
                isPrivate
                  ? <GlobeIcon className="w-4 h-4" />
                  : <LockIcon className="w-4 h-4" />
              }
              <span>
                {isPrivate ? 'Hacer pública' : 'Hacer privada'}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ActionMenu;