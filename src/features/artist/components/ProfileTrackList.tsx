import type { Track } from "../../song/song.types";
import SmartImage from "../../../shared/components/SmartImage";
import songService from "../../song/services/song.service";
import { formatTime } from "../../../shared/utils/formatTime";

interface ProfileTrackListProps {
  tracks: Track[];
}

const ProfileTrackList = ({ tracks }: ProfileTrackListProps) => {
  return (
    <div className="bg-[#1b1b1b] rounded-xl border border-white/5 divide-y divide-white/5">
      {tracks.map((tr, index) => (
        <div key={tr.id} className="p-2.5 flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-xs text-gray-500 font-mono w-4 text-center shrink-0">
              {index + 1}
            </span>

            <SmartImage
              wrapClassName="text-gray-400 w-7 h-7 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0"
              url={songService.songCoverUrl(tr.id, tr.cover)}
            />

            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate leading-tight">
                {tr.title}
              </span>
              <span className="text-[9px] text-gray-400 block truncate">
                {tr.album?.title}
              </span>
            </div>
          </div>

          <span className="text-[10px] text-gray-400 font-mono shrink-0">
            {formatTime(tr.duration ?? 0)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default ProfileTrackList;