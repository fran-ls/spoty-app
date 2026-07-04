import type { PaginationQuery } from "../../shared/types/common.types";
import type { Album } from "../artist/album.types";
import type { Artist } from "../artist/artist.types";

export interface Song {
  id: string;
  title: string;
  fileUrl: string;
  cover?: string | null;
  duration: number;
  artistId: string;
  albumId?: string | null;
  createdAt: Date;
  artist?: Artist | null;
  album?: Album | null;
}

export type SongCover = {
  id: string;
  url: string;
}

export interface SongFileUrls {
  audio: string;
  cover?: string;
}

export interface SongDTO {
  title: string;
  artistName: string;
  artistId?: string;
  cover?: string | null;
  fileUrl?: string | null;
  albumId?: string | null;
  albumName?: string;
  quality: string;
  audio: File | null;
  coverFile?: File | null;
  includeArtist?: boolean;
}




export interface Track {
  id: string;
  title: string;
  fileUrl: string;
  cover?: string | null;
  duration: number;
  artistId: string;
  albumId?: string | null;
  createdAt: Date;
  artist?: Artist | null;
  album?: Album | null;
}

export type TrackCover = {
  id: string;
  url: string;
}

export interface TrackFileUrls {
  audio: string;
  cover?: string;
}

export interface TrackDTO {
  title: string;
  artistName: string;
  artistId?: string;
  cover?: string | null;
  fileUrl?: string | null;
  albumId?: string | null;
  albumName?: string;
  quality: string;
  audio: File | null;
  coverFile?: File | null;
  include?: {
    artist?: boolean;
    album?: boolean;
  }
}

export type TrackFilters = Partial<Track> & PaginationQuery & {
  artistName?: string;
}

export interface TrackInclude {
  artist?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
  album?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
}