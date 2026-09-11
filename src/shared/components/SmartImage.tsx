import { useState, type ImgHTMLAttributes } from "react";
import { MusicIcon } from "lucide-react";
import { getStyles, type ItemStyle, type Style } from "../utils/getStyles";
import { cn } from "../utils/tailwindCn";

const selectors = {
  wrap: 'img-wrap',
  icon: 'smart-icon',
  img: 'smart-img'
}

const showIcon = (element: HTMLElement, selector: string) => {
  const ev = element;
  ev.style.display = 'none';
  const icon = ev.closest(selector)?.querySelector(`.${selectors.icon}`);
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

type DOMSelectors = typeof selectors;

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  url: string | null;
  wrapClassName?: string;
  iconClassName?: string;
  wrapStyles?: React.CSSProperties;
  icon?: React.ReactNode;
  styles?: Styles;
  onErr?: (e: React.SyntheticEvent<HTMLImageElement, Event>, selectors: DOMSelectors) => void | undefined;
}

const SmartImage = (props: SmartImageProps) => {
  const { url, wrapClassName = '', iconClassName = '', styles, onErr, ...imgProps } = props;

  const [isError, setIsError] = useState(false);

  const fmtStyles: Partial<Record<StyleK, ItemStyle>> = {};
  styleKeys.forEach((k) => {
    const style = styles?.[k];
    fmtStyles[k] = getStyles(style);
  });
  const values = fmtStyles as Record<StyleK, ItemStyle>;

  return (
    <div
      style={{
        ...props.wrapStyles,
        ...values.imgWrap.style,
        ...(isError && {
          background: 'transparent'
        })
      }}
      className={`${cn("w-12 h-12 bg-[#262626] text-[#adaaaa] relative overflow-hidden", wrapClassName, values.imgWrap.className)} ${selectors.wrap}`}
    >
      {url && (
        <img
          src={url}
          style={values.img.style}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          {...imgProps}
          className={props.className ? `${props.className} ${selectors.img}` : cn(`object-cover w-full h-full ${selectors.img}`, props.className, values.img.className)}
          onError={(e) => {
            setIsError(true);
            props.onError?.(e);
            onErr?.(e, selectors);
            showIcon(e.currentTarget, `.${selectors.wrap}`);
          }}
        />
      )}

      {!props.icon ? (
        <MusicIcon
          style={values.icon.style}
          className={`${cn(`w-[50%] h-[50%] absolute top-1/2 left-1/2 -translate-1/2 ${url ? 'hidden opacity-0' : ''}`, iconClassName, values.icon.className)} ${selectors.icon}`}
        />
      ) : (
        <div
          style={values.iconWrap.style}
          className={cn(`w-full h-full absolute top-1/2 left-1/2 -translate-1/2 flex items-center justify-center ${url ? 'hidden opacity-0' : ''} ${selectors.icon}`, values.iconWrap.className)}
        >
          {props.icon}
        </div>
      )}
    </div>
  )
}

export default SmartImage;