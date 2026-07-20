import { OrderKind } from "../../../shared/types/common.types";
import { PlaylistLayout, PlaylistOrderBy } from "../library.types";

export const libraryState = {
  id: 'xxx',
  isExpanded: false,
  isCollapsed: false,
  playlistLayout: PlaylistLayout.LIST,
  playlistOrderBy: PlaylistOrderBy.RECENT,
  playlistOrder: OrderKind.DESC,
  publicPlaylistCount: 0,
  privatePlaylistCount: 0,
  userId: 'xx-puta',
  createdAt: null
} as const