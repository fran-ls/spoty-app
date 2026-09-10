import { useEffect, useState } from "react";
import type { SearchFilter } from "./SearchHeader";
import type { ArtistFilters } from "../../artist/artist.types";
import useArtist from "../../artist/hooks/useArtist";
import { routes } from "../../../shared/utils/routes";
import ArtistCard from "../../artist/components/ArtistCard";
import SearchItem from "./SearchItem";
import usePlayer from "../../player/hooks/usePlayer";
import useTrack from "../../song/hooks/useTrack";
import { paginationMeta } from "../../../shared/data/search.data";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";

interface ArtistResultsProps {
  filter: SearchFilter;
  query: string;
}

const ArtistResults = ({ filter, query }: ArtistResultsProps) => {
  const { artists, artistMeta, searchArtists } = useArtist();
  const { searchTracks } = useTrack();
  const { currentSong, play, togglePlay, onPlaylistChange } = usePlayer();

  const isArtistFilter = filter === 'artists';

  const [page, setPage] = useState(1);
  const filters: ArtistFilters = {
    page: 1,
    name: query,
    limit: isArtistFilter ? 10 : 1
  }

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page < artistMeta.totalPages) {
      const nextPage = page + 1;
      await searchArtists({ ...filters, page: nextPage });
      setPage(nextPage);
    }
  });

  async function onPlay(artistId: string, isPlayingNow: boolean) {
    if (isPlayingNow) return togglePlay();
    const data = await searchTracks({ artistId });
    if (!data || !data.items.length) return;
    play(data.items, 0, paginationMeta);
    onPlaylistChange(null);
  }

  useEffect(() => {
    setPage(1);
    query && searchArtists(filters);
  }, [query]);

  return (
    <>
      {artists.map((a) => {
        const isPlayingNow = a.id === currentSong?.artistId;

        return (
          isArtistFilter ? (
            <ArtistCard
              artist={a}
              key={a.id}
              as="div"
              isPlayingNow={isPlayingNow}
              onPlay={() => onPlay(a.id, isPlayingNow)}
            />
          ) : (
            <SearchItem
              type="artist"
              payload={() => ({
                id: a.id,
                title: a.name,
                link: `${routes.artists}/${a.id}`,
                sub: 'Artista'
              })}
              isPlayingNow={isPlayingNow}
              onPlay={() => onPlay(a.id, isPlayingNow)}
              setHoverId={() => { }}
              key={a.id}
            />
          )
        )
      })}

      {(artistMeta.hasNextPage && isArtistFilter) && (
        <div
          className="flex-1 flex items-center justify-center"
          ref={loaderRef}
        >
          <Loader
            className="border-[#adaaaa5d] border-t-white"
            size={20}
            stroke={1}
          />
        </div>
      )}
    </>
  )
}

export default ArtistResults;