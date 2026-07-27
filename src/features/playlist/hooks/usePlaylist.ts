import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Playlist, PlaylistDTO, PlaylistInclude, PlaylistSong, PlaylistSongDTO, PlaylistSongInclude } from "../playlist.types";
import type { PaginationMeta } from "../../../shared/types/common.types";
import type { Song, SongCover, TrackFilters, TrackInclude } from "../../song/song.types";
import playlistService from "../services/playlist.service";
import songService from "../../song/services/song.service";
import { routes } from "../../../shared/utils/routes";
import useAuth from "../../auth/hooks/useAuth";
import { getTimeParts } from "../../../shared/utils/formatTime";
import { paginationMeta } from "../../../shared/data/search.data";
import useLibrary from "../../library/hooks/useLibrary";

const usePlaylist = () => {
  const { setPlaylists: setLibPlaylists } = useLibrary();

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
    file: null,
    fileUrl: ''
  });

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [coverImages, setCoverImages] = useState<SongCover[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [playlistItems, setPlaylistItems] = useState<PlaylistSong[]>([]);
  const [loadingPlaylistSongs, setLoadingPlaylistSongs] = useState(false);
  const [playlistMeta, setPlaylistMeta] = useState<PaginationMeta>(paginationMeta);

  const [isPlaylistMenu, setIsPlaylistMenu] = useState(false);
  const [isBackground, setIsBackground] = useState(false);
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [isCoverHover, setIsCoverHover] = useState(false);
  const [isLayoutMenu, setIsLayoutMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [isSongSearch, setIsSongSearch] = useState(true);
  const [searchSongs, setSearchSongs] = useState<Song[]>([]);
  const [searchMeta, setSearchMeta] = useState<PaginationMeta>(paginationMeta);

  const [trackMeta, setTrackMeta] = useState({
    trackCountText: '',
    duration: ''
  });

  const [activeItem, setActiveItem] = useState<PlaylistSong | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const getTrackMeta = (playlist: Playlist) => {
    const time = getTimeParts(playlist?.duration || 0);
    const manyTracks = playlist.trackCount === 0 || playlist.trackCount > 1;
    const duration = time.hours > 0 ? `${time.hours} h ${time.min > 0 ? `${time.min} min` : ''}` : `${time.min > 0 ? `${time.min} min` : ''} ${time.secs > 0 ? `${time.secs} s` : ''}`.trim();

    const meta = {
      duration,
      manyTracks,
      trackCountText: `${manyTracks ? 'canciones' : 'canción'}${playlist?.trackCount ? ',' : ''}`
    }
    setTrackMeta(meta);
    return meta;
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fileUrl = form.fileUrl;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (file) setForm({
      ...form, file,
      fileUrl: URL.createObjectURL(file)
    });
  }

  const onSetForm = (data: Playlist) => {
    setForm({
      ...form,
      ...data,
      description: data.description || '',
      cover: data.cover!
    });

    setBgColor(data.bgColor);
    setGradientColor(data.gradientColor);
    setIsPublic(data.isPublic);
  }

  const getPlaylist = async (playlistId: string, include?: PlaylistInclude) => {
    if (!playlistId) return null;

    const r = await playlistService.getPlaylist(playlistId, include);

    if (r.status === 404) {
      navigate(routes.home);
      return r.data;
    }

    if (!r.data) return r.data;

    setPlaylist(r.data);
    getTrackMeta(r.data);
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
      userId: user?.id!,
      gradientColor,
      bgColor
    });
  }

  const onChangeVisibility = async (playlistId: string) => {
    if (!playlistId) return null;

    return await updatePlaylist(playlistId, {
      ...form, isPublic: !isPublic
    });
  }

  const getPlaylistTracks = async (playlistId: string, filters?: Record<string, any>) => {
    if (loadingPlaylistSongs) return;
    if (!playlistId) return null;

    setLoadingPlaylistSongs(true);
    const { data } = await playlistService.getPlaylistSongs(playlistId, filters);
    setLoadingPlaylistSongs(false);
    if (!data) return data;

    setIsSongSearch(data.items.length === 0);
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

  const getPlaylistCover = () => {
    const images: SongCover[] = [];

    for (const song of playlistSongs) {
      if (song?.cover) {
        const coverUrl = songService.songCoverUrl(song.id, song.cover);
        images.push({ id: song.id, url: coverUrl });
      }

      if (images.length === 4) {
        break;
      }
    }

    setCoverImages(images);
    return images;
  }

  const searchTracks = async (filters?: TrackFilters | undefined, include?: TrackInclude) => {
    const { data } = await songService.searchSongs({
      title: songSearchQuery,
      ...filters
    }, include);

    if (data) {
      setSearchMeta(data.meta);
      setSearchSongs(data.items);
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

    getTrackMeta({
      ...playlist,
      trackCount: newTrackCount,
      duration: newDuration
    });

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

    getTrackMeta({
      ...playlist,
      trackCount: newTrackCount,
      duration: newDuration
    });

    setPlaylist({
      ...playlist,
      trackCount: newTrackCount,
      duration: newDuration
    });

    return true;
  }

  return {
    isPlay: playlistSongs.length > 0,
    trackMeta, setTrackMeta,
    playlist, setPlaylist,
    playlistMeta, setPlaylistMeta,
    playlistSongs, setPlaylistSongs,
    playlistItems, setPlaylistItems,
    playlists, setPlaylists,
    gradientColor, setGradientColor,
    bgColor, setBgColor,
    isPublic, setIsPublic,
    form, setForm,
    isBackground, setIsBackground,
    isRemove, setIsRemove,
    isCoverHover, setIsCoverHover,
    isLayoutMenu, setIsLayoutMenu,
    isEdit, setIsEdit,
    isOpenAction, setIsOpenAction,
    songSearchQuery, setSongSearchQuery,
    isSongSearch, setIsSongSearch,
    searchSongs, setSearchSongs,
    searchMeta, setSearchMeta,
    activeItem, setActiveItem,
    coverImages, setCoverImages,
    isPlaylistMenu, setIsPlaylistMenu,
    loadingPlaylistSongs, setLoadingPlaylistSongs,
    onFileChange,
    getPlaylistCover,
    getPlaylist,
    updatePlaylist,
    newPlaylist,
    onChangeVisibility,
    getPlaylistTracks,
    searchTracks,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getTrackMeta
  }
}

export default usePlaylist;