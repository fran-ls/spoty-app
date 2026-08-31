import { type ImgHTMLAttributes } from "react";
import { MusicIcon } from "lucide-react";
import { getStyles, type ItemStyle, type Style } from "../utils/getStyles";
import { cn } from "../utils/tailwindCn";

const showIcon = (element: HTMLElement, selector: string) => {
  const ev = element;
  ev.style.display = 'none';
  const icon = ev.closest(selector)?.querySelector('.smart-icon');
  if (icon) icon.classList.remove('hidden', 'opacity-0');
}

const styleKeys: StyleK[] = ['imgWrap', 'img', 'iconWrap', 'icon'];

interface Styles {
  imgWrap?: Style;
  img?: Style;
  iconWrap?: Style;
  icon?: Style;
}

type StyleK = keyof Styles;

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  url: string | null;
  wrapClassName?: string;
  iconClassName?: string;
  wrapStyles?: React.CSSProperties;
  icon?: React.ReactNode;
  styles?: Styles;
}

const SmartImage = (props: SmartImageProps) => {
  const {
    className, url, wrapClassName = '', iconClassName = '', styles,
    wrapStyles = {}, crossOrigin = 'anonymous', icon, ...imgProps
  } = props;

  const fmtStyles: Partial<Record<StyleK, ItemStyle>> = {};
  styleKeys.forEach((k) => {
    const style = styles?.[k];
    fmtStyles[k] = getStyles(style);
  });
  const values = fmtStyles as Record<StyleK, ItemStyle>;

  return (
    <div
      style={{
        ...wrapStyles,
        ...values.imgWrap.style
      }}
      className={`${cn("w-12 h-12 bg-[#262626] text-[#adaaaa] relative overflow-hidden", wrapClassName, values.imgWrap.className)} img-wrap`}
    >
      {url && (
        <img
          style={values.img.style}
          className={cn("object-cover w-full h-full", className, values.img.className)}
          onError={(e) => showIcon(e.currentTarget, '.img-wrap')}
          src={url}
          crossOrigin={crossOrigin}
          {...imgProps}
        />
      )}

      {!icon ?
        <MusicIcon
          style={values.icon.style}
          className={`${cn(`${!url ? '' : 'hidden opacity-0'} w-[50%] h-[50%] absolute top-1/2 left-1/2 -translate-1/2`, iconClassName, values.icon.className)} smart-icon`}
        />
        :
        <div
          style={values.iconWrap.style}
          className={cn(`${!url ? '' : 'hidden opacity-0'} w-full h-full absolute top-1/2 left-1/2 -translate-1/2 flex items-center justify-center smart-icon`, values.iconWrap.className)}
        >
          {icon}
        </div>
      }
    </div>
  )
}

export default SmartImage;