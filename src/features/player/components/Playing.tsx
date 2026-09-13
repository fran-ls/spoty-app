import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, PanelTopCloseIcon } from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import PlayerTrackCard from "./PlayerTrackCard";
import RelatedTracks from "./RelatedTracks";
import PlayerArtistCard from "./PlayerArtistCard";
import OpenQueueCard from "./OpenQueueCard";
import { CustomScrollbar } from "../../../shared/components/CustomScrollbar";
import { routes } from "../../../shared/utils/routes";

interface PlayingProps {
  asideRef: React.RefObject<HTMLElement | null>;
}

const Playing = ({ }: PlayingProps) => {
  const { currentPlaylist, currentSong, isPlayer, setIsPlayer } = usePlayer();
  const [scrollTop, setScrollTop] = useState(0);

  const playingId = currentPlaylist?.id || currentSong?.id || '';
  const redirectTo = `${currentPlaylist ? routes.playlists : routes.tracks}/${playingId}`;

  return (
    <div
      className={`w-full group relative rounded-lg overflow-hidden ${!isPlayer ? 'flex-1 cursor-pointer flex items-center justify-center' : ''}`}
      onClick={() => !isPlayer && setIsPlayer(true)}
    >
      {!isPlayer && (
        <button
          onClick={() => setIsPlayer(true)}
          className="ml-0.75 cursor-pointer text-[#adaaaa] p-1"
          type="button"
        >
          <ChevronLeftIcon size={28} strokeWidth={1.5} />
        </button>
      )}

      <div className={`w-72 overflow-hidden transition-transform duration-250 ${isPlayer ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <header
          className="h-14 p-4 text-[#adaaaa] relative transition-shadow duration-75 overflow-hidden"
          style={{
            ...(scrollTop && {
              boxShadow: '0 6px 10px #0009'
            })
          }}
        >
          <button
            className={`group-hover:opacity-100 opacity-0 group-hover:translate-x-2 -translate-x-full absolute left-0 top-3 p-1.5 text-[#adaaaa] flex items-center justify-between hover:text-white cursor-pointer rounded-lg transition-all duration-100`}
            onClick={() => setIsPlayer(false)}
          >
            <PanelTopCloseIcon
              className="rotate-90"
              size={20}
            />
          </button>
          <Link
            className="group-hover:pr-6 group-hover:translate-x-7 absolute left-4 text-white max-w-[calc(100%-28px)] overflow-hidden transition-transform duration-100"
            onMouseOver={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
            to={redirectTo}
          >
            <h1 className="truncate font-black google-sans-flex-font">
              {currentPlaylist?.name || currentSong?.artist?.name || 'Playlist'}
            </h1>
          </Link>
        </header>

        <CustomScrollbar
          scrollbarMode="vertical"
          viewport={{
            className: "text-[#adaaaa] overflow-x-hidden",
            style: {
              display: isPlayer ? "block" : "hidden",
              height: `calc(100vh - 64px - 88px - 56px)`
            },
            onScroll: (e) => setScrollTop(e.currentTarget.scrollTop)
          }}
        >
          <PlayerTrackCard />

          <RelatedTracks />

          <PlayerArtistCard />

          <OpenQueueCard />
        </CustomScrollbar>
      </div>
    </div>
  )
}

export default Playing;