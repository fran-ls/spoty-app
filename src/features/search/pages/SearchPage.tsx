import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import type { SearchFilter } from "../components/SearchHeader";
import ArtistResults from "../components/ArtistResults";
import TrackResults from "../components/TrackResults";
import PlaylistResults from "../components/PlaylistResults";
import SearchHeader from "../components/SearchHeader";
import ResultsContainer from "../components/ResultsContainer";
import SearchPlaylistPage from "../../playlist/pages/SearchPlaylistPage";
import { getDeviceType } from "../../../shared/utils/getDeviceType";
import SearchInput from "../components/SearchInput";

const SearchPage = () => {
  const { search } = useLocation();
  const { q = '' } = queryString.parse(search);

  const [filter, setFilter] = useState<SearchFilter>('all');
  const [hoverId, setHoverId] = useState('');
  const [query, setQuery] = useState('');

  const isAllFilter = filter === 'all';
  const isDesktop = getDeviceType() === 'desktop';

  useEffect(() => {
    if (!q) return;
    const qStr = q.toString();
    setQuery(qStr);
  }, [search]);

  if (!query && isDesktop) return (
    <SearchPlaylistPage />
  )

  if (!query && !isDesktop) return (
    <div className="mt-8 px-4">
      <SearchInput
        query={query}
        setQuery={setQuery}
      />
    </div>
  )

  return (
    <div className="md:px-8 px-4 py-8">
      {!isDesktop && (
        <SearchInput
          query={query}
          setQuery={setQuery}
        />
      )}

      <SearchHeader
        filter={filter}
        query={query}
        setFilter={setFilter}
      />

      <ResultsContainer
        filter={filter}
        ungrid={filter === 'tracks' || isAllFilter}
      >
        {(filter === 'artists' || isAllFilter) && (
          <ArtistResults
            query={query}
            filter={filter}
          />
        )}

        {(filter === 'tracks' || isAllFilter) && (
          <TrackResults
            query={query}
            filter={filter}
            hoverId={hoverId}
            setHoverId={setHoverId}
          />
        )}

        {(filter === 'playlists' || isAllFilter) && (
          <PlaylistResults
            query={query}
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