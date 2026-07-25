import { PauseIcon, PlayIcon } from "lucide-react";
import type { Playlist } from "../../playlist/playlist.types";
import type { LayoutKind, LibraryStatus } from "../library.types";
import type { Grid } from "./Library";
import playlistService from "../../playlist/services/playlist.service";
import SmartImage from "../../../shared/components/SmartImage";
import PlaylistItem from "./PlaylistItem";
import usePlayer from "../../player/hooks/usePlayer";
import useAuth from "../../auth/hooks/useAuth";

interface PlaylistsProps {
  grid: Grid;
  hoverId: string;
  gridImgSize: number;
  playlists: Playlist[];
  layoutKind: LayoutKind;
  libraryStatus: LibraryStatus;
  setHoverId: React.Dispatch<React.SetStateAction<string>>;
  onPlaylistClick: (playlist: Playlist) => void;
}

const Playlists = (props: PlaylistsProps) => {
  const { playlists, hoverId, layoutKind, gridImgSize, grid, libraryStatus, setHoverId, onPlaylistClick } = props;
  const { collapsed: isCollapsed, expanded: isExpanded } = libraryStatus;

  const { user } = useAuth();
  const { isPlaying, currentPlaylist, togglePlay } = usePlayer();

  return (
    playlists.map((playlist) => {
      const cover = playlistService.playlistCover(playlist.id, playlist.cover);
      const isCurrent = currentPlaylist?.id === playlist.id;
      const isCurrentHover = hoverId === playlist.id;

      return (
        <li
          onClick={() => onPlaylistClick(playlist)}
          className={`${isCollapsed ? 'justify-center' : isExpanded ? 'justify-start gap-3' : ''} ${(!layoutKind.grid && isExpanded) ? `${grid.li.s} ${grid.li.sm} ${grid.li.md} ${grid.li.lg}` : ''} grid p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md`}
          onPointerEnter={() => setHoverId(playlist.id)}
          onPointerLeave={() => setHoverId('')}
          key={playlist.id}
        >
          {isCollapsed && (
            <div className="min-w-12 w-12 h-12 rounded relative overflow-hidden hover:badge:bg-blue-500">
              <SmartImage
                wrapClassName="bg-[#333333]"
                url={cover}
              />

              {isCurrentHover &&
                <button
                  onClick={() => isCurrent && togglePlay()}
                  className="text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center"
                  type="button"
                >
                  {(isPlaying && isCurrent) ?
                    <PauseIcon
                      className="min-w-5 w-5 h-5"
                      fill="currentColor"
                      stroke="0"
                    /> :
                    <PlayIcon
                      className="min-w-5.5 w-5.5 h-5.5"
                      fill="currentColor"
                      stroke="0"
                    />
                  }
                </button>
              }
            </div>
          )}

          {!isCollapsed &&
            <PlaylistItem
              gridImgSize={isExpanded ? gridImgSize : 112}
              isPlaying={isPlaying && isCurrent}
              playlist={{ ...playlist, cover }}
              isHover={isCurrentHover}
              isExpanded={isExpanded}
              isCurrent={isCurrent}
              layout={layoutKind}
              user={user!}
              togglePlay={togglePlay}
            />
          }
        </li>
      )
    })
  )
}

export default Playlists;