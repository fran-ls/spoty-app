import { useEffect, useState } from "react";
import { CircleMinusIcon, EllipsisVerticalIcon, ListPlusIcon, Music2Icon, UploadIcon } from "lucide-react";
import type { Role } from "../../features/auth/auth.types";
import useAuth from "../../features/auth/hooks/useAuth";
import { cn } from "../utils/tailwindCn";

const menuStyleKeys: MenuStyleK[] = ['wrap', 'backdrop', 'btn', 'menu', 'option', 'subtext', 'toggle'];

export type MenuItemAction = 'remove' | 'add-to-queue' | 'view-track' | 'share' | 'close' | 'toggle';

type FmtStyles = Partial<Record<MenuStyleK, ItemStyle>>;

type Style = string | React.CSSProperties;

interface ItemStyle {
  style: React.CSSProperties | undefined;
  className: string;
}

interface MenuStyles extends LiItemStyles {
  btn?: Style;
  menu?: Style;
  backdrop?: Style;
  wrap?: Style;
  option?: Style;
  subtext?: Style;
}

interface LiItemStyles {
  option?: Style;
  subtext?: Style;
  toggle?: {
    slider?: Style;
    switch?: Style;
  }
}

type MenuStyleK = keyof MenuStyles;

interface Item {
  label: string;
  action: MenuItemAction;
  subtext?: string;
  icon?: React.ReactElement;
  type?: 'toggle' | 'btn';
  isActive?: boolean;
  styles?: LiItemStyles;
  onAction?: (isActive?: boolean) => any;
}

type ILiItem = Omit<Item, 'action'>;

interface Section {
  label: string;
  items: Item[];
}

function getStyles(style: Style | undefined): ItemStyle {
  if (!style) return {
    style: undefined,
    className: ''
  }

  const isString = typeof style === 'string';

  return {
    style: !isString ? style : undefined,
    className: isString ? style : ''
  }
}

interface LiItemProps {
  item: ILiItem;
  styles?: LiItemStyles;
}

const LiItem = ({ item, styles }: LiItemProps) => {
  const [isActive, setIsActive] = useState(item.isActive ?? false);
  const type = item.type || 'btn';

  const li = getStyles(styles?.option);
  const slider = getStyles(styles?.toggle?.slider);
  const subtext = getStyles(styles?.subtext);

  useEffect(() => { setIsActive(item.isActive ?? false) }, [item.isActive]);

  return (
    <li
      style={{
        ...li.style,
        padding: 0,
        margin: 0
      }}
      className={cn("w-full font-medium hover:text-white hover:bg-white/10 rounded-xs", li.className)}
    >
      <button
        onClick={() => type === 'btn' && item.onAction?.()}
        style={li.style}
        className={cn("w-full flex items-center gap-2 cursor-pointer px-3 py-2", li.className)}
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
                <span
                  style={slider.style}
                  className={cn("slider bg-primary", slider.className)}
                />
              </label>
            </div>

            {item.subtext &&
              <span
                style={subtext.style}
                className={cn("text-xs w-full text-left font-light block mt-1", subtext.className)}
              >
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
  isBackdrop?: boolean;
  isBtn?: boolean;
  sections?: Section[];
  items?: Item[];
  access?: Role[];
  open?: boolean;
  styles?: MenuStyles;
  actions?: (action: MenuItemAction) => void;
  onActive?: () => void;
  onClose?: () => void;
}

const MenuItem = (props: MenuItemProps) => {
  const {
    open = false, access = [], items = [], styles, sections,
    isBtn = true, isBackdrop = true, actions, onActive, onClose
  } = props;
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => { setIsActive(open) }, [open]);

  if (access.length && !access.includes(user?.role || 'USER')) {
    return null;
  }

  const defaults: Section[] = [{
    label: '',
    items: [{
      action: 'remove',
      label: 'Quitar de la lista',
      icon: <CircleMinusIcon className="w-5 h-5" />,
      onAction: () => {
        actions?.('remove');
        setIsActive(false);
      }
    }, {
      action: 'add-to-queue',
      label: 'Añadir a cola',
      icon: <ListPlusIcon className="w-5 h-5" />,
      onAction: () => {
        actions?.('add-to-queue');
        setIsActive(false);
      }
    }, {
      action: 'view-track',
      label: 'Ver canción',
      icon: <Music2Icon className="w-5 h-5" />,
      onAction: () => {
        actions?.('view-track');
        setIsActive(false);
      }
    }, {
      action: 'share',
      label: 'Compartir',
      icon: <UploadIcon className="w-5 h-5" />,
      onAction: () => {
        actions?.('share');
        setIsActive(false);
      }
    }]
  }, {
    label: 'files',
    items: [{
      action: 'toggle',
      label: 'Incluir archivos',
      isActive: true,
      onAction: () => actions?.('toggle')
    }]
  }];

  const secs = sections || defaults || [];

  const fmtStyles: FmtStyles = {};
  const exclude: MenuStyleK[] = ['toggle']

  menuStyleKeys.forEach((k) => {
    const style = (styles as any)?.[k];

    if (!exclude.includes(k)) {
      fmtStyles[k] = getStyles(style)
    }
    else {
      fmtStyles['toggle'] = style;
    }
  });

  const values = fmtStyles as Record<MenuStyleK, ItemStyle>;
  const ulClassName = cn("text-[#adaaaa] flex flex-col items-center justify-between", values.menu.className);
  const show = (isBtn || !open) ? isActive : open;

  return (
    <>
      {(show && isBackdrop) && (
        <div
          style={values.backdrop.style}
          className={cn("bg-black/50 z-100 fixed min-h-screen w-full left-0 top-0", values.backdrop.className)}
          onClick={() => {
            setIsActive(false);
            onClose?.();
          }}
        />
      )}

      {isBtn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsActive(!isActive);
            onActive?.();
          }}
          style={values.btn.style}
          className={cn(`p-1 text-[#adaaaa] cursor-pointer`, values.btn.className)}
          type="button"
        >
          <EllipsisVerticalIcon size={18} />
        </button>
      )}

      {show && (
        <div
          style={values.wrap.style}
          className={cn("min-w-45 z-100 bg-[#282828] text-sm p-1 rounded absolute top-0 right-0", values.wrap.className)}
        >
          {items?.length ? (
            <ul className={ulClassName} style={values.menu.style}>
              {items.map((it) => (
                <LiItem
                  key={it.label}
                  styles={it.styles || styles}
                  item={{
                    label: it.label,
                    subtext: it.subtext,
                    isActive: it.isActive,
                    icon: it.icon,
                    onAction: (isActive) => {
                      it.onAction ? it.onAction(isActive) : actions?.(it.action);
                      setIsActive(false);
                      onClose?.();
                    }
                  }}
                />
              ))}
            </ul>
          ) : (
            secs.map((sec, i) => (
              <ul className={ulClassName} style={values.menu.style} key={sec.label}>
                {sec.items.map((it) => {
                  const type = it.type ? it.type : it.action === 'toggle' ? it.action : 'btn';

                  return (
                    <LiItem
                      key={it.label}
                      styles={it.styles || styles}
                      item={{
                        label: it.label,
                        subtext: it.subtext,
                        isActive: it.isActive,
                        icon: it.icon,
                        type,
                        onAction: (isActive) => {
                          it.onAction ? it.onAction(isActive) : actions?.(it.action);
                          if (type !== 'toggle') {
                            setIsActive(false);
                            onClose?.();
                          }
                        }
                      }}
                    />
                  )
                })}

                {(secs.length - 1 !== i) && (
                  <li
                    className="border-b border-[#646464] w-full my-1"
                    key={`divider-${i + 1}`}
                  />
                )}
              </ul>
            ))
          )}
        </div>
      )}
    </>
  )
}

export default MenuItem;