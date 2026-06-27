import { useEffect, useState } from "react";
import { ChevronRightIcon, MusicIcon } from "lucide-react";
import type { Playlist } from "../playlist.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import type { FilterKind } from "../../song/components/SearchPanel";
import SmartImage from "../../../shared/components/SmartImage";
import playlistService from "../services/playlist.service";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";

interface SearchPlaylistListProps {
  query: string;
  filter: FilterKind;
  triggerViewAlbum: (id: string) => void;
}

const SearchPlaylistList = ({ query, filter, triggerViewAlbum }: SearchPlaylistListProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistMeta, setPlaylistMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const isLoadMore = playlistMeta.hasNextPage && filter === 'playlists';

  const [page, setPage] = useState(0);
  const filters = {
    name: query.trim(),
    limit: 10,
    page: 0
  }

  const { loaderRef } = useInfiniteScroll(() => {
    if (!isLoadMore) return;
    searchPlaylists({ ...filters, page: page + 1 });
    setPage(page + 1);
  });

  async function searchPlaylists(filters?: Record<string, any>) {
    const { data } = await playlistService.searchPlaylists(filters);
    if (!data) return;

    setPlaylistMeta(data.meta);

    if (page > 1) {
      setPlaylists((prev) => [...prev, ...data.items]);
      return;
    }

    setPlaylists(data.items);
  }

  useEffect(() => { setTimeout(() => searchPlaylists(filters), 300) }, [query]);

  return (
    <div className="space-y-2 pt-2">
      <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
        <MusicIcon size={11} />
        <span>Listas registradas ({playlistMeta.total})</span>
      </h4>

      {playlists.length === 0 ? (
        <p className="text-[10px] text-gray-600 italic px-1">
          Ninguna canción coincide.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-1.5">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => triggerViewAlbum(playlist.id)}
              className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <SmartImage
                  wrapClassName="text-gray-400 min-w-0 w-9 h-9 max-w-9 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0"
                  url={playlistService.playlistCover(playlist.id, playlist.cover)}
                />

                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    {playlist.name}
                  </p>
                  <span className="text-[9px] text-gray-400 truncate leading-none mt-0.5 block">
                    {playlist.id}
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

export default SearchPlaylistList;