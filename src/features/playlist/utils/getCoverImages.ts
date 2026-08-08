import songService from "../../song/services/song.service";
import type { Song } from "../../song/song.types";
import type { PlaylistCover } from "../playlist.types";

export const getCoverImages = (songs: Song[]) => {
  const images: PlaylistCover[] = [];

  for (const song of songs) {
    if (song?.cover) {
      const url = songService.songCoverUrl(song.id, song.cover);
      url && images.push({ id: song.id, url });
    }

    if (images.length === 4) {
      break;
    }
  }

  return images;
}