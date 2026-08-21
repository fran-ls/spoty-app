import type { PaginationMeta, PaginationQuery } from "../../shared/types/common.types";
import type { User } from "../auth/auth.types";
import type { Playlist, PlaylistCover } from "../playlist/playlist.types";
import type { Song } from "../song/song.types";

export interface PlayHistory {
  id: string;
  userId: string;
  songId: string | null;
  playlistId: string | null;
  createdAt: Date;
  playedAt: Date;

  user?: User;
  song?: Song;
  playlist?: Playlist;
}

export interface PlayHistoryDTO {
  userId?: string;
  songId?: string;
  playlistId?: string;
}


export interface PlayHistoryAddPayload {
  song?: Song;
  playlist?: Playlist;
  playlistTimout?: number;
}


export type HistoryPlaylist = Omit<PlayHistory, 'songId' | 'song'> & {
  playlist: Playlist & { coverImages: PlaylistCover[] }
}

export type HistorySong = Omit<PlayHistory, 'playlistId'>;

export type PlayHistoryFilters = Partial<PlayHistory> & PaginationQuery;


export type THistoryRes = {
  items: THistory;
  meta: PaginationMeta;
}

export type THistory = Record<string, THistoryItem>;

export type THistoryItem = {
  date: string;
  createdAt: any;
  items: PlayHistory[];
}