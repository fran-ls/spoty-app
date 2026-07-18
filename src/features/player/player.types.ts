import type { IncludeArgs } from "../../shared/types/common.types";
import type { User } from "../auth/auth.types";
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
  user?: User;
  song?: Song;
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