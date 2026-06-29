import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Playlist, PlaylistDTO, PlaylistMeta, PlaylistSong, PlaylistSongDTO } from "../playlist.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import type { Song, SongCover } from "../../song/song.types";
import playlistService from "../services/playlist.service";
import songService from "../../song/services/song.service";
import { fileToDataURL } from "../../../shared/utils/fileToDataURL";
import { routes } from "../../../shared/utils/routes";
import { getTimeParts } from "../../../shared/utils/formatTime";
import useAuth from "../../auth/hooks/useAuth";

const usePlaylist = () => {
  const [currentCover, setCurrentCover] = useState<string | null>(null);
  const [gradientColor, setGradientColor] = useState('#121212');
  const [bgColor, setBgColor] = useState('#3a3a3a');
  const [isPublic, setIsPublic] = useState(false);
  const [form, setForm] = useState<PlaylistDTO>({
    name: '',
    description: '',
    cover: '',
    isPublic,
    gradientColor,
    bgColor,
    userId: '',
    file: null
  });

  const [coverImages, setCoverImages] = useState<SongCover[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [playlistItems, setPlaylistItems] = useState<PlaylistSong[]>([]);
  const [playlistMeta, setPlaylistMeta] = useState<PlaylistMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false,
    playlistId: ''
  });

  const [isBackground, setIsBackground] = useState(false);
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [query, setQuery] = useState('');
  const [isSearch, setIsSearch] = useState(true);
  const [searchSongs, setSearchSongs] = useState<Song[]>([]);
  const [searchMeta, setSearchMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [activeItem, setActiveItem] = useState<PlaylistSong | null>(null);

  const { user } = useAuth();
  const duration = getTimeParts(playlistMeta.totalDuration ?? 0);
  const navigate = useNavigate();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    file && fileToDataURL(file).then((url) => {
      setForm({ ...form, file, cover: url });
    });
  }

  const onSetForm = (data: Playlist) => {
    setForm({
      ...form,
      ...data,
      description: data.description || '',
      cover: data.cover || ''
    });

    setBgColor(data.bgColor);
    setGradientColor(data.gradientColor);
    setIsPublic(data.isPublic);
    setCurrentCover(data.cover);
  }

  const getUserPlaylists = async () => {
    const userId = user?.id;
    if (!userId) return [];

    const { data } = await playlistService.getUserPlaylists(userId);

    if (data) {
      setPlaylists(data);
    }
  }

  const getPlaylist = async (playlistId: string) => {
    if (!playlistId) return;

    const r = await playlistService.getPlaylist(playlistId);

    if (r.status === 404) {
      navigate(routes.home);
      return;
    }

    if (r.data) {
      onSetForm(r.data);
    }
  }

  const updatePlaylist = async (playlistId: string, values: PlaylistDTO) => {
    const r = await playlistService.updatePlaylist(playlistId, {
      ...values,
      name: values.name.trim(),
      description: values.description.trim()
    });

    if (r.status === 200 && r.data) {
      onSetForm(r.data);
      setIsEdit(false);
    }

    return r.data;
  }

  const onSavePlaylist = async (playlistId: string | null, values: PlaylistDTO = form, isNew = false) => {
    if (!playlistId) return null;

    if (!isNew) {
      return await updatePlaylist(playlistId, values);
    }

    const r = await playlistService.newPlaylist({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      userId: user?.id!
    });

    return r.data;
  }

  const onChangeVisibility = async (playlistId: string) => {
    if (!playlistId) return null;

    return await updatePlaylist(playlistId, {
      ...form, isPublic: !isPublic
    });
  }

  const onRemovePlaylist = async (playlistId: string) => {
    if (!playlistId) return;
    const { data } = await playlistService.removePlaylist(playlistId);

    if (data?.id) {
      navigate(routes.home);
    }
  }

  const getPlaylistSongs = async (playlistId: string, filters?: Record<string, any>) => {
    if (!playlistId) return;

    const { data } = await playlistService.getPlaylistSongs(playlistId, filters);
    if (!data) return;

    setIsSearch(data.items.length === 0);

    setPlaylistMeta({
      ...data.meta,
      totalDuration: data.totalDuration || 0
    });

    if (filters?.page > 1) {
      setPlaylistItems((prev) => [...prev, ...data.items]);
      setPlaylistSongs((prev) => [...prev, ...data.songs]);
      return;
    }

    setPlaylistItems(data.items);
    setPlaylistSongs(data.songs);
  }

  const getPlaylistCover = () => {
    const images: SongCover[] = [];

    for (const song of playlistSongs) {
      if (song.cover) {
        const coverUrl = songService.songCoverUrl(song.id, song.cover);
        images.push({ id: song.id, url: coverUrl });
      }

      if (images.length === 4) {
        break;
      }
    }

    setCoverImages(images);
  }

  const findSongs = async () => {
    const { data } = await songService.searchSongs({
      title: query
    });

    if (data) {
      setSearchMeta({ ...data.meta, totalPages: 1 })
      setSearchSongs(data.items);
    }
  }

  const addSongToPlaylist = async (dto: PlaylistSongDTO) => {
    if (!dto.playlistId) return;

    const { data } = await playlistService.addSongToPlaylist(dto);

    if (data && data.id) {
      setPlaylistItems((prev) => [...prev, data]);
      setPlaylistSongs((prev) => [...prev, data.song!]);
    }

    return data;
  }

  const removeSongFromPlaylist = async (id: string) => {
    if (!id) return false;
    const { data } = await playlistService.removeSongFromPlaylist(id);
    if (data) {
      setPlaylistItems((prev) => prev.filter((p) => p.id !== id));
      setPlaylistSongs((prev) => prev.filter((p) => p.id !== id));
      return true;
    }
    return false;
  }

  return {
    isPlay: playlistSongs.length > 0,
    playlistMeta, duration,
    playlistSongs, setPlaylistSongs,
    playlistItems, setPlaylistItems,
    playlists, setPlaylists,
    currentCover, setCurrentCover,
    gradientColor, setGradientColor,
    bgColor, setBgColor,
    isPublic, setIsPublic,
    form, setForm,
    isBackground, setIsBackground,
    isRemove, setIsRemove,
    isHover, setIsHover,
    isOpen, setIsOpen,
    isEdit, setIsEdit,
    isOpenAction, setIsOpenAction,
    query, setQuery,
    isSearch, setIsSearch,
    searchSongs, setSearchSongs,
    searchMeta, setSearchMeta,
    activeItem, setActiveItem,
    coverImages, setCoverImages,
    onFileChange,
    getPlaylistCover,
    getUserPlaylists,
    getPlaylist,
    onSavePlaylist,
    onChangeVisibility,
    onRemovePlaylist,
    getPlaylistSongs,
    findSongs,
    addSongToPlaylist,
    removeSongFromPlaylist
  }
}

export default usePlaylist;