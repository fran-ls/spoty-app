import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { THistoryItem } from "../../player/playHistory.types";
import SmartImage from "../../../shared/components/SmartImage";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import HistoryItemList from "./HistoryItemList";
import playlistService from "../../playlist/services/playlist.service";
import songService from "../../song/services/song.service";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";

interface HistoryItemProps {
  userId: string;
  data: THistoryItem;
}

const HistoryItem = ({ userId, data }: HistoryItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const { playlistId, songId, playlist, song } = data.items[0];
  const playlistCover = playlistId ? playlistService.playlistCover(playlistId, playlist?.cover) : '';
  const cover = playlistCover || (songId ? songService.songCoverUrl(songId, song?.cover) : '');
  const coverImages = playlist?.coverImages || [];
  const isCoverImgs = !playlistCover && coverImages.length > 3;

  return (
    <div className="">
      <h2 className="ml-2 mb-4 text-xl font-bold text-white flex items-center justify-between gap-2">
        {getFmtDate(data.createdAt.toLocaleString().split('T')[0] + 'T00:00:00', 'EEE, dd MMM')}
      </h2>

      <div
        className="hover:bg-[#262626] px-2 py-1 rounded-md cursor-pointer flex items-center gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="bg-[#262626] relative overflow-hidden"
          style={{
            minWidth: 64,
            width: 64,
            height: 64,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 4px 60px rgba(0, 0, 0, .5)'
          }}
        >
          <SmartImage
            url={cover || coverImages[0]?.url || ''}
            styles={{
              imgWrap: 'w-full h-full',
              icon: 'w-[40%] h-[40%]'
            }}
          />

          {isCoverImgs && (
            <PlaylistCoverImgs images={coverImages} />
          )}
        </div>

        <span className="text-[15px] text-[#e4e4e4] font-medium">
          {data.meta?.total || data.items.length} {data.items.length !== 1 ? 'reproducciones' : 'reproducción'}
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
        data={data}
      />
    </div>
  )
}

export default HistoryItem;