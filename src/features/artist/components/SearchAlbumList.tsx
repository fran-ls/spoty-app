import { useEffect, useState } from "react";
import { ChevronRightIcon, DiscIcon } from "lucide-react";
import type { Album, AlbumFilters } from "../album.types";
import type { FilterKind } from "../../search/SearchPanel";
import SmartImage from "../../../shared/components/SmartImage";
import useAlbum from "../hooks/useAlbum";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Loader from "../../../shared/components/Loader";

interface SearchAlbumListProps {
  query: string;
  filter: FilterKind;
  triggerViewAlbum: (album: Album) => void;
  setActiveAlbum: React.Dispatch<React.SetStateAction<Album | null>>;
}

const SearchAlbumList = (props: SearchAlbumListProps) => {
  const { query, filter, triggerViewAlbum, setActiveAlbum } = props;
  const { albums, albumMeta, searchAlbums } = useAlbum();
  const isLoadMore = albumMeta.hasNextPage && filter === 'albums';

  const [page, setPage] = useState(0);
  const filters: AlbumFilters = {
    title: query.trim(),
    limit: 10,
    page: 1,
    include: {
      artist: true
    }
  }

  const { loaderRef } = useInfiniteScroll(() => {
    if (!isLoadMore) return;
    searchAlbums({ ...filters, page: page + 1 });
    setPage(page + 1);
  });

  useEffect(() => { setTimeout(() => searchAlbums(filters), 300) }, [query]);

  return (
    <div className="space-y-2 pt-2">
      <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
        <DiscIcon size={11} />
        <span>
          Álbumes Registrados ({albumMeta.total})
        </span>
      </h4>

      {albums.length === 0 ? (
        <p className="text-[10px] text-gray-600 italic px-1">
          Ningún álbum coincide.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-1.5">
          {albums.map(album => (
            <div
              key={album.id}
              onClick={() => {
                triggerViewAlbum(album);
                setActiveAlbum(album);
              }}
              className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <SmartImage
                  wrapClassName="text-gray-400 w-9 h-9 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0"
                  url={album.cover || null}
                  icon={<DiscIcon size={16} />}
                />

                <div className="overflow-hidden">
                  <h3 className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    {album.title}
                  </h3>
                  <span className="text-[9px] text-gray-400 truncate leading-none mt-0.5 block">
                    {album.artist?.name}
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

export default SearchAlbumList;