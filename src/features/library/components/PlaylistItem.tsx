import { PauseIcon, PlayIcon } from "lucide-react";
import type { Playlist, PlaylistMeta } from "../../playlist/playlist.types";
import { PlaylistLayout } from "../library.types";
import type { User } from "../../auth/auth.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";

interface PlaylistItemProps {
  isExpanded: boolean;
  isHover: boolean;
  isPlaying: boolean;
  playlist: Playlist;
  layout: PlaylistLayout;
  queueMeta: PlaylistMeta;
  user: User;
  togglePlay: () => void;
}

const PlaylistItem = (props: PlaylistItemProps) => {
  const { isExpanded, playlist, layout, user, queueMeta, isHover, isPlaying, togglePlay } = props;
  const createdAt = getFmtDate(playlist.createdAt, '').split(' ')[0].replaceAll('/', ' ');

  return (
    <>
      {(layout === PlaylistLayout.LIST) && (
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
            <TrItem
              layout={layout}
              playlist={{ ...playlist, createdAt }}
            />
          )}
        </>
      )}

      {(layout === PlaylistLayout.COMPACT_LIST) && (
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
            <TrItem
              layout={layout}
              playlist={{ ...playlist, createdAt }}
            />
          )}
        </>
      )}

      {(layout === PlaylistLayout.GRID) && (
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

export default PlaylistItem;

const TrItem = ({ layout, playlist }: {
  layout: PlaylistLayout;
  playlist: Playlist;
}) => {
  return (
    <>
      <div className="sm:block hidden my-auto text-sm font-medium">
        {playlist.isPublic ? 'Pública' : 'Privada'}
      </div>
      <div className="md:block hidden my-auto text-sm font-medium">
        {playlist.trackCount}
      </div>
      <div className="lg:block hidden my-auto text-sm font-medium">
        {playlist.createdAt}
      </div>

      {layout === PlaylistLayout.LIST && (
        <div className="sm:hidden min-[420px]:block hidden pr-3 my-auto text-sm font-medium text-nowrap">
          {playlist.isPublic ? 'Pública' : 'Privada'}
        </div>
      )}

      {layout === PlaylistLayout.COMPACT_LIST && (
        <div className="sm:hidden min-[400px]:grid hidden min-[500px]:justify-items-start justify-items-end min-[500px]:grid-cols-[minmax(80px,1fr)_minmax(140px,1fr)] grid-cols-1 pr-3 gap-3">
          <div className="min-[400px]:inline-block hidden my-auto text-sm font-medium text-nowrap">
            {playlist.isPublic ? 'Pública' : 'Privada'}
          </div>
          <div className="min-[500px]:inline-block hidden my-auto text-sm font-medium text-nowrap">
            {playlist.trackCount} &nbsp; {(((playlist?.trackCount || 0) === 0) || ((playlist?.trackCount || 0) > 1)) ? 'Canciones' : 'Canción'}
          </div>
        </div>
      )}
    </>
  )
}