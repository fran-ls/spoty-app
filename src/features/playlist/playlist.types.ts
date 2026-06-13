export interface Playlist {
  id: string;
  name: string;
  description: null;
  cover: string | null;
  bgColor: string;
  gradientColor: string;
  isPublic: boolean;
  userId: string;
}

export interface PlaylistDTO {
  name: string;
  description: string;
  cover: string;
  bgColor: string;
  gradientColor: string;
  isPublic: boolean;
  userId: string;
  file: File | null;
}