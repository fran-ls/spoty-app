import type { Album } from "../artist/album.types";
import type { Artist } from "../artist/artist.types";

export interface Song {
  id: string;
  title: string;
  fileUrl: string;
  cover?: string;
  duration: number;
  artistId: string;
  albumId?: string;
  createdAt: Date;
  artist: Artist;
  // album: Album;
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
  albumId?: string;
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
  cover?: string;
  duration: number;
  artistId: string;
  albumId?: string;
  createdAt: Date;
  artist?: Artist;
  album?: Album;
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
  albumId?: string;
  albumName?: string;
  quality: string;
  audio: File | null;
  coverFile?: File | null;
  include?: {
    artist?: boolean;
    album?: boolean;
  }
}

export interface TrackFilters {
  id?: string;
  title?: string;
  artistId?: string;
  artistName?: string;
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'title' | 'createdAt';
  include?: {
    artist?: boolean;
    album?: boolean;
  }
}