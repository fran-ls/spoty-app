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
        data,
      }
    }

    let query = '';

    for (const f in filters) {
      if (filters[f]) query += `${f}=${encodeURIComponent(filters[f])}&`;
    }

    query = query.slice(0, -1);

    const { data, status, statusText } = await api.get(`/songs/search?${query}`);

    return {
      status,
      statusText,
      data,
    }
  }

  streamUrl(songId: string) {
    return `${envs.API_URL}/songs/stream/${songId}`;
  }

  async uploadSong(data: any) {
    return await api.post('/songs/upload', data);
  }
}

const apiService = new ApiService();
export default apiService;