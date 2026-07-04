import type { PaginationQuery } from "../../shared/types/common.types";
import type { Track } from "../song/song.types";
import type { Album } from "./album.types";

export interface Artist {
  id: string;
  name: string;
  bio?: string | null;
  image?: string | null;
  albums?: Album[];
  songs?: Track[];
}

export interface ArtistDTO {
  name: string;
  bio?: string | null;
  image?: string;
  file?: string | null;
}

export type ArtistFilters = Partial<Artist> & PaginationQuery;

export interface ArtistInclude {
  songs?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
  albums?: string | string[] | boolean | {
    kind?: 'select' | 'omit';
    fields?: string | string[];
  };
}