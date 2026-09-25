import { useEffect, useState } from "react";
import { ChevronRightIcon, UserIcon } from "lucide-react";
import type { Artist } from "../artist.types";
import type { FilterKind } from "../../search/SearchPanel";
import artistService from "../services/artist.service";
import SmartImage from "../../../shared/components/SmartImage";
import useArtist from "../hooks/useArtist";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";

interface SearchArtistListProps {
  query: string;
  filter: FilterKind;
  triggerViewArtist: (artist: Artist) => void;
}

const SearchArtistList = (props: SearchArtistListProps) => {
  const { query, filter, triggerViewArtist } = props;
  const { artists, artistMeta, loading, searchArtists } = useArtist();
  const isLoadMore = artistMeta.hasNextPage && filter === 'artists';

  const [page, setPage] = useState(1);
  const filters = {
    name: query.trim(),
    limit: 10,
    page
  }

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page === 1 || isLoadMore) {
      await searchArtists(filters);
      setPage(page + 1);
    }
  });

  useEffect(() => { setTimeout(() => searchArtists(filters), 300) }, [query]);

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
        <UserIcon size={11} />
        <span>
          Artistas registrados ({artistMeta.total})
        </span>
      </h4>

      {artists.length === 0 ? (
        <p className="text-[10px] text-gray-600 italic px-1">
          Ningún artista coincide.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-1.5">
          {artists.map((artist) => (
            <div
              onClick={() => triggerViewArtist(artist)}
              className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
              key={artist.id}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <SmartImage
                  wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0"
                  url={artistService.artistImage(artist.id, artist.image)}
                  icon={(
                    <UserIcon size={16} />
                  )}
                />

                <div className="overflow-hidden flex flex-col gap-1">
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    {artist.name}
                  </p>
                  <span className="text-[9px] text-gray-400 font-mono">
                    ID: {artist.id}
                  </span>
                </div>
              </div>

              <ChevronRightIcon
                className="text-gray-600 group-hover:text-primary transition-colors"
                size={14}
              />
            </div>
          ))}
        </div>
      )}

      {(isLoadMore && !loading) && (
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
      )}
    </div>
  )
}

export default SearchArtistList;