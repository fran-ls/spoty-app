import { useState } from "react";
import { SearchIcon } from "lucide-react";
import type { Artist } from "../../artist/artist.types";
import type { Album } from "../../artist/album.types";
import SearchPlaylistList from "../../playlist/components/SearchPlaylistList";
import SearchTrackList from "./SearchTrackList";
import SearchAlbumList from "../../artist/components/SearchAlbumList";
import SearchArtistList from "../../artist/components/SearchArtistList";

export type FilterKind = 'all' | 'artists' | 'albums' | 'tracks' | 'playlists'

interface SearchPanelProps {
  triggerViewArtist: (id: string) => void;
  triggerViewAlbum: (id: string) => void;
  setArtist: React.Dispatch<React.SetStateAction<Artist | null>>;
  setActiveAlbum: React.Dispatch<React.SetStateAction<Album | null>>;
}

const SearchPanel = (props: SearchPanelProps) => {
  const { setArtist, setActiveAlbum, triggerViewArtist, triggerViewAlbum } = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterType, setSearchFilterType] = useState<FilterKind>('all');

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
          <SearchIcon size={14} />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, artista, álbum..."
          className="w-full bg-[#181818] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-500 outline-none transition-all"
        />
      </div>

      <div className="flex gap-1.5 shrink-0">
        {(['all', 'tracks', 'playlists', 'artists', 'albums'] as const).map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setSearchFilterType(f)}
            className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold transition-all outline-none ${searchFilterType === f
              ? 'bg-white text-black font-black'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
          >
            {f === 'all' ? 'Todo' : f === 'artists' ? 'Artistas' : f === 'albums' ? 'Álbumes' : f === 'tracks' ? 'Canciones' : 'Listas'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(searchFilterType === 'all' || searchFilterType === 'tracks') && (
          <SearchTrackList
            query={searchQuery}
            filter={searchFilterType}
            triggerViewAlbum={triggerViewAlbum}
          />
        )}

        {(searchFilterType === 'all' || searchFilterType === 'playlists') && (
          <SearchPlaylistList
            query={searchQuery}
            filter={searchFilterType}
            triggerViewAlbum={triggerViewAlbum}
          />
        )}

        {(searchFilterType === 'all' || searchFilterType === 'artists') && (
          <SearchArtistList
            query={searchQuery}
            filter={searchFilterType}
            setArtist={setArtist}
            triggerViewArtist={triggerViewArtist}
          />
        )}

        {(searchFilterType === 'all' || searchFilterType === 'albums') && (
          <SearchAlbumList
            query={searchQuery}
            filter={searchFilterType}
            triggerViewAlbum={triggerViewAlbum}
            setActiveAlbum={setActiveAlbum}
          />
        )}
      </div>
    </div>
  )
}

export default SearchPanel;