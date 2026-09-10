import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { SearchFilter } from "../components/SearchHeader";
import ArtistResults from "../components/ArtistResults";
import TrackResults from "../components/TrackResults";
import PlaylistResults from "../components/PlaylistResults";
import SearchHeader from "../components/SearchHeader";
import ResultsContainer from "../components/ResultsContainer";
import SearchPlaylistPage from "../../playlist/pages/SearchPlaylistPage";
import { fmtSearchUrl } from "../utils/fmtSearchUrl";

const SearchPage = () => {
  const { search } = useLocation();

  const [filter, setFilter] = useState<SearchFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isAllFilter = filter === 'all';

  const [hoverId, setHoverId] = useState('');

  useEffect(() => {
    const q = fmtSearchUrl({ text: search, reverse: true });
    q && setSearchQuery(q);
  }, [search]);

  if (!searchQuery) return (
    <SearchPlaylistPage />
  )

  return (
    <div className="md:px-8 px-2 py-8">
      <SearchHeader
        filter={filter}
        query={searchQuery}
        setFilter={setFilter}
      />

      <ResultsContainer
        filter={filter}
        ungrid={filter === 'tracks' || isAllFilter}
      >
        {(filter === 'artists' || isAllFilter) && (
          <ArtistResults
            query={searchQuery}
            filter={filter}
          />
        )}

        {(filter === 'tracks' || isAllFilter) && (
          <TrackResults
            query={searchQuery}
            filter={filter}
            hoverId={hoverId}
            setHoverId={setHoverId}
          />
        )}

        {(filter === 'playlists' || isAllFilter) && (
          <PlaylistResults
            query={searchQuery}
            filter={filter}
            hoverId={hoverId}
            setHoverId={setHoverId}
          />
        )}
      </ResultsContainer>
    </div>
  )
}

export default SearchPage;