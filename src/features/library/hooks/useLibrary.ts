import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CustomMenuOrderItem } from "../components/CustomMenu";
import type { Playlist, PlaylistFilters, PlaylistInclude } from "../../playlist/playlist.types";
import { PlaylistLayout, PlaylistOrderBy, PlaylistOrderK, type LibraryDTO, type LibraryInclude, type LibraryStatus } from "../library.types";
import libraryService from "../services/library.service";
import { OrderKind } from "../../../shared/types/common.types";
import { PLAYLIST_SORT_LABEL } from "../data/library.data";
import playlistService from "../../playlist/services/playlist.service";
import { routes } from "../../../shared/utils/routes";
import useAuth from "../../auth/hooks/useAuth";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import { LibraryContext } from "../context/LibraryContext";

const useLibrary = () => {
  const { user, isAdmin } = useAuth();

  const ctx = useContext(LibraryContext);
  const {
    library, setLibrary,
    libraryStatus, setLibraryStatus,
    playlists, setPlaylists,
    playlistMeta, setPlaylistMeta
  } = ctx;

  const [playlistVerticalScroll, setPlaylistVerticalScroll] = useState(false);
  const [playlistScrollTop, setPlaylistScrollTop] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [systemPlaylists, setSystemPlaylists] = useState<Playlist[]>([]);
  const [layout, setLayout] = useState<PlaylistLayout>(PlaylistLayout.LIST);
  const [orderBy, setOrderBy] = useState<CustomMenuOrderItem>({
    label: PLAYLIST_SORT_LABEL.RECENT,
    value: PlaylistOrderBy.RECENT,
    k: PlaylistOrderK.RECENT
  });

  const navigate = useNavigate();

  async function getLibrary(userId: string, include?: LibraryInclude) {
    if (!userId) return null;

    const { error, data: lib } = await libraryService.getLibrary(userId, include);
    if (error || !lib) return lib;

    const orderBy = lib.playlistOrderBy;
    setLibrary(lib);
    setLayout(lib.playlistLayout);
    setOrderBy({
      label: PLAYLIST_SORT_LABEL[orderBy],
      value: orderBy,
      k: PlaylistOrderK[orderBy]
    });

    return lib;
  }

  async function updateLibrary(
    id: string,
    values: Partial<LibraryDTO>,
    include?: LibraryInclude
  ) {
    if (!id) return null;
    const { data } = await libraryService.updateLibrary(id, values, include);
    if (data) setLibrary(data);
    return data;
  }

  async function getUserPlaylists(
    userId: string,
    filters?: PlaylistFilters,
    include?: PlaylistInclude
  ) {
    if (!userId) return null;

    const { data } = await libraryService.getUserPlaylists(filters, include);
    if (!data) return null;

    setPlaylistMeta({
      ...playlistMeta,
      ...data.meta,
      totalDuration: 0
    });

    (filters?.page && filters?.page > 1)
      ? setPlaylists((prev) => [...prev, ...data.items])
      : setPlaylists(data.items);

    return data;
  }

  async function getSystemPlaylists(
    filters?: PlaylistFilters,
    include?: PlaylistInclude
  ) {
    const { data } = await libraryService.getSystemPlaylists(filters, include);
    if (data) setSystemPlaylists(data);
    return data;
  }

  async function getPlaylists(
    filters?: Record<string, any> | undefined,
    include?: PlaylistInclude
  ) {
    const userId = user?.id;
    if (!user || !userId) return;

    setIsLoading(true);

    await Promise.all([
      await getUserPlaylists(
        userId,
        filters,
        include || undefined
      ),
      ...(isAdmin ? [await getSystemPlaylists(filters)] : [])
    ])

    setIsLoading(false);
  }

  async function newPlaylist() {
    if (!user?.id) return null;

    const { data } = await playlistService.newPlaylist({
      name: '',
      description: '',
      cover: '',
      isPublic: false,
      gradientColor: '',
      bgColor: '',
      userId: user?.id,
      file: null
    });

    if (!data || !data.id) return data;

    setLibraryStatus({
      ...libraryStatus,
      expanded: false
    });

    const sortedPlaylists = sortPlaylists([...playlists, data]);
    setPlaylists(sortedPlaylists);
    navigate(`${routes.playlists}/${data.id}`);

    return data;
  }

  const sortPlaylists = (playlists: Playlist[]) => {
    return [...playlists].sort((a, b) => {
      const isRecent = orderBy.k === PlaylistOrderK.RECENT;

      if (isRecent) {
        const date1 = Number(getFmtDate(a.createdAt, 'T'))
        const date2 = Number(getFmtDate(b.createdAt, 'T'))
        return isRecent ? date2 - date1 : 1;
      }

      const f = PlaylistOrderK.NAME;
      return a[f] > b[f] ? 1 : -1;
    });
  }

  async function removePlaylist(playlistId: string) {
    if (!playlistId) return false;

    const { data } = await playlistService.removePlaylist(playlistId);
    if (!data || !data.id) return false;

    setPlaylists(playlists.filter((p) => p.id !== playlistId));
    navigate(routes.home);
    return true;
  }

  async function onLayoutChange(libraryId: string, layout: PlaylistLayout) {
    setLayout(layout);
    setLibrary({
      ...library,
      playlistLayout: layout
    });

    if (libraryId) {
      await updateLibrary(libraryId, { playlistLayout: layout });
    }
  }

  async function onSortBy(
    libraryId: string,
    option: CustomMenuOrderItem,
    order: OrderKind
  ) {
    setOrderBy(option);
    setLibrary({
      ...library,
      playlistOrderBy: option.value,
      playlistOrder: order
    });

    if (libraryId) {
      await updateLibrary(libraryId, {
        playlistOrderBy: option.value,
        playlistOrder: order
      });
    }
  }

  async function onSizeChange(libraryId: string, payload: Partial<LibraryStatus>) {
    setLibraryStatus({
      ...libraryStatus,
      ...payload
    });

    if (libraryId) await updateLibrary(libraryId, {
      isCollapsed: payload.collapsed,
      isExpanded: payload.expanded
    });
  }

  return {
    ...ctx,
    layout, setLayout,
    orderBy, setOrderBy,
    isLoading, setIsLoading,
    systemPlaylists, setSystemPlaylists,
    playlistVerticalScroll, setPlaylistVerticalScroll,
    playlistScrollTop, setPlaylistScrollTop,
    getLibrary, updateLibrary,
    getPlaylists, getSystemPlaylists,
    newPlaylist, removePlaylist,
    onLayoutChange, onSortBy,
    onSizeChange,
    sortPlaylists
  }
}

export default useLibrary;