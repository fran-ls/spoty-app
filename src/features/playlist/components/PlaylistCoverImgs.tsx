import { useState } from "react";
import type { PlaylistCover as Cover } from "../playlist.types";

const PlaylistCoverImgs = ({ images }: { images: Cover[] }) => {
  const [isError, setIsError] = useState(false);

  if (isError) return null

  return images.map((img, i) => {
    const className = i === 0
      ? 'top-0 left-0' : i === 1
        ? 'top-0 right-0' : i === 3
          ? 'bottom-0 right-0' : 'bottom-0 left-0';

    return (
      <img
        className={`${className} absolute w-1/2 h-1/2 object-cover`}
        onError={() => setIsError(true)}
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