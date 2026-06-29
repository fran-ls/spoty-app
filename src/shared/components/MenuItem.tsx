import { useEffect, useState } from "react";
import { CircleMinusIcon, EllipsisVerticalIcon, ListPlusIcon, Music2Icon, UploadIcon } from "lucide-react";
import type { Role } from "../../features/auth/auth.types";
import useAuth from "../../features/auth/hooks/useAuth";
import { cn } from "../utils/tailwindCn";

export type MenuItemAction = 'remove' | 'edit-track' | 'share' | 'close';

interface Item {
  label: string;
  action: MenuItemAction;
  icon: React.ReactElement;
}

interface MenuItemProps {
  items?: Item[];
  access?: Role[];
  open?: boolean;
  styles?: {
    btn?: string | React.CSSProperties;
    menu?: string | React.CSSProperties;
  };
  actions: (action: MenuItemAction) => void;
  onActive?: () => void;
}

const LiItem = ({ item }: { item: Omit<Item, 'action'> & { onAction: () => any } }) => {
  return (
    <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
      <button
        onClick={item.onAction}
        className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
        type="button"
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    </li>
  )
}

const MenuItem = (props: MenuItemProps) => {
  const { open = false, access = ['ADMIN'], items = [], styles, actions, onActive } = props;
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => { setIsActive(open) }, [open]);

  if (access && !access.includes(user?.role || 'USER')) {
    return null;
  }

  return (
    <>
      {isActive &&
        <div
          className="bg-black/50 z-100 fixed min-h-screen w-full left-0 top-0"
          onClick={() => setIsActive(false)}
        />
      }

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsActive(!isActive);
          onActive && onActive();
        }}
        style={styles?.btn && typeof styles?.btn !== 'string' ? styles?.btn : {}}
        className={cn(`p-1 text-[#adaaaa] cursor-pointer`, typeof styles?.btn === 'string' ? styles?.btn : '')}
        type="button"
      >
        <EllipsisVerticalIcon size={18} />
      </button >

      {isActive &&
        <div className="w-45 z-100 bg-[#282828] text-sm p-1 rounded absolute top-0 right-0">
          <ul className="text-[#adaaaa] flex flex-col items-center justify-between">
            {items.length ? items.map((it) => (
              <LiItem item={{
                label: it.label,
                icon: it.icon,
                onAction: () => {
                  actions(it.action);
                  setIsActive(false);
                }
              }} />
            )) : (
              <>
                <LiItem item={{
                  label: 'Quitar de la lista',
                  icon: <CircleMinusIcon className="w-5 h-5" />,
                  onAction: () => {
                    actions('remove');
                    setIsActive(false);
                  }
                }} />
                <LiItem item={{
                  label: 'Añadir a cola',
                  icon: <ListPlusIcon className="w-5 h-5" />,
                  onAction: () => {
                    setIsActive(false);
                  }
                }} />
                <LiItem item={{
                  label: 'Ver canción',
                  icon: <Music2Icon className="w-5 h-5" />,
                  onAction: () => {
                    actions('edit-track');
                    setIsActive(false);
                  }
                }} />
                <LiItem item={{
                  label: 'Compartir',
                  icon: <UploadIcon className="w-5 h-5" />,
                  onAction: () => {
                    actions('share');
                    setIsActive(false);
                  }
                }} />
              </>
            )}
          </ul>
        </div>
      }
    </>
  )
}

export default MenuItem;