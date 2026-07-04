import { useEffect, useState } from "react";
import { ChevronRightIcon, MusicIcon } from "lucide-react";
import type { Track, TrackFilters } from "../song.types";
import type { FilterKind } from "../../search/SearchPanel";
import songService from "../services/song.service";
import SmartImage from "../../../shared/components/SmartImage";
import useTrack from "../hooks/useTrack";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Loader from "../../../shared/components/Loader";

interface SearchTrackListProps {
  query: string;
  filter: FilterKind;
  triggerViewTrack: (track: Track) => void;
}

const SearchTrackList = ({ query, filter, triggerViewTrack }: SearchTrackListProps) => {
  const { tracks, trackMeta, searchTracks } = useTrack();
  const isLoadMore = trackMeta.hasNextPage && filter === 'tracks';

  const [page, setPage] = useState(0);
  const filters: TrackFilters = {
    title: query.trim(),
    limit: 10,
    page: 0
  }

  const { loaderRef } = useInfiniteScroll(() => {
    if (!isLoadMore) return;
    searchTracks({ ...filters, page: page + 1 });
    setPage(page + 1);
  });

  useEffect(() => { setTimeout(() => searchTracks(filters), 300) }, [query]);

  return (
    <div className="space-y-2 pt-2">
      <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
        <MusicIcon size={11} />
        <span>Canciones registradas ({trackMeta.total})</span>
      </h4>

      {tracks.length === 0 ? (
        <p className="text-[10px] text-gray-600 italic px-1">
          Ninguna canción coincide.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-1.5">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => triggerViewTrack(track)}
              className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <SmartImage
                  wrapClassName="text-gray-400 min-w-0 w-9 h-9 max-w-9 rounded-md bg-white/5 border border-white/10 overflow-hidden shrink-0"
                  url={songService.songCoverUrl(track.id, track.cover)}
                />

                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    {track.title}
                  </p>
                  <span className="mt-1 text-[9px] text-gray-400 truncate leading-none block">
                    {track.artist?.name}
                  </span>
                </div>
              </div>

              <ChevronRightIcon className="text-gray-600 group-hover:text-primary transition-colors" size={14} />
            </div>
          ))}
        </div>
      )}

      {isLoadMore &&
        <div
          className="flex items-center justify-center overflow-hidden"
          ref={loaderRef}
        >
          <Loader
            className="border-transparent border-t-slate-200"
            size={20}
            stroke={2}
          />
        </div>
      }
    </div>
  )
}

export default SearchTrackList;