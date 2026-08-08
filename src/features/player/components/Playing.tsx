import { ChevronLeftIcon, MusicIcon, PanelTopCloseIcon } from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import SmartImage from "../../../shared/components/SmartImage";
import songService from "../../song/services/song.service";
import playlistService from "../../playlist/services/playlist.service";

interface PlayingProps {
  asideRef: React.RefObject<HTMLElement | null>;
}

const Playing = ({ }: PlayingProps) => {
  const { currentSong, currentPlaylist, isPlayer, setIsPlayer } = usePlayer();

  const songCover = songService.songCoverUrl(currentSong?.id!, currentSong?.cover!);
  const playlistCover = playlistService.playlistCover(currentPlaylist?.id!, currentPlaylist?.cover!);

  return (
    <div
      className={`w-full group relative rounded-lg min-h-[calc(100vh-64px-88px)] max-h-[calc(100vh-64px-88px)] overflow-hidden ${!isPlayer ? 'cursor-pointer flex items-center justify-center' : ''}`}
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
        <header className="h-14 p-4 text-[#adaaaa] relative transition-shadow duration-75">
          <button
            className={`group-hover:opacity-100 opacity-0 group-hover:translate-x-2 -translate-x-full absolute left-0 top-3 p-1.5 text-[#adaaaa] flex items-center justify-between hover:text-white cursor-pointer rounded-lg transition-all duration-100`}
            onClick={() => setIsPlayer(false)}
          >
            <PanelTopCloseIcon
              className="rotate-90"
              size={20}
            />
          </button>
          <h3 className="group-hover:translate-x-7 absolute left-4 text-white font-black text-nowrap google-sans-flex-font transition-transform duration-100">
            {currentPlaylist?.name || 'Playlist'}
          </h3>
        </header>

        <section className={`px-4 pb-4 pt-1 text-[#adaaaa] overflow-hidden ${!isPlayer ? 'hidden' : ''}`}>
          <div className="w-[256px]">
            <div className="min-w-full shrink-0 w-full aspect-square rounded-lg overflow-hidden shadow-[0_8px_24px_#00000080]">
              <SmartImage
                wrapClassName="w-full h-full"
                url={songCover || playlistCover}
                icon={(
                  <MusicIcon className="w-1/4 h-1/4" />
                )}
              />
            </div>
            <h1
              className="truncate mt-4 mb-0 text-xl font-medium text-white google-sans-flex-font"
              title={currentSong?.title}
            >
              {currentSong?.title}
            </h1>
            <span
              className="truncate block -mt-0.75 text-sm font-medium"
              title={currentSong?.artist?.name}
            >
              {currentSong?.artist?.name}
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Playing;