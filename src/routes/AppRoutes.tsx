import { Route, Routes } from "react-router-dom";
import AppLayout from "../shared/components/layout/AppLayout";
import HomePage from "../features/home/HomePage";
import SearchPage from "../features/search/SearchPage";
import LibraryPage from "../features/library/LibraryPage";
import PlaylistPage from "../features/playlist/pages/PlaylistPage";
import NewPlaylistPage from "../features/playlist/pages/NewPlaylistPage";
import SongPage from "../features/song/SongPage";

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/playlists" element={<PlaylistPage />} />
        <Route path="/playlists/new" element={<NewPlaylistPage />} />
        <Route path="/songs" element={<SongPage />} />
      </Routes>
    </AppLayout>
  )
}

export default AppRoutes;