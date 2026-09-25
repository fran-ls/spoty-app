import { useEffect, useState } from "react";
import type { Playlist, PlaylistFilters, PlaylistInclude } from "../../playlist/playlist.types";
import playlistService from "../../playlist/services/playlist.service";
import useAuth from "../../auth/hooks/useAuth";
import usePlayer from "../../player/hooks/usePlayer";
import libraryService from "../../library/services/library.service";
import Slider from "../../../shared/components/Slider";
import { routes } from "../../../shared/utils/routes";
import SliderSkeletons from "../../../shared/components/SliderSkeletons";

const UserPlaylistsSlider = () => {
  const { user } = useAuth();
  const { currentPlaylist, play, onPlaylistChange, togglePlay } = usePlayer();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  async function getPlaylists(
    userId: string,
    filters?: PlaylistFilters,
    include?: PlaylistInclude
  ) {
    if (!userId) return [];

    setLoading(true);
    const { data } = await libraryService.getUserPlaylists(filters, include);

    setLoading(false);
    if (!data) return [];

    (filters?.page && filters?.page > 1)
      ? setPlaylists((prev) => [...prev, ...data.items])
      : setPlaylists(data.items);

    return data;
  }

  async function getPlaylistSongs(playlist: Playlist) {
    if (currentPlaylist?.id === playlist.id) {
      togglePlay();
      return;
    }

    const { data } = await playlistService.getPlaylistSongs(playlist.id);
    if (!data || !data.songs.length) return;

    play(data.songs, 0, data.meta);
    onPlaylistChange(playlist);
  }

  useEffect(() => { user?.id && getPlaylists(user?.id) }, []);

  if (loading) return (
    <SliderSkeletons title="Tus listas" />
  )

  return (
    <Slider
      keys={{
        title: 'name'
      }}
      title="Tus listas"
      subtext={`De ${user?.username}`}
      items={playlists}
      linkToViewAll={routes.playlists}
      linkToRedirect={routes.playlists}
      isCurrentPlaying={(it) => currentPlaylist?.id === it.id}
      loadImage={(p) => {
        const cover = playlistService.playlistCover(p.id, p.cover);
        const img = p?.coverImages?.[0]?.url || '';
        return cover ? cover : p?.coverImages.length < 4 ? img : ''
      }}
      onPlay={(playlist) => getPlaylistSongs(playlist as any)}
    />
  )
}

export default UserPlaylistsSlider;