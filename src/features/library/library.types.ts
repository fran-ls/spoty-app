import type { IncludeArgs, OrderKind } from "../../shared/types/common.types";

export interface UserLibrary {
  id: string;
  isExpanded: boolean;
  isCollapsed: boolean;
  playlistLayout: PlaylistLayout;
  playlistOrderBy: PlaylistOrderBy;
  playlistOrder: OrderKind;
  publicPlaylistCount: number;
  privatePlaylistCount: number;
  userId: string;
  createdAt: any;
}

export interface UserLibraryDTO {
  isExpanded?: boolean;
  isCollapsed?: boolean;
  playlistLayout?: PlaylistLayout;
  playlistOrderBy?: PlaylistOrderBy;
  playlistOrder?: OrderKind;
  userId: string;
}


export type UserLibraryInclude = {
  user?: IncludeArgs;
}


export const PlaylistLayout = {
  LIST: 'LIST',
  GRID: 'GRID',
  COMPACT_LIST: 'COMPACT_LIST'
} as const

export type PlaylistLayout = (typeof PlaylistLayout)[keyof typeof PlaylistLayout]

export type PlaylistLayoutK = keyof typeof PlaylistLayout


export const PlaylistOrderBy = {
  RECENT: 'RECENT',
  NAME: 'NAME'
} as const

export type PlaylistOrderBy = (typeof PlaylistOrderBy)[keyof typeof PlaylistOrderBy]

export type PlaylistOrderByK = keyof typeof PlaylistOrderBy


export const PlaylistOrderK = {
  RECENT: 'createdAt',
  NAME: 'name'
} as const

export type PlaylistOrderK = (typeof PlaylistOrderK)[keyof typeof PlaylistOrderK]


export const PlaylistVisibility = {
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC'
} as const

export type PlaylistVisibility = (typeof PlaylistVisibility)[keyof typeof PlaylistVisibility]