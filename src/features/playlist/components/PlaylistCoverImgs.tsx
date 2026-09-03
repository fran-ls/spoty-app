import { useState } from "react";
import type { PlaylistCover as Cover } from "../playlist.types";

interface PlaylistCoverImgsProps {
  images: Cover[];
  onError?: (error: boolean) => void;
}

const PlaylistCoverImgs = ({ images, onError }: PlaylistCoverImgsProps) => {
  const [isError, setIsError] = useState(false);

  if (isError) return null;

  return images.map((img, i) => {
    const className = i === 0
      ? 'top-0 left-0' : i === 1
        ? 'top-0 right-0' : i === 3
          ? 'bottom-0 right-0' : 'bottom-0 left-0';

    return (
      <img
        className={`${className} absolute w-1/2 h-1/2 object-cover`}
        onError={(e) => {
          setIsError(true);
          onError?.(e.isTrusted);
        }}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        src={img.url}
        alt="cover"
        key={img.id}
      />
    )
  })
}

export default PlaylistCoverImgs;