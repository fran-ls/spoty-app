import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../shared/layout/AppLayout";
import HomePage from "../features/home/HomePage";
// import SearchPage from "../features/search/SearchPage";
import LibraryPage from "../features/library/LibraryPage";
import PlaylistPage from "../features/playlist/pages/PlaylistPage";
import SongPage from "../features/song/pages/SongPage";
import { routes } from "../shared/utils/routes";
import SearchPlaylists from "../features/playlist/pages/SearchPlaylists";
import UploadPage from "../features/home/UploadPage";

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={routes.search} element={<SearchPlaylists />} />
        <Route path={routes.library} element={<LibraryPage />} />
        <Route path={routes.playlists} element={<PlaylistPage />} />
        <Route path={`${routes.playlists}/:playlistId`} element={<PlaylistPage />} />
        <Route path={routes.songs} element={<SongPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/*" element={<Navigate to={routes.home} />} />
      </Routes>
    </AppLayout>
  )
}

export default AppRoutes;