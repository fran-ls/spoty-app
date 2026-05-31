import { CheckIcon, LayoutGridIcon, ListIcon, TextAlignJustify } from "lucide-react";

interface CustomMenuProps {
  onClose: () => void;
}

const CustomMenu = ({ onClose }: CustomMenuProps) => {
  return (
    <>
      <div
        className="bg-transparent z-15 fixed min-h-screen w-full left-0 top-0"
        onClick={onClose}
      />

      <div className="w-46 z-15 bg-[#262626] text-sm p-1 rounded absolute top-[calc(100%+8px)] right-0">
        <h3 className="px-4 pt-3 pb-4 font-medium">Ordenar por</h3>
        <ul className="text-white">
          <li className="text-primary font-medium hover:bg-white/10 px-4 py-2 rounded-xs flex items-center gap-8">
            <span>Recientes</span>
            <CheckIcon className="w-5 h-5 ml-auto" />
          </li>
          <li className="font-medium hover:bg-white/10 px-4 py-2 rounded-xs flex items-center gap-3">
            <span>Orden alfabético</span>
          </li>
        </ul>
        <div className="my-1 line-through h-px bg-white/10" />
        <h3 className="px-4 py-2 font-medium">Ver como</h3>
        <ul className="text-[#adaaaa] flex items-center justify-between">
          <li className="font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              className="cursor-pointer px-3 py-2"
              title="Lista compacta"
              type="button"
            >
              <TextAlignJustify className="w-5 h-5" />
            </button>
          </li>
          <li className="font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              className="text-primary cursor-pointer px-3 py-2"
              title="Lista predeterminada"
              type="button"
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </li>
          <li className="font-medium hover:text-white hover:bg-white/10 rounded-xs">
            <button
              className="cursor-pointer px-3 py-2"
              title="Cuadrícula"
              type="button"
            >
              <LayoutGridIcon className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default CustomMenu;