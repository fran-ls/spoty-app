import { CheckIcon, LayoutGridIcon, ListIcon, TextAlignJustify } from "lucide-react";
import { PlaylistLayout, PlaylistOrderBy, PlaylistOrderK } from "../library.types";
import { PLAYLIST_LAYOUT_LABEL, PLAYLIST_SORT_LABEL } from "../data/library.data";

export type CustomMenuOrderItem = {
  label: string;
  value: PlaylistOrderBy;
  k: PlaylistOrderK;
}

type CustomMenuLayoutItem = {
  label: string;
  value: PlaylistLayout;
  icon: React.ReactElement;
}

interface CustomMenuProps {
  order: CustomMenuOrderItem;
  layout: PlaylistLayout;
  onSort: (value: CustomMenuOrderItem) => void;
  onLayout: (value: PlaylistLayout) => void;
  onClose: () => void;
}

const CustomMenu = (props: CustomMenuProps) => {
  const { order, layout, onSort, onLayout, onClose } = props;

  const sortItems: CustomMenuOrderItem[] = [
    {
      label: PLAYLIST_SORT_LABEL.RECENT,
      value: PlaylistOrderBy.RECENT,
      k: PlaylistOrderK.RECENT
    },
    {
      label: PLAYLIST_SORT_LABEL.NAME,
      value: PlaylistOrderBy.NAME,
      k: PlaylistOrderK.NAME
    }
  ];

  const layoutItems: CustomMenuLayoutItem[] = [
    {
      label: PLAYLIST_LAYOUT_LABEL.COMPACT_LIST,
      value: PlaylistLayout.COMPACT_LIST,
      icon: (
        <TextAlignJustify className="w-5 h-5" />
      )
    },
    {
      label: PLAYLIST_LAYOUT_LABEL.LIST,
      value: PlaylistLayout.LIST,
      icon: (
        <ListIcon className="w-5 h-5" />
      )
    },
    {
      label: PLAYLIST_LAYOUT_LABEL.GRID,
      value: PlaylistLayout.GRID,
      icon: (
        <LayoutGridIcon className="w-5 h-5" />
      )
    }
  ];

  return (
    <>
      <div
        className="bg-transparent z-15 fixed min-h-screen w-full left-0 top-0"
        onClick={onClose}
      />

      <div className="w-46 z-15 bg-[#262626] text-sm p-1 rounded absolute top-[calc(100%+8px)] right-0">
        <h3 className="px-4 pt-3 pb-4 font-medium">Ordenar por</h3>
        <ul className="text-white">
          {sortItems.map((it) => (
            <li
              onClick={() => onSort(it)}
              className={`${order.value === it.value ? 'text-primary' : ''} font-medium hover:bg-white/10 px-4 py-2 rounded-xs flex items-center gap-2`}
              key={it.value}
            >
              <span>{it.label}</span>
              {order.value === it.value && (
                <CheckIcon className="w-5 h-5 ml-auto" />
              )}
            </li>
          ))}
        </ul>

        <div className="my-1 line-through h-px bg-white/10" />

        <h3 className="px-4 py-2 font-medium">Ver como</h3>
        <ul className="text-[#adaaaa] flex items-center justify-between">
          {layoutItems.map((it) => (
            <li
              onClick={() => onLayout(it.value)}
              className="font-medium hover:text-white hover:bg-white/10 rounded-xs"
              key={it.value}
            >
              <button
                className={`${it.value === layout ? 'text-primary' : ''} cursor-pointer px-3 py-2`}
                title={it.label}
                type="button"
              >
                {it.icon}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default CustomMenu;