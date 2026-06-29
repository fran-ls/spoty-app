import { useEffect, useState } from "react";
import { CircleMinusIcon, EllipsisVerticalIcon, ListPlusIcon, Music2Icon, UploadIcon } from "lucide-react";
import type { Role } from "../../features/auth/auth.types";
import useAuth from "../../features/auth/hooks/useAuth";
import { cn } from "../utils/tailwindCn";

export type MenuItemAction = 'remove' | 'edit-track' | 'share' | 'close' | 'toggle';

interface Item {
  label: string;
  action: MenuItemAction;
  subtext?: string;
  icon?: React.ReactElement;
  type?: 'toggle' | 'btn';
  isActive?: boolean;
  onAction?: (isActive?: boolean) => any;
}

type ILiItem = Omit<Item, 'action'>;

const LiItem = ({ item }: { item: ILiItem }) => {
  const [isActive, setIsActive] = useState(item.isActive ?? false);
  const type = item.type || 'btn';

  useEffect(() => { setIsActive(item.isActive ?? false) }, [item.isActive]);

  return (
    <li className="w-full font-medium hover:text-white hover:bg-white/10 rounded-xs">
      <button
        onClick={() => type === 'btn' && item.onAction?.()}
        className="w-full flex items-center gap-2 cursor-pointer px-3 py-2"
        type="button"
      >
        {type === 'btn' && (
          <>
            {item.icon}
            <span>{item.label}</span>
          </>
        )}

        {item.type === 'toggle' && (
          <div className="w-full">
            <div className="w-full flex items-center justify-between gap-2">
              <span>{item.label}</span>

              <label
                className="switch"
                title={`${!isActive ? 'Activar' : 'Desactivar'} Borrar archivos`}
              >
                <input
                  onChange={() => {
                    const active = !isActive;
                    setIsActive(active);
                    type === "toggle" && item.onAction?.(active);
                  }}
                  checked={isActive}
                  type="checkbox"
                  id="toggleSwitch"
                />
                <span className="slider bg-primary" />
              </label>
            </div>

            {item.subtext &&
              <span className="text-xs w-full text-left font-light block mt-1">
                {item.subtext}
              </span>
            }
          </div>
        )}
      </button>
    </li>
  )
}

interface MenuItemProps {
  sections?: {
    label: string;
    items: Item[];
  }[];
  items?: Item[];
  access?: Role[];
  open?: boolean;
  styles?: {
    btn?: string | React.CSSProperties;
    menu?: string | React.CSSProperties;
  };
  actions?: (action: MenuItemAction) => void;
  onActive?: () => void;
}

const MenuItem = (props: MenuItemProps) => {
  const { open = false, access = ['ADMIN'], items = [], styles, sections, actions, onActive } = props;
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
      </button>

      {isActive &&
        <div
          style={styles?.menu && typeof styles?.menu !== 'string' ? styles?.menu : {}}
          className={cn("w-45 z-100 bg-[#282828] text-sm p-1 rounded absolute top-0 right-0", typeof styles?.menu === 'string' ? styles?.menu : '')}
        >
          <ul className="text-[#adaaaa] flex flex-col items-center justify-between">
            {!sections?.length && (
              items.length ? items.map((it) => (
                <LiItem
                  item={{
                    label: it.label,
                    icon: it.icon,
                    isActive: it.isActive,
                    onAction: (isActive) => {
                      it.onAction ? it.onAction(isActive) : actions?.(it.action);
                      setIsActive(false);
                    }
                  }}
                  key={it.label}
                />
              )) : (
                <>
                  <LiItem item={{
                    label: 'Quitar de la lista',
                    icon: <CircleMinusIcon className="w-5 h-5" />,
                    onAction: () => {
                      actions?.('remove');
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
                      actions?.('edit-track');
                      setIsActive(false);
                    }
                  }} />
                  <LiItem item={{
                    label: 'Compartir',
                    icon: <UploadIcon className="w-5 h-5" />,
                    onAction: () => {
                      actions?.('share');
                      setIsActive(false);
                    }
                  }} />
                </>
              )
            )}

            {sections?.map((sec, i) => (
              <>
                {sec.items.map((it) => {
                  const type = it.type ? it.type : it.action === 'toggle' ? it.action : 'btn';

                  return (
                    <LiItem
                      item={{
                        label: it.label,
                        icon: it.icon,
                        isActive: it.isActive,
                        type,
                        onAction: (isActive) => {
                          it.onAction ? it.onAction(isActive) : actions?.(it.action);
                          if (type !== 'toggle') setIsActive(false);
                        }
                      }}
                      key={it.label}
                    />
                  )
                })}

                {(sections.length - 1 !== i) &&
                  <li
                    className="border-b border-[#646464] w-full my-1"
                    key={`divider-${i + 1}`}
                  />
                }
              </>
            ))}
          </ul>
        </div>
      }
    </>
  )
}

export default MenuItem;