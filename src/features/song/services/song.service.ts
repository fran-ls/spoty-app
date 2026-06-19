import type { SearchResponse } from "../../../shared/types/common.types";
import type { Song } from "../song.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { envs } from "../../../shared/utils/envs";
import { tokenService } from "../../auth/services/token.service";

class SongService {
  async searchSongs(filters: Record<string, any> | undefined = undefined) {
    if (!filters) {
      return await apiFetch<SearchResponse<Song[]>>(() => (
        api.get('/songs/search', {
          headers: {
            'Authorization': `Bearer ${tokenService.getToken()}`
          }
        })
      ));
    }

    const params: Record<string, any> = {}

    for (const f in filters) {
      if (filters[f]) params[f] = filters[f];
    }

    return await apiFetch<SearchResponse<Song[]>>(() => (
      api.get(`/songs/search`, {
        params,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  streamUrl(songId: string) {
    return `${envs.API_URL}/songs/stream/${songId}`;
  }

  async stream(songId: string) {
    return await apiFetch(() => (
      api.get(`/songs/stream/${songId}`, {
        responseType: 'stream',
        headers: {
          'Range': 'bytes=0-',
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
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
    return await apiFetch<SearchResponse<Song[]>>(() => (
      api.post('/songs/upload', data, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }
}

const songService = new SongService();
export default songService;