import type { IncludeArgs } from "../../shared/types/common.types";
import type { User } from "../auth/auth.types";
import type { Playlist } from "../playlist/playlist.types";
import type { Song } from "../song/song.types";

export interface Player {
  id: string;
  shuffle: boolean;
  repeat: boolean;
  timesRepeat: number;
  progress: number;
  volume: number;
  playedAt: any;
  createdAt: any;
  userId: string;
  songId?: string | null;
  playlistId?: string | null;
  user?: User | null;
  song?: Song | null;
  playlist?: Playlist | null;
}

export interface PlayerDTO {
  shuffle?: boolean;
  repeat?: boolean;
  timesRepeat?: number;
  progress?: number;
  volume?: number;
  songId?: string | null;
  userId: string;
}


export type PlayerInclude = Record<string, IncludeArgs>;