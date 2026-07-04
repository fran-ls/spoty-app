import type { PaginationMeta, PaginationQuery } from "../../shared/types/common.types";
import type { User } from "../auth/auth.types";
import type { Song, SongCover } from "../song/song.types";

export type PlaylistLayout = 'compact-list' | 'list' | 'grid';
export type PlaylistOrder = 'recent' | 'name';
export type PlaylistVisibility = 'private' | 'public';

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  bgColor: string;
  gradientColor: string;
  isPublic: boolean;
  userId: string;
  createdAt: any;
  user?: User | null;
  trackCount?: number;
}

export interface PlaylistDTO {
  name: string;
  description: string;
  cover: string;
  bgColor: string;
  gradientColor: string;
  isPublic: boolean;
  userId: string;
  file: File | null;
  fileUrl?: string;
}

export interface PlaylistSong {
  id: string;
  songId: string;
  playlistId: string;
  position: number;
  song?: Song | null;
}

export interface PlaylistSongDTO {
  playlistId: string;
  songId: string;
  include?: Record<string, any>;
}

export type PlaylistMeta = PaginationMeta & {
  playlistId: string;
  totalDuration: number;
}

export interface PlaylistResponse {
  items: PlaylistSong[];
  meta: PlaylistMeta;
  songs: Song[];
  totalDuration: number;
}

export type PlaylistFormState = PlaylistDTO & {
  coverImages: SongCover[];
}

export type PlaylistFormAction = 'set-state' | 'select-file' | 'save';

export type PlaylistFilters = Partial<Playlist> & PaginationQuery;

export interface PlaylistInclude {
  user?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
  songs?: boolean;
}

export interface PlaylistInclude {
  user?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
  songs?: boolean;
}

export interface PlaylistSongInclude {
  playlist?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
  song?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
}
