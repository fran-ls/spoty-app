import { useState } from "react";
import { SearchIcon } from "lucide-react";
import type { Artist } from "../artist/artist.types";
import type { Album } from "../artist/album.types";
import type { Playlist } from "../playlist/playlist.types";
import SearchPlaylistList from "../playlist/components/SearchPlaylistList";
import SearchTrackList from "../song/components/SearchTrackList";
import SearchAlbumList from "../artist/components/SearchAlbumList";
import SearchArtistList from "../artist/components/SearchArtistList";

export type FilterKind = 'all' | 'artists' | 'albums' | 'tracks' | 'playlists';

interface SearchPanelProps {
  triggerViewArtist: (artist: Artist) => void;
  triggerViewAlbum: (album: Album) => void;
  triggerViewPlaylist: (playlist: Playlist) => void;
  setActiveAlbum: React.Dispatch<React.SetStateAction<Album | null>>;
}

const SearchPanel = (props: SearchPanelProps) => {
  const { setActiveAlbum, triggerViewArtist, triggerViewAlbum, triggerViewPlaylist } = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterType, setSearchFilterType] = useState<FilterKind>('all');

  return (
    <div className="p-5 space-y-5 animate-fade-in">
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
        {(['all', 'tracks', 'artists', 'playlists', 'albums'] as const).map(f => (
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
            triggerViewTrack={() => { }}
          />
        )}

        {(searchFilterType === 'all' || searchFilterType === 'playlists') && (
          <SearchPlaylistList
            query={searchQuery}
            filter={searchFilterType}
            triggerViewPlaylist={triggerViewPlaylist}
          />
        )}

        {(searchFilterType === 'all' || searchFilterType === 'artists') && (
          <SearchArtistList
            query={searchQuery}
            filter={searchFilterType}
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