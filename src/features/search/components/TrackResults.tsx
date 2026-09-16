import { useEffect, useState } from "react";
import type { SearchFilter } from "./SearchHeader";
import type { TrackFilters } from "../../song/song.types";
import useTrack from "../../song/hooks/useTrack";
import { routes } from "../../../shared/utils/routes";
import SearchItem from "./SearchItem";
import TrackList from "./TrackList";
import usePlayer from "../../player/hooks/usePlayer";
import { paginationMeta } from "../../../shared/data/search.data";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Loader from "../../../shared/components/Loader";
import songService from "../../song/services/song.service";

interface TrackResultsProps {
  filter: SearchFilter;
  query: string;
  hoverId: string;
  setHoverId: React.Dispatch<React.SetStateAction<string>>;
}

const TrackResults = ({ filter, query, hoverId, setHoverId }: TrackResultsProps) => {
  const { tracks, trackMeta, searchTracks } = useTrack();
  const { currentSong, queue, play, togglePlay, onPlaylistChange, setQueue } = usePlayer();

  const [page, setPage] = useState(1);
  const filters: TrackFilters = {
    title: query,
    limit: 10
  }

  const loadMoreTracks = async () => {
    if (page < trackMeta.totalPages) {
      const nextPage = page + 1;
      await searchTracks({ ...filters, page: nextPage });
      setPage(nextPage);
    }
  }

  const { loaderRef } = useInfiniteScroll(() => loadMoreTracks());

  useEffect(() => {
    setPage(1);
    query && searchTracks(filters);
  }, [query]);

  return filter === 'tracks' ? (
    <TrackList
      items={tracks}
      paginationMeta={trackMeta}
      loadMore={loadMoreTracks}
    />
  ) : (
    <>
      {tracks.map((t) => {
        const isPlayingNow = t.id === currentSong?.id;

        return (
          <SearchItem
            type="song"
            payload={() => ({
              id: t.id,
              title: t.title,
              link: `${routes.tracks}/${t.id}`,
              sub: t.artist?.name,
              sublink: `${routes.artists}/${t.artistId}`
            })}
            isHover={hoverId === t.id}
            isPlayingNow={isPlayingNow}
            loadImage={() => (songService.songCoverUrl(t.id, t.cover))}
            onPlay={() => {
              if (isPlayingNow) return togglePlay();
              play([t], 0, paginationMeta);
              onPlaylistChange(null);
            }}
            addToQueue={() => !queue.includes(t) && setQueue([...queue, t])}
            setHoverId={setHoverId}
            key={t.id}
          />
        )
      })}

      {trackMeta.hasNextPage && (
        <div
          className="flex items-center justify-center px-6 py-2 overflow-hidden"
          ref={loaderRef}
        >
          <Loader
            className="border-transparent border-t-slate-200"
            size={20}
            stroke={2}
          />
        </div>
      )}
    </>
  )
}

export default TrackResults;