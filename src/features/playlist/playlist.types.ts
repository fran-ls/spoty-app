import type { PaginationMeta } from "../../shared/types/common.types";
import type { User } from "../auth/auth.types";
import type { Song, SongCover } from "../song/song.types";

export interface Playlist {
  id: string;
  name: string;
  description: null;
  cover: string | null;
  bgColor: string;
  gradientColor: string;
  isPublic: boolean;
  userId: string;
  user?: User | null;
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

export interface PlaylistInclude {
  is_user?: boolean;
  is_tracks?: boolean;
}