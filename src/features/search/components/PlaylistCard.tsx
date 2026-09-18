import { Link, useNavigate } from "react-router-dom";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { Playlist } from "../../playlist/playlist.types";
import SmartImage from "../../../shared/components/SmartImage";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import playlistService from "../../playlist/services/playlist.service";
import { routes } from "../../../shared/utils/routes";
import usePlayer from "../../player/hooks/usePlayer";

interface PlaylistCardProps {
  playlist: Playlist;
  playable?: boolean;
  onPlay: () => void;
}

const PlaylistCard = ({ playlist, playable = true, onPlay }: PlaylistCardProps) => {
  const { isPlaying, currentPlaylist } = usePlayer();

  const cover = playlistService.playlistCover(playlist.id, playlist.cover);
  const isCoverImgs = playlist.coverImages && playlist.coverImages.length > 3;

  const isPlayingNow = isPlaying && playlist.id === currentPlaylist?.id;
  const redirectTo = `${routes.playlists}/${playlist.id}`;

  const navigate = useNavigate();

  return (
    <div
      className="group h-fit group hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 flex flex-col playlist-item cursor-pointer"
      onClick={() => navigate(`${routes.playlists}/${playlist.id}`)}
      key={playlist.id}
    >
      <div className="shadow-[0_8px_24px_#00000080] relative mb-2 aspect-square rounded-md overflow-hidden bg-[#333333]">
        <SmartImage
          wrapClassName="bg-transparent"
          referrerPolicy="no-referrer"
          url={cover}
          styles={{
            imgWrap: 'w-full h-full bg-transparent',
            icon: 'w-[40%] h-[40%]'
          }}
        />

        {(!cover && isCoverImgs) && (
          <PlaylistCoverImgs images={playlist.coverImages || []} />
        )}

        {playable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (playable) onPlay();
            }}
            className={`shadow-[0_8px_8px_rgba(0,0,0,0.3)] absolute bottom-3 right-3 bg-primary text-black p-3 rounded-full opacity-0 ${isPlayingNow ? 'translate-y-0 opacity-100' : 'translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
            type="button"
          >
            {isPlayingNow
              ? <PauseIcon size={24} fill="currentColor" stroke="none" />
              : <PlayIcon size={24} fill="currentColor" stroke="none" />
            }
          </button>
        )}
      </div>

      <Link
        className="hover:underline max-w-fit w-full text-white"
        onClick={(e) => e.stopPropagation()}
        to={redirectTo}
      >
        <h3
          className="font-light text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
          title={playlist.name}
          style={{
            fontWeight: 500
          }}
        >
          {playlist.name || 'Lista'}
        </h3>
      </Link>

      <p className="text-sm text-[#adaaaa] line-clamp-2 leading-relaxed">
        Lista
      </p>
    </div>
  )
}

export default PlaylistCard;