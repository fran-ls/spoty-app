import type { Playlist } from "../playlist.types";

const playlistSchema: Playlist = {
  id: '',
  name: '',
  description: '',
  cover: '',
  isPublic: false,
  gradientColor: '',
  bgColor: '',
  userId: '',
  duration: 0,
  trackCount: 0,
  createdAt: ''
}

export const playlist = structuredClone(playlistSchema);