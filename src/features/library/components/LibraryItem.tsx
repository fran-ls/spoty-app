import { PauseIcon, PlayIcon } from "lucide-react";
import type { Playlist, PlaylistLayout, PlaylistMeta } from "../../playlist/playlist.types";
import type { User } from "../../auth/auth.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";

interface LibraryItemProps {
  isExpanded: boolean;
  isHover: boolean;
  isPlaying: boolean;
  playlist: Playlist;
  layout: PlaylistLayout;
  queueMeta: PlaylistMeta;
  user: User;
  togglePlay: () => void;
}

const LibraryItem = (props: LibraryItemProps) => {
  const { isExpanded, playlist, layout, user, queueMeta, isHover, isPlaying, togglePlay } = props;
  const createdAt = getFmtDate(playlist.createdAt, '').split(' ')[0].replaceAll('/', ' ');

  return (
    <>
      {(layout === 'list') && (
        <>
          <div className="flex items-center gap-3">
            <div className="min-w-12 w-12 h-12 bg-[#262626] rounded relative overflow-hidden hover:badge:bg-blue-500">
              <SmartImage url={playlist.cover} />

              {isHover &&
                <button
                  onClick={() => {
                    if (queueMeta.playlistId === playlist.id) togglePlay();
                  }}
                  className="text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center"
                  type="button"
                >
                  {isPlaying ?
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

            <div>
              <h4
                className={`${queueMeta.playlistId === playlist.id ? 'text-primary' : 'text-white'} line-clamp-1 w-full mt-1 text-[15px] font-semibold`}
                title={playlist.name}
              >
                {playlist.name}
              </h4>
              <div className="text-[13px] font-semibold flex items-center gap-1">
                <span>Lista</span>
                <span>•</span>
                <span className="line-clamp-1 max-w-full">
                  {user?.username}
                </span>
              </div>
            </div>
          </div>

          {isExpanded && (
            <TrItem playlist={{ ...playlist, createdAt }} />
          )}
        </>
      )}

      {(layout === 'compact-list') && (
        <>
          <div className="text-[13px] font-semibold flex items-center gap-1 w-full">
            <h4
              className={`${queueMeta.playlistId === playlist.id ? 'text-primary' : 'text-white'} line-clamp-1 text-[15px] font-semibold`}
              title={playlist.name}
            >
              {playlist.name}
            </h4>
            <span>•</span>
            <span>Lista</span>
          </div>

          {isExpanded && (
            <TrItem playlist={{ ...playlist, createdAt }} />
          )}
        </>
      )}

      {(layout === 'grid') && (
        <div className="w-28 text-[13px] font-semibold p-1">
          <SmartImage
            wrapClassName="w-28 h-28 rounded-md"
            url={playlist.cover}
          />

          <h4
            className={`${queueMeta.playlistId === playlist.id ? 'text-primary' : 'text-white'} mt-2 line-clamp-1 overflow-hidden w-full text-[15px] font-semibold`}
            title={playlist.name}
          >
            {playlist.name}
          </h4>

          <div className="flex items-center w-28 text-[#adaaaa]">
            <span>Lista</span>
            <span className="mx-1">•</span>
            <span className="line-clamp-1">
              {playlist.trackCount} canciones
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default LibraryItem;

const TrItem = ({ playlist }: { playlist: Playlist }) => {
  return (
    <>
      <div className="sm:block hidden my-auto text-sm font-medium">
        {playlist.isPublic ? 'Pública' : 'Privada'}
      </div>
      <div className="md:block hidden my-auto text-sm font-medium">
        {playlist.createdAt}
      </div>
      <div className="lg:block hidden my-auto text-sm font-medium">
        {playlist.trackCount}
      </div>
    </>
  )
}