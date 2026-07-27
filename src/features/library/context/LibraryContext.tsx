import { useState, createContext, type ReactElement } from "react";
import { type Library, type LibraryStatus } from "../../../features/library/library.types";
import type { Playlist } from "../../playlist/playlist.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import { libraryState } from "../data/library.state";
import { paginationMeta } from "../../../shared/data/search.data";

interface LibraryCtx {
  library: Library;
  libraryStatus: LibraryStatus;
  playlists: Playlist[];
  playlistMeta: SearchMeta;
  activePlaylistIndex: number | null;
  setLibrary: React.Dispatch<React.SetStateAction<Library>>;
  setLibraryStatus: React.Dispatch<React.SetStateAction<LibraryStatus>>;
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  setPlaylistMeta: React.Dispatch<React.SetStateAction<SearchMeta>>;
  setActivePlaylistIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const LibraryContext = createContext<LibraryCtx>({
  library: libraryState,
  libraryStatus: {
    collapsed: false,
    expanded: false
  },
  playlists: [],
  playlistMeta: paginationMeta,
  activePlaylistIndex: null,
  setLibrary: () => { },
  setLibraryStatus: () => { },
  setPlaylists: () => { },
  setPlaylistMeta: () => { },
  setActivePlaylistIndex: () => { }
});

export const LibraryProvider = ({ children }: { children: ReactElement }) => {
  const [library, setLibrary] = useState<Library>(libraryState);
  const [libraryStatus, setLibraryStatus] = useState<LibraryStatus>({
    collapsed: false,
    expanded: false
  });

  const [activePlaylistIndex, setActivePlaylistIndex] = useState<number | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistMeta, setPlaylistMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  return (
    <LibraryContext.Provider value={{
      library, setLibrary,
      libraryStatus, setLibraryStatus,
      playlists, setPlaylists,
      playlistMeta, setPlaylistMeta,
      activePlaylistIndex, setActivePlaylistIndex
    }}
    >
      {children}
    </LibraryContext.Provider>
  )
}