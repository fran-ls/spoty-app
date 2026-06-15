import type { PaginationMeta } from "../../shared/types/common.types";
import type { Song } from "../song/song.types";

export interface Playlist {
  id: string;
  name: string;
  description: null;
  cover: string | null;
  bgColor: string;
  gradientColor: string;
  isPublic: boolean;
  userId: string;
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
}

export interface PlaylistSong {
  id: string;
  songId: number;
  playlistId: string;
  position: number;
  song: Song | null;
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