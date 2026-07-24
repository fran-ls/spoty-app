import { OrderKind } from "../../../shared/types/common.types";
import { PlaylistLayout, PlaylistOrderBy } from "../library.types";

export const libraryState = {
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
} as const