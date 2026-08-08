import { useEffect, useState } from "react";
import { MusicIcon } from "lucide-react";
import type { PlaylistCover as Cover } from "../playlist.types";
import type { Song } from "../../song/song.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getCoverImages } from "../utils/getCoverImages";

interface PlaylistCoverProps {
  cover: string;
  songs: Song[];
  images?: Cover[];
  setImages?: React.Dispatch<React.SetStateAction<Cover[]>>;
}

const PlaylistCover = ({ cover, songs, images, setImages }: PlaylistCoverProps) => {
  const [imgs, setImgs] = useState<Cover[]>([]);
  const coverImgs = images || imgs;

  useEffect(() => {
    if (!cover) {
      const urls = getCoverImages(songs);
      setImages ? setImages(urls) : setImgs(urls);
    }
  }, [songs]);

  return (
    <>
      <SmartImage
        wrapClassName="w-full h-full"
        icon={<MusicIcon className="w-1/4 h-1/4" />}
        url={cover}
      />

      {!cover && coverImgs.length > 3 && (
        coverImgs.map((img, i) => {
          const className = i === 0
            ? 'top-0 left-0' : i === 1
              ? 'top-0 right-0' : i === 3
                ? 'bottom-0 right-0' : 'bottom-0 left-0';

          return (
            <img
              className={`${className} absolute w-1/2 h-1/2 object-cover`}
              crossOrigin="anonymous"
              src={img.url}
              alt="cover"
              key={img.id}
            />
          )
        })
      )}
    </>
  )
}

export default PlaylistCover;