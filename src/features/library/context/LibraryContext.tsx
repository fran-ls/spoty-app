import { useState, createContext, type ReactElement } from "react";
import { type Library, type LibraryStatus } from "../../../features/library/library.types";
import type { Playlist } from "../../playlist/playlist.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import { libraryState } from "../data/library.state";

interface LibraryCtx {
  library: Library;
  libraryStatus: LibraryStatus;
  playlists: Playlist[];
  playlistMeta: SearchMeta;
  setLibrary: React.Dispatch<React.SetStateAction<Library>>;
  setLibraryStatus: React.Dispatch<React.SetStateAction<LibraryStatus>>;
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  setPlaylistMeta: React.Dispatch<React.SetStateAction<SearchMeta>>;
}

export const LibraryContext = createContext<LibraryCtx>({
  library: structuredClone(libraryState),
  libraryStatus: {
    collapsed: false,
    expanded: false
  },
  playlists: [],
  playlistMeta: {
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  setLibrary: () => { },
  setLibraryStatus: () => { },
  setPlaylists: () => { },
  setPlaylistMeta: () => { }
});

export const LibraryProvider = ({ children }: { children: ReactElement }) => {
  const [library, setLibrary] = useState<Library>(structuredClone(libraryState));
  const [libraryStatus, setLibraryStatus] = useState<LibraryStatus>({
    collapsed: false,
    expanded: false
  });

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
      playlistMeta, setPlaylistMeta
    }}
    >
      {children}
    </LibraryContext.Provider>
  )
}