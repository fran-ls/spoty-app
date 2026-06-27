import type { Song } from "../song/song.types";
import type { Artist } from "./artist.types";

export interface Album {
  id: string;
  title: string;
  artistId: string;
  cover?: string;
  createdAt: Date;
  artist?: Artist;
  tracks?: Song[];
}

export interface AlbumDTO {
  title: string;
  artistId: string;
  cover: string | null;
  file?: File | null;
  artistName: string;
}

export interface AlbumFilters {
  id?: string;
  title?: string;
  artistId?: string;
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'title' | 'createdAt';
  include?: {
    artist?: boolean;
    songs?: boolean;
  }
}