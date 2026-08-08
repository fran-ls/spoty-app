import { MusicIcon, PauseIcon, PlayIcon } from "lucide-react";
import type { Playlist } from "../../playlist/playlist.types";
import type { LayoutKind } from "../library.types";
import type { User } from "../../auth/auth.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import playlistService from "../../playlist/services/playlist.service";
import usePlayer from "../../player/hooks/usePlayer";
import { useState } from "react";

interface PlaylistItemProps {
  gridImgSize: number;
  isHover: boolean;
  isExpanded: boolean;
  isPlaying: boolean;
  isCurrent: boolean;
  playlist: Playlist;
  layout: LayoutKind;
  user: User;
}

const PlaylistItem = (props: PlaylistItemProps) => {
  const { gridImgSize, isExpanded, playlist, layout, user, isCurrent, isHover, isPlaying } = props;
  const { onPlaylistChange, togglePlay, play } = usePlayer();

  const [playable, setPlayable] = useState(true);

  const isCoverImgs = !playlist.cover && playlist.coverImages && playlist.coverImages.length > 3
  const createdAt = getFmtDate(playlist.createdAt, '').split(' ')[0].replaceAll('/', ' ');
  const trackCount = playlist?.trackCount || 0;
  const manyTracks = trackCount !== 1;

  const bgIcon = "#333333";

  async function getPlaylistSongs() {
    if (!playable) return;

    if (isCurrent) {
      togglePlay();
      return;
    }

    const { data } = await playlistService.getPlaylistSongs(playlist.id);
    if (!data || !data.songs.length) {
      setPlayable(false);
      return;
    }

    setPlayable(data.songs.length > 0);
    play(data.songs, 0, data.meta);
    onPlaylistChange(playlist);
  }

  return (
    <>
      {layout.list && (
        <>
          <div className="flex items-center gap-3">
            <div
              className="min-w-12 w-12 h-12 rounded relative overflow-hidden"
              data-playable={playable}
              onClick={(e) => {
                e.stopPropagation();
                getPlaylistSongs();
              }}
            >
              <SmartImage
                styles={{
                  imgWrap: {
                    background: bgIcon
                  }
                }}
                url={playlist.cover}
              />

              {isCoverImgs && (
                <PlaylistCoverImgs images={playlist.coverImages || []} />
              )}

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
        <div className="group relative w-full text-[13px] font-semibold p-1">
          <div
            className="rounded-md overflow-hidden relative"
            style={{
              boxShadow: '0 8px 24px #00000080',
              width: '100%',
              height: 'auto',
              minWidth: '112px',
              minHeight: '112px',
              ...(gridImgSize && {
                width: gridImgSize,
                height: gridImgSize
              })
            }}
          >
            <SmartImage
              styles={{
                imgWrap: {
                  background: bgIcon,
                  width: '100%',
                  height: 'auto',
                  minWidth: '112px',
                  minHeight: '112px',
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

            {isCoverImgs && (
              <PlaylistCoverImgs images={playlist.coverImages || []} />
            )}

            <button
              className={`absolute bottom-0 right-2 bg-primary text-black p-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-90 ${isPlaying && isCurrent ? '-translate-y-2 opacity-100' : ''}`}
              style={{
                boxShadow: '0 8px 24px #0009',
              }}
              onClick={(e) => {
                e.stopPropagation();
                getPlaylistSongs();
              }}
            >
              {isPlaying
                ? <PauseIcon size={24} fill="currentColor" stroke="none" />
                : <PlayIcon size={24} fill="currentColor" stroke="none" />
              }
            </button>
          </div>

          <h4
            className={`${isCurrent ? 'text-primary' : 'text-white'} mt-2 truncate w-full text-[15px] font-semibold`}
            style={{
              width: `${gridImgSize}px`,
              minWidth: '110px',
              ...(gridImgSize && {
                width: gridImgSize
              })
            }}
            title={playlist.name}
          >
            {playlist.name}
          </h4>

          <div
            className="overflow-hidden flex items-center text-[#adaaaa]"
            style={{
              width: `${gridImgSize}px`,
              minWidth: '110px',
              ...(gridImgSize && {
                width: gridImgSize
              })
            }}
          >
            <span>Lista</span>
            <span className="mx-1">•</span>
            <span
              className="truncate"
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