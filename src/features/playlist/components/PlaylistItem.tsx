import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import type { User } from "../../auth/auth.types";
import type { Playlist, PlaylistLayout, PlaylistMeta } from "../playlist.types";

interface PlaylistItemProps {
  isExpanded: boolean;
  playlist: Playlist;
  layout: PlaylistLayout;
  queueMeta: PlaylistMeta;
  user: User;
}

const PlaylistItem = ({ isExpanded, playlist, layout, user, queueMeta }: PlaylistItemProps) => {
  const createdAt = getFmtDate(playlist.createdAt, '').split(' ')[0].replaceAll('/', ' ');

  return (
    <>
      {(layout === 'list') && (
        <>
          <div className="w-full max-w-md">
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

          {isExpanded && (
            <>
              <div className="text-sm font-medium">
                {createdAt}
              </div>
            </>
          )}
        </>
      )}

      {(layout === 'compact-list') && (
        <>
          <div className="text-[13px] font-semibold flex items-center gap-1">
            <h4
              className={`${queueMeta.playlistId === playlist.id ? 'text-primary' : 'text-white'} line-clamp-1 w-full text-[15px] font-semibold`}
              title={playlist.name}
            >
              {playlist.name}
            </h4>
            <span>•</span>
            <span>Lista</span>
          </div>

          {isExpanded && (
            <>
              <div className="mr-auto text-sm font-medium">
                {createdAt}
              </div>
            </>
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
              6 canciones
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default PlaylistItem;