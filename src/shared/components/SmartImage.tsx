import { type ImgHTMLAttributes } from "react";
import { MusicIcon } from "lucide-react";
import { cn } from "../utils/tailwindCn";

const showIcon = (element: HTMLElement, selector: string) => {
  const ev = element;
  ev.style.display = 'none';
  const icon = ev.closest(selector)?.querySelector('.smart-icon');
  if (icon) icon.classList.remove('hidden', 'opacity-0');
}

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  url: string | null;
  wrapClassName?: string;
  iconClassName?: string;
  wrapStyles?: React.CSSProperties;
  icon?: React.ReactNode;
}

const SmartImage = (props: SmartImageProps) => {
  const {
    className, url, wrapClassName = '', iconClassName = '',
    wrapStyles = {}, crossOrigin = 'anonymous', icon, ...imgProps
  } = props;

  return (
    <div
      style={wrapStyles}
      className={`${cn("w-12 h-12 bg-[#262626] relative overflow-hidden hover:badge:bg-blue-500", wrapClassName)} img-wrap`}
    >
      {url && (
        <img
          className={cn("object-cover w-full h-full", className)}
          onError={(e) => showIcon(e.currentTarget, '.img-wrap')}
          src={url}
          crossOrigin={crossOrigin}
          {...imgProps}
        />
      )}

      {!icon ?
        <MusicIcon className={`${cn(`${!url ? '' : 'hidden opacity-0'} w-[50%] h-[50%] absolute top-1/2 left-1/2 -translate-1/2`, iconClassName)} smart-icon`} />
        :
        <div className={`${!url ? '' : 'hidden opacity-0'} w-full h-full absolute top-1/2 left-1/2 -translate-1/2 flex items-center justify-center smart-icon`}>
          {icon}
        </div>
      }
    </div>
  )
}

export default SmartImage;