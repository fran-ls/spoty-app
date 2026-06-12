import { Route, Routes } from "react-router-dom";
import AppLayout from "../shared/components/layout/AppLayout";
import HomePage from "../features/home/HomePage";
import SearchPage from "../features/search/SearchPage";
import LibraryPage from "../features/library/LibraryPage";
import PlaylistPage from "../features/playlist/pages/PlaylistPage";
import NewPlaylistPage from "../features/playlist/pages/NewPlaylistPage";
import { routes } from "../shared/utils/routes";

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path={routes.search} element={<SearchPage />} />
        <Route path={routes.library} element={<LibraryPage />} />
        <Route path={routes.playlists} element={<PlaylistPage />} />
        <Route path={`${routes.playlists}/:playlistId`} element={<NewPlaylistPage />} />
        <Route path={routes.songs} element={<PlaylistPage />} />
      </Routes>
    </AppLayout>
  )
}

export default AppRoutes;