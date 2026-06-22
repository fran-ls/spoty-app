import { type ImgHTMLAttributes } from "react";
import { MusicIcon } from "lucide-react";
import { showMusicIcon } from "../utils/showMusicIcon";
import { cn } from "../utils/tailwindCn";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  cover: string | null;
  wrapClassName?: string;
  iconClassName?: string;
  wrapStyles?: React.CSSProperties;
}

const SmartImage = (props: SmartImageProps) => {
  const {
    className, cover, wrapClassName = '', iconClassName = '',
    wrapStyles = {}, crossOrigin = 'anonymous', ...imgProps
  } = props;

  return (
    <div
      style={wrapStyles}
      className={`${cn("min-w-12 w-12 h-12 bg-[#262626] relative overflow-hidden hover:badge:bg-blue-500", wrapClassName)} img-wrap`}
    >
      {cover && (
        <img
          className={cn("object-cover w-full h-full", className)}
          onError={(e) => showMusicIcon(e.currentTarget, '.img-wrap')}
          src={cover}
          crossOrigin={crossOrigin}
          {...imgProps}
        />
      )}

      <MusicIcon className={`${cn(`${!cover ? '' : 'hidden opacity-0'} w-[50%] h-[50%] absolute top-1/2 left-1/2 -translate-1/2`, iconClassName)} music-icon`} />
    </div>
  )
}

export default SmartImage;