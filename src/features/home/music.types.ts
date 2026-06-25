export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // MM:SS format
  durationSec: number;
  coverUrl: string;
  addedDate?: string;
  bpm?: number;
  releaseYear?: number;
  genre?: string;
  mood?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  creator: string;
  likes: string;
  songCount: number;
  durationText: string;
  tracks: Track[];
  bgColor?: string;
  gradientColor?: string;
  isPrivate?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  type: 'Artist';
}

export interface Genre {
  id: string;
  name: string;
  bgColor: string;
  coverUrl: string;
}

export interface Podcast {
  id: string;
  title: string;
  publisher: string;
  coverUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}
