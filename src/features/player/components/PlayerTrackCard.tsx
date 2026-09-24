import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MusicIcon } from "lucide-react";
import SmartImage from "../../../shared/components/SmartImage";
import usePlayer from "../hooks/usePlayer";
import songService from "../../song/services/song.service";
import { routes } from "../../../shared/utils/routes";
import playlistService from "../../playlist/services/playlist.service";

const PlayerTrackCard = () => {
  const { currentSong, currentPlaylist } = usePlayer();

  let cover = songService.songCoverUrl(currentSong?.id!, currentSong?.cover!);

  if (!cover) {
    cover = playlistService.playlistCover(currentPlaylist?.id!, currentPlaylist?.cover!);
  }

  useEffect(() => { }, [currentSong]);

  return (
    <div className="mb-4 p-4 pb-2">
      <div className="min-w-full shrink-0 w-full aspect-square rounded-lg overflow-hidden shadow-[0_8px_24px_#00000080]">
        <SmartImage
          wrapClassName="w-full h-full"
          url={cover}
          icon={(
            <MusicIcon className="w-1/4 h-1/4" />
          )}
        />
      </div>

      <Link
        className="hover:underline block max-w-fit overflow-hidden"
        to={`${routes.tracks}/${currentSong?.id || ''}`}
      >
        <h2
          className="truncate mt-4 mb-0 text-xl font-medium text-white google-sans-flex-font"
          title={currentSong?.title}
        >
          {currentSong?.title}
        </h2>
      </Link>

      <Link
        className="hover:underline block max-w-fit overflow-hidden"
        to={`${routes.artists}/${currentSong?.artistId || ''}`}
      >
        <span
          className="truncate block text-sm font-medium"
          title={currentSong?.artist?.name}
        >
          {currentSong?.artist?.name}
        </span>
      </Link>
    </div>
  )
}

export default PlayerTrackCard;