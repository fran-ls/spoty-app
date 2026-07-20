import { MusicIcon, PauseIcon, PlayIcon } from "lucide-react";
import type { Playlist } from "../../playlist/playlist.types";
import type { LayoutKind } from "../library.types";
import type { User } from "../../auth/auth.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";

interface PlaylistItemProps {
  gridImgSize: number;
  isHover: boolean;
  isExpanded: boolean;
  isPlaying: boolean;
  isCurrent: boolean;
  playlist: Playlist;
  layout: LayoutKind;
  user: User;
  togglePlay: () => void;
}

const PlaylistItem = (props: PlaylistItemProps) => {
  const { gridImgSize, isExpanded, playlist, layout, user, isCurrent, isHover, isPlaying, togglePlay } = props;

  const createdAt = getFmtDate(playlist.createdAt, '').split(' ')[0].replaceAll('/', ' ');
  const trackCount = playlist?.trackCount || 0;
  const manyTracks = trackCount === 0 || trackCount > 1;

  const bgIcon = "#333333";

  return (
    <>
      {layout.list && (
        <>
          <div className="flex items-center gap-3">
            <div className="min-w-12 w-12 h-12 rounded relative overflow-hidden hover:badge:bg-blue-500">
              <SmartImage
                styles={{
                  imgWrap: {
                    background: bgIcon
                  }
                }}
                url={playlist.cover}
              />

              {isHover &&
                <button
                  onClick={() => isCurrent && togglePlay()}
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
                className={`${isCurrent ? 'text-primary' : 'text-white'} line-clamp-1 w-full mt-1 text-[15px] font-semibold`}
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
              manyTracks={manyTracks}
              playlist={{
                ...playlist,
                createdAt,
                trackCount
              }}
            />
          )}
        </>
      )}

      {layout.compactList && (
        <>
          <div className="text-[13px] font-semibold flex items-center gap-1 w-full">
            <h4
              className={`${isCurrent ? 'text-primary' : 'text-white'} line-clamp-1 text-[15px] font-semibold`}
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
              manyTracks={manyTracks}
              playlist={{
                ...playlist,
                createdAt,
                trackCount
              }}
            />
          )}
        </>
      )}

      {layout.grid && (
        <div className="relative w-full text-[13px] font-semibold p-1">
          <SmartImage
            styles={{
              imgWrap: {
                background: bgIcon,
                width: '100%',
                height: 'auto',
                minWidth: '112px',
                minHeight: '112px',
                borderRadius: '6px',
                boxShadow: '0 8px 24px #00000080',
                ...(gridImgSize && {
                  width: gridImgSize,
                  height: gridImgSize
                })
              }
            }}
            className="object-cover w-full h-full"
            url={playlist.cover}
            icon={(
              <MusicIcon className="w-1/2 h-1/2" />
            )}
          />

          <h4
            className={`${isCurrent ? 'text-primary' : 'text-white'} mt-2 line-clamp-1 overflow-hidden w-full text-[15px] font-semibold`}
            title={playlist.name}
          >
            {playlist.name}
          </h4>

          <div className="flex items-center text-[#adaaaa]">
            <span>Lista</span>
            <span className="mx-1">•</span>
            <span
              className="line-clamp-1"
              title={`${trackCount} ${manyTracks ? 'canciones' : 'Canción'}`}
            >
              {trackCount} {manyTracks ? 'canciones' : 'Canción'}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default PlaylistItem;

const TrItem = ({ layout, playlist, manyTracks }: {
  layout: LayoutKind;
  playlist: Playlist;
  manyTracks: boolean;
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

      {layout.list && (
        <div className="sm:hidden min-[420px]:block hidden pr-3 my-auto text-sm font-medium text-nowrap">
          {playlist.isPublic ? 'Pública' : 'Privada'}
        </div>
      )}

      {layout.compactList && (
        <div className="sm:hidden min-[500px]:grid-cols-[minmax(80px,1fr)_minmax(140px,1fr)] min-[420px]:grid hidden min-[500px]:justify-items-start justify-items-end grid-cols-1 pr-3 gap-3">
          <div className="min-[420px]:inline-block hidden my-auto text-sm font-medium text-nowrap">
            {playlist.isPublic ? 'Pública' : 'Privada'}
          </div>
          <div className="min-[500px]:inline-block hidden my-auto text-sm font-medium text-nowrap">
            {playlist.trackCount} &nbsp; {manyTracks ? 'Canciones' : 'Canción'}
          </div>
        </div>
      )}
    </>
  )
}