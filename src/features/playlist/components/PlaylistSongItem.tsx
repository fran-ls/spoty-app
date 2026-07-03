import type { Playlist, PlaylistLayout, PlaylistMeta } from "../playlist.types";
import type { User } from "../../auth/auth.types";
import SmartImage from "../../../shared/components/SmartImage";

interface PlaylistItemProps {
  isExpanded: boolean;
  layout: PlaylistLayout;
  queueMeta: PlaylistMeta;
  user: User;
}

const PlaylistSongItem = ({ layout, user, queueMeta }: PlaylistItemProps) => {
  const playlist: Partial<Playlist> = {
    name: 'Canciones'
  }

  return (
    <div>
      {(layout === 'list') && (
        <>
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
        </>
      )}

      {(layout === 'compact-list') && (
        <div className="text-[13px] font-semibold flex items-center gap-1 text-[#adaaaa]">
          <h4
            className={`${queueMeta.playlistId === playlist.id ? 'text-primary' : 'text-white'} line-clamp-1 text-[15px] font-semibold`}
            title={playlist.name}
          >
            {playlist.name}
          </h4>
          <span>•</span>
          <span>Lista</span>
        </div>
      )}

      {(layout === 'grid') && (
        <div className="w-28 text-[13px] font-semibold p-1">
          <SmartImage
            wrapClassName="w-28 h-28 rounded-md text-[#adaaaa]"
            iconClassName="text-primary"
            url={null}
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
    </div>
  )
}

export default PlaylistSongItem;