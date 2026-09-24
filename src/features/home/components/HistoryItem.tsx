import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { THistoryItem } from "../../player/playHistory.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import HistoryItemList from "./HistoryItemList";
import playlistService from "../../playlist/services/playlist.service";
import songService from "../../song/services/song.service";

interface HistoryItemProps {
  userId: string;
  item: THistoryItem;
}

const HistoryItem = ({ userId, item }: HistoryItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const item1 = item.items[0];
  const cover = item1.playlistId
    ? playlistService.playlistCover(item1.playlistId, item1.playlist?.cover)
    : songService.songCoverUrl(item1.songId!, item1.song?.cover);

  return (
    <div className="">
      <h2 className="ml-2 mb-4 text-xl font-bold text-white flex items-center justify-between gap-2">
        {getFmtDate(item.createdAt.toLocaleString().split('T')[0] + 'T00:00:00', 'EEE, dd MMM')}
      </h2>

      <div
        className="hover:bg-[#262626] px-2 py-1 rounded-md cursor-pointer flex items-center gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <SmartImage
          url={cover}
          styles={{
            imgWrap: {
              minWidth: 64,
              width: 64,
              height: 64,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 60px rgba(0, 0, 0, .5)'
            },
            icon: 'w-[40%] h-[40%]'
          }}
        />

        <span className="text-[15px] text-[#e4e4e4] font-medium">
          {item.meta?.total || item.items.length} {item.items.length !== 1 ? 'canciones' : 'canción'}
        </span>

        <button
          className="ml-auto p-1 cursor-pointer"
          type="button"
        >
          <ChevronDownIcon
            className={`${expanded ? '-rotate-180' : 'rotate-0'} transition-all`}
            strokeWidth={1.5}
            size={28}
          />
        </button>
      </div>

      <HistoryItemList
        expanded={expanded}
        userId={userId}
        item={item}
      />
    </div>
  )
}

export default HistoryItem;