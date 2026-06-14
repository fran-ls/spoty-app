import { Route, Routes } from "react-router-dom";
import AppLayout from "../shared/components/layout/AppLayout";
import HomePage from "../features/home/HomePage";
import SearchPage from "../features/search/SearchPage";
import LibraryPage from "../features/library/LibraryPage";
import PlaylistPage from "../features/playlist/pages/PlaylistPage";
import SongPage from "../features/song/pages/SongPage";
import { routes } from "../shared/utils/routes";

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path={routes.search} element={<SearchPage />} />
        <Route path={routes.library} element={<LibraryPage />} />
        <Route path={routes.playlists} element={<PlaylistPage />} />
        <Route path={`${routes.playlists}/:playlistId`} element={<PlaylistPage />} />
        <Route path={routes.songs} element={<SongPage />} />
      </Routes>
    </AppLayout>
  )
}

export default AppRoutes;