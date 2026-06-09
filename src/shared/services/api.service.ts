import type { Song } from "../../features/song/song.types";
import { api } from "../utils/api";
import { envs } from "../utils/envs";

class ApiService {
  async getSongs() {
    return await api.get('/songs');
  }

  async searchSongs(filters: any = undefined) {
    if (!filters) {
      const { data, status, statusText } = await api.get<Song[]>('/songs/search');
      return {
        status,
        statusText,
        data
      }
    }

    const params: Record<string, any> = {}

    for (const f in filters) {
      if (filters[f]) params[f] = filters[f];
    }

    const { data, status, statusText } = await api.get(`/songs/search`, { params });

    return {
      status,
      statusText,
      data
    }
  }

  streamUrl(songId: string) {
    return `${envs.API_URL}/songs/stream/${songId}`;
  }

  songCoverUrl(songId: string, cover: string | null | undefined) {
    if (!cover || typeof cover !== 'string') {
      return '';
    }
    if (!cover.includes('/api/')) {
      return cover || '';
    }
    return `${envs.API_URL}/songs/cover/${songId}`;
  }

  async uploadSong(data: any) {
    return await api.post('/songs/upload', data);
  }
}

const apiService = new ApiService();
export default apiService;