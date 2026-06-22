import type { Artist } from "./artist.types";

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
  albumId?: string;
  quality: string;
  audio: File | null;
  coverFile?: File | null;
  includeArtist?: boolean;
}
