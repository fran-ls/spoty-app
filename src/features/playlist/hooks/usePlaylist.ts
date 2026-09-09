import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Playlist, PlaylistDTO, PlaylistFilters, PlaylistInclude, PlaylistSong, PlaylistSongDTO, PlaylistSongInclude } from "../playlist.types";
import type { PaginationMeta } from "../../../shared/types/common.types";
import type { Song } from "../../song/song.types";
import playlistService from "../services/playlist.service";
import { routes } from "../../../shared/utils/routes";
import useAuth from "../../auth/hooks/useAuth";
import { paginationMeta } from "../../../shared/data/search.data";
import useLibrary from "../../library/hooks/useLibrary";
import libraryService from "../../library/services/library.service";

const usePlaylist = () => {
  const { setPlaylists: setLibPlaylists } = useLibrary();

  const [form, setForm] = useState<PlaylistDTO>({
    name: '',
    description: '',
    cover: '',
    isPublic: false,
    gradientColor: '#3a3a3a',
    bgColor: '#535353',
    userId: '',
    file: null,
    fileUrl: ''
  });

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [playlistItems, setPlaylistItems] = useState<PlaylistSong[]>([]);
  const [loadingPlaylistSongs, setLoadingPlaylistSongs] = useState(false);
  const [playlistMeta, setPlaylistMeta] = useState<PaginationMeta>(paginationMeta);

  const [isOpenAction, setIsOpenAction] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [activeItem, setActiveItem] = useState<PlaylistSong | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const onSetForm = (data: Playlist) => {
    setForm({
      ...form,
      ...data,
      description: data.description || '',
      cover: data.cover!
    });
  }

  const getPlaylist = async (playlistId: string, include?: PlaylistInclude) => {
    if (!playlistId) return null;

    const r = await libraryService.getPlaylist(playlistId, include);

    if (r.status === 404) {
      navigate(routes.home);
      return r.data;
    }

    if (!r.data) return r.data;

    setPlaylist(r.data);
    onSetForm(r.data);

    return r.data;
  }

  const updatePlaylist = async (playlistId: string, values: PlaylistDTO) => {
    if (!playlistId) return null;

    const { error, data, status } = await playlistService.updatePlaylist(playlistId, {
      ...values,
      name: values.name.trim(),
      description: values.description.trim()
    });

    if (error || status !== 200 || !data) {
      return data;
    }

    onSetForm(data);
    setIsEdit(false);
    setLibPlaylists((prev) => prev.map((p) => p.id === playlistId ? data : p));

    return data;
  }

  const newPlaylist = async (values: PlaylistDTO) => {
    return await playlistService.newPlaylist({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      userId: user?.id!
    });
  }

  const onChangeVisibility = async (playlistId: string) => {
    if (!playlistId) return null;

    return await updatePlaylist(playlistId, {
      ...form, isPublic: !form.isPublic
    });
  }

  const getPlaylistTracks = async (playlistId: string, filters?: Record<string, any>) => {
    if (loadingPlaylistSongs) return;
    if (!playlistId) return null;

    setLoadingPlaylistSongs(true);
    const { data } = await playlistService.getPlaylistSongs(playlistId, filters);
    setLoadingPlaylistSongs(false);
    if (!data) return data;

    setPlaylistMeta(data.meta);

    if (filters?.page > 1) {
      setPlaylistItems((prev) => [...prev, ...data.items]);
      setPlaylistSongs((prev) => [...prev, ...data.songs]);
    }
    else {
      setPlaylistItems(data.items);
      setPlaylistSongs(data.songs);
    }

    return data;
  }

  const addSongToPlaylist = async (dto: PlaylistSongDTO, include?: PlaylistSongInclude) => {
    const res = await playlistService.addSongToPlaylist(dto, include);
    const { error, data, status } = res;
    if (error || !data || status === 200) return res;

    setPlaylistItems((prev) => [...prev, data]);
    if (data.song) {
      setPlaylistSongs((prev) => [...prev, data.song!]);
    }
    setPlaylistMeta((prev) => ({ ...prev, total: prev.total + 1 }));

    if (!playlist) return res;
    const newDuration = data.song ? playlist.duration + data.song.duration : playlist.duration;
    const newTrackCount = playlist.trackCount + 1;

    setPlaylist({
      ...playlist,
      trackCount: newTrackCount,
      duration: newDuration
    });

    return res;
  }

  const removeSongFromPlaylist = async (id: string) => {
    if (!id) return false;
    const { error, data } = await playlistService.removeSongFromPlaylist(id);
    if (error || !data || !data.id) return false;

    setPlaylistItems((prev) => prev.filter((p) => p.id !== id));
    setPlaylistSongs((prev) => prev.filter((p) => p.id !== id));
    setPlaylistMeta((prev) => ({ ...prev, total: prev.total - 1 }));

    if (!playlist) return;
    const newDuration = data.song ? playlist.duration - data.song.duration : playlist.duration;
    const newTrackCount = playlist.trackCount - 1;

    setPlaylist({
      ...playlist,
      trackCount: newTrackCount,
      duration: newDuration
    });

    return true;
  }

  async function searchPlaylists(
    filters?: PlaylistFilters,
    include?: PlaylistInclude
  ) {
    const { data } = await playlistService.searchPlaylists(filters, include);
    if (!data) return data;

    (filters?.page && filters.page > 1)
      ? setPlaylists([...playlists, ...data.items])
      : setPlaylists(data.items);

    return data;
  }

  return {
    playlist, setPlaylist,
    playlistMeta, setPlaylistMeta,
    playlistSongs, setPlaylistSongs,
    playlistItems, setPlaylistItems,
    playlists, setPlaylists,
    form, setForm,
    isEdit, setIsEdit,
    isOpenAction, setIsOpenAction,
    activeItem, setActiveItem,
    loadingPlaylistSongs, setLoadingPlaylistSongs,
    searchPlaylists,
    getPlaylist,
    updatePlaylist,
    newPlaylist,
    onChangeVisibility,
    getPlaylistTracks,
    addSongToPlaylist,
    removeSongFromPlaylist
  }
}

export default usePlaylist;