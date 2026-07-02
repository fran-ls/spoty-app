export interface Artist {
  name: string;
  bio: string;
  image: string;
  file: File | null;
  imageUrl: string;
}

export interface Playlist {
  name: string;
  cover: string;
  bgColor: string;
  gradientColor: string;
  file: File | null;
  coverUrl: string;
}