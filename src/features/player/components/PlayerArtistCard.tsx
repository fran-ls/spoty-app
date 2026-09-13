import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, UserIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import usePlayer from "../hooks/usePlayer";
import artistService from "../../artist/services/artist.service";
import { routes } from "../../../shared/utils/routes";

const PlayerArtistCard = () => {
  const { currentSong } = usePlayer();

  const cover = artistService.artistImage(currentSong?.artist?.id!, currentSong?.artist?.image);

  useEffect(() => { }, [currentSong]);

  return (
    <div className="mb-4 mx-4 bg-[#1f1f1f] rounded-lg overflow-hidden">
      <SmartImage
        wrapClassName="w-full h-42.5"
        referrerPolicy="no-referrer"
        url={cover}
        icon={(
          <UserIcon className="w-1/4 h-1/4" />
        )}
      />

      <div className="p-4 flex items-center gap-1.5">
        <Link
          className="hover:underline block max-w-fit overflow-hidden"
          to={`${routes.artists}/${currentSong?.artistId || ''}`}
        >
          <h3
            className="text-white text-base truncate block google-sans-flex-font"
            style={{
              fontWeight: 600
            }}
            title={currentSong?.artist?.name}
          >
            {currentSong?.artist?.name}
          </h3>
        </Link>

        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-primary text-[#131313] cursor-pointer rounded-full p-0.5 transition-transform hover:scale-110 active:scale-95"
        >
          <CheckIcon fill="transparent" size={12} />
        </div>
      </div>
    </div>
  )
}

export default PlayerArtistCard;