import { Link, useNavigate } from "react-router-dom";
import { UserIcon } from "lucide-react";
import type { Artist } from "../artist.types";
import SmartImage from "../../../shared/components/SmartImage";
import PlayButton from "../../../shared/components/PlayButton";
import { routes } from "../../../shared/utils/routes";
import artistService from "../services/artist.service";

interface ArtistCardProps {
  artist: Artist;
  isPlayingNow?: boolean;
  playable?: boolean;
  as?: 'div' | 'li';
  onPlay?: () => void;
}

const ArtistCard = (props: ArtistCardProps) => {
  const { artist, isPlayingNow = false, playable = true, as = 'div', onPlay } = props;
  const cover = artistService.artistImage(artist.id, artist.image);
  const redirectTo = `${routes.artists}/${artist.id}`;

  const navigate = useNavigate();

  const CardContent = () => (
    <>
      <div className="relative">
        <div className="shadow-[0_8px_24px_#00000080] relative mb-2 aspect-square rounded-full overflow-hidden bg-[#333333]">
          <SmartImage
            wrapClassName="w-full h-full bg-transparent"
            referrerPolicy="no-referrer"
            url={cover}
            icon={(
              <UserIcon className="w-1/4 h-1/4" />
            )}
          />
        </div>

        {playable && (
          <PlayButton
            isPlayingNow={isPlayingNow}
            onClick={(e) => {
              e.stopPropagation();
              if (playable) onPlay?.();
            }}
          />
        )}
      </div>

      <Link
        className="hover:underline max-w-fit w-full text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        to={redirectTo}
      >
        <h3
          className="hover:underline text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
          title={artist.name}
          style={{
            fontWeight: 500
          }}
        >
          {artist.name || 'Artista'}
        </h3>
      </Link>

      <span className="text-sm text-[#adaaaa] leading-relaxed">
        Artista
      </span>
    </>
  )

  const className = `group min-w-full grow max-w-50 h-fit hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 flex flex-col playlist-item cursor-pointer relative`;

  return as === 'div' ? (
    <div
      onClick={() => navigate(redirectTo)}
      className={className}
      key={artist.id}
    >
      <CardContent />
    </div>
  ) : (
    <li
      onClick={() => navigate(redirectTo)}
      className={className}
      key={artist.id}
    >
      <CardContent />
    </li>
  )
}

export default ArtistCard;