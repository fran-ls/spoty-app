import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../shared/layout/AppLayout";
import HomePage from "../features/home/pages/HomePage";
// import SearchPage from "../features/search/SearchPage";
import LibraryPage from "../features/library/pages/LibraryPage";
import PlaylistPage from "../features/playlist/pages/PlaylistPage";
import SongPage from "../features/song/pages/SongPage";
import { routes } from "../shared/utils/routes";
import SearchPlaylistPage from "../features/playlist/pages/SearchPlaylistPage";
import YTDropHomePage from "../yt_drop/pages/HomePage";
import DownloadPage from "../yt_drop/pages/DownloadPage";
import DownloadStatPage from "../yt_drop/pages/DownloadStatPage";

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={routes.search} element={<SearchPlaylistPage />} />
        <Route path={routes.library} element={<LibraryPage />} />
        <Route path={routes.playlists} element={<PlaylistPage />} />
        <Route path={`${routes.playlists}/:playlistId`} element={<PlaylistPage />} />
        <Route path={routes.songs} element={<SongPage />} />
        <Route path="/*" element={<Navigate to={routes.home} />} />

        <Route path={routes.YTDrop.download} element={<YTDropHomePage />} />
        <Route path={routes.YTDrop.history} element={<DownloadPage />} />
        <Route path={routes.YTDrop.historyStats} element={<DownloadStatPage />} />
      </Routes>
    </AppLayout>
  )
}

export default AppRoutes;