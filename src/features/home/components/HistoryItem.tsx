import { XIcon } from "lucide-react";
import type { THistoryItem } from "../../player/playHistory.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import playlistService from "../../playlist/services/playlist.service";

interface HistoryItemProps {
  item: THistoryItem | null;
  isDetail?: boolean;
  onSetItem?: (item: THistoryItem | null) => void;
}

const HistoryItem = ({ item, isDetail = false, onSetItem }: HistoryItemProps) => {
  if (!item) return null

  const { createdAt, items } = item;

  return (
    <div>
      <h2
        className="ml-2 mb-4 text-xl font-bold text-white flex items-center justify-between gap-2"
        onClick={() => onSetItem?.(item)}
      >
        {getFmtDate(createdAt, 'EEE, dd MMM')}

        {isDetail &&
          <button
            className="p-1 rounded-full hover:bg-[#1f1f1f] hover:text-white text-[#adaaaa]"
            onClick={() => onSetItem?.(null)}
            type="button"
          >
            <XIcon size={20} />
          </button>
        }
      </h2>

      <ul className="space-y-1">
        {items.map((h) => {
          const playlist = h.playlist;
          const cover = playlist ? playlistService.playlistCover(playlist.id, playlist.cover) : null;
          const isCoverImgs = !cover && playlist?.coverImages && playlist.coverImages.length > 3;

          return (
            <li
              className="hover:bg-[#262626] rounded-md px-2 py-1 w-full flex items-center justify-between gap-3"
              key={h.id}
            >
              <div className="flex items-center gap-3">
                <div
                  className="min-w-16 w-16 h-16 rounded overflow-hidden relative"
                  style={{
                    boxShadow: '0 4px 60px rgba(0, 0, 0, .5)'
                  }}
                >
                  {h.song?.cover ?
                    <SmartImage
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      url={h.song.cover}
                      styles={{
                        imgWrap: 'w-full h-full',
                        icon: 'text-white w-[40%] h-[40%]'
                      }}
                    />
                    :
                    <>
                      <SmartImage
                        url={cover}
                        styles={{
                          imgWrap: 'w-full h-full',
                          icon: 'text-white w-[40%] h-[40%]'
                        }}
                      />

                      {isCoverImgs && (
                        <PlaylistCoverImgs images={playlist.coverImages || []} />
                      )}
                    </>
                  }
                </div>

                <div className="w-full">
                  <p className="text-white font-semibold">
                    {h.song?.title || h.playlist?.name}
                  </p>

                  {h.song?.artist && (
                    <span className="text-sm">
                      {h.song.artist.name}
                    </span>
                  )}

                  {h.playlist && (
                    <span className="text-sm">
                      Lista
                    </span>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default HistoryItem;