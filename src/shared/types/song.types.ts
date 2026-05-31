import type { Artist } from "./music.types";

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