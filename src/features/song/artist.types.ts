export interface Artist {
  id: string;
  name: string;
  bio?: string;
  image?: string;

  // albums: any;
  // songs: any;
}

export interface ArtistDTO {
  name: string;
  bio?: string;
  image?: string;
  file?: string | null;
}