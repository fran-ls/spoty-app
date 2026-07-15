import { useState } from "react";
import type { CustomMenuOrderItem } from "../components/CustomMenu";
import { PlaylistLayout, PlaylistOrderBy, PlaylistOrderK, type UserLibrary, type UserLibraryDTO, type UserLibraryInclude } from "../library.types";
import libraryService from "../services/library.service";
import { OrderKind } from "../../../shared/types/common.types";
import { PLAYLIST_SORT_LABEL } from "../data/library.data";
import type { Playlist, PlaylistFilters, PlaylistInclude } from "../../playlist/playlist.types";

const useUserLibrary = () => {
  const [layout, setLayout] = useState<PlaylistLayout>(PlaylistLayout.LIST);
  const [orderBy, setOrderBy] = useState<CustomMenuOrderItem>({
    label: PLAYLIST_SORT_LABEL.RECENT,
    value: PlaylistOrderBy.RECENT,
    k: PlaylistOrderK.RECENT
  });

  const [library, setLibrary] = useState<UserLibrary>({
    id: '',
    isExpanded: false,
    isCollapsed: false,
    playlistLayout: PlaylistLayout.LIST,
    playlistOrderBy: PlaylistOrderBy.RECENT,
    playlistOrder: OrderKind.DESC,
    publicPlaylistCount: 0,
    privatePlaylistCount: 0,
    userId: '',
    createdAt: null
  });

  const [systemPlaylists, setSystemPlaylists] = useState<Playlist[]>([]);

  const getSystemPlaylists = async (
    filters?: PlaylistFilters,
    include?: PlaylistInclude
  ) => {
    const { data } = await libraryService.getSystemPlaylists(filters, include);
    if (data) setSystemPlaylists(data);
    return data;
  }

  async function getUserLibrary(userId: string, include?: UserLibraryInclude) {
    if (!userId) return null;

    const { error, data: lib } = await libraryService.getUserLibrary(userId, include);
    if (error || !lib) return lib;

    setLayout(lib.playlistLayout);
    setOrderBy({
      label: PLAYLIST_SORT_LABEL[lib.playlistOrderBy],
      value: lib.playlistOrderBy,
      k: PlaylistOrderK[lib.playlistOrderBy]
    });
    setLibrary(lib);
    return lib;
  }

  async function updateUserLibrary(userId: string, values: Partial<UserLibraryDTO>, include?: UserLibraryInclude) {
    const { data } = await libraryService.updateUserLibrary(userId, values, include);
    if (data) setLibrary(data);
    return data;
  }

  async function onLayoutChange(libraryId: string, layout: PlaylistLayout) {
    setLayout(layout);
    setLibrary({
      ...library,
      playlistLayout: layout
    });

    if (libraryId) {
      await updateUserLibrary(libraryId, { playlistLayout: layout });
    }
  }

  async function onSortBy(libraryId: string, option: CustomMenuOrderItem, order: OrderKind) {
    setOrderBy(option);
    setLibrary({
      ...library,
      playlistOrderBy: option.value,
      playlistOrder: order
    });

    if (libraryId) {
      await updateUserLibrary(libraryId, {
        playlistOrderBy: option.value,
        playlistOrder: order
      });
    }
  }

  async function onSizeChange(
    libraryId: string,
    isCollapsed: boolean,
    isExpanded: boolean
  ) {
    if (libraryId) await updateUserLibrary(libraryId, {
      isCollapsed,
      isExpanded
    });
  }

  return {
    systemPlaylists, setSystemPlaylists,
    library, setLibrary,
    layout, setLayout,
    orderBy, setOrderBy,
    getUserLibrary,
    updateUserLibrary,
    onLayoutChange,
    onSortBy,
    onSizeChange,
    getSystemPlaylists
  }
}

export default useUserLibrary;