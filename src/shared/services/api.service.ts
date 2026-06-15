import type { Playlist, PlaylistDTO, PlaylistResponse, PlaylistSong } from "../../features/playlist/playlist.types";
import type { Song } from "../../features/song/song.types";
import type { ApiRes, SearchResponse } from "../types/common.types";
import { api } from "../utils/api";
import { envs } from "../utils/envs";

class ApiService {
  playlistCover(id: string) {
    return `${envs.API_URL}/playlists/cover/${id}`;
  }

  async getPlaylistSongs(playlistId: string, filters?: Record<string, any>): ApiRes<PlaylistResponse> {
    const params: Record<string, any> = {}

    if (filters) {
      for (const f in filters) {
        if (filters[f]) params[f] = filters[f];
      }
    }

    try {
      const r = await api.get(`/playlists/${playlistId}/songs`);
      return this.ApiResponse('success', r);
    } catch (err) {
      return this.ApiResponse('error', err);
    }
  }

  async removeSongFromPlaylist(id: string): ApiRes<{ success: boolean }> {
    try {
      const r = await api.post(`/playlists/remove-song`, { id });
      return this.ApiResponse('success', r);
    } catch (err) {
      return this.ApiResponse('error', err);
    }
  }

  async addSongToPlaylist(playlistId: string, songId: string): ApiRes<PlaylistSong> {
    try {
      const r = await api.post(`/playlists/add-song`, {
        playlistId, songId
      });
      return this.ApiResponse('success', r);
    } catch (err) {
      return this.ApiResponse('error', err);
    }
  }

  async removePlaylist(id: string): ApiRes<Playlist> {
    try {
      const r = await api.delete(`/playlists/${id}`);
      return this.ApiResponse('success', r);
    } catch (err) {
      return this.ApiResponse('error', err);
    }
  }

  async updatePlaylist(id: string, playlist: Partial<PlaylistDTO>): ApiRes<Playlist> {
    const formData = new FormData();

    if (playlist.file) {
      formData.append('cover', playlist.file);
    }

    for (const f in playlist) {
      if (f !== 'file') {
        formData.append(f, (playlist as any)[f]);
      }
    }

    try {
      const r = await api.put(`/playlists/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      const data = r.data;

      r.data = {
        ...data,
        cover: data.cover ? this.playlistCover(id) : data.cover
      }

      return this.ApiResponse('success', r);
    } catch (err) {
      return this.ApiResponse('error', err);
    }
  }

  async getUserPlaylists(userId: string): ApiRes<Playlist[]> {
    try {
      const r = await api.get<Playlist[]>(`/playlists/u/${userId}`);
      return this.ApiResponse('success', r);
    } catch (err) {
      return this.ApiResponse('error', err);
    }
  }

  async getPlaylist(id: string): ApiRes<Playlist> {
    try {
      const r = await api.get<Playlist>(`/playlists/${id}`);
      const data = r.data;

      r.data = {
        ...data,
        cover: data.cover ? this.playlistCover(id) : data.cover
      }

      return this.ApiResponse('success', r);
    } catch (err: any) {
      return this.ApiResponse('error', err);
    }
  }

  async newPlaylist(playlist: PlaylistDTO, force = false): ApiRes<Playlist> {
    const formData = new FormData();

    if (playlist.file) {
      formData.append('cover', playlist.file);
    }

    for (const f in playlist) {
      if (f !== 'file') {
        formData.append(f, (playlist as any)[f]);
      }
    }

    try {
      const r = await api.post('/playlists', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: { force }
      });
      return this.ApiResponse('success', r);
    } catch (err) {
      return this.ApiResponse('error', err);
    }
  }

  async searchSongs(filters: Record<string, any> | undefined = undefined) {
    if (!filters) {
      const { data, status, statusText } = await api.get<SearchResponse<Song[]>>('/songs/search');

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

    const { data, status, statusText } = await api.get<SearchResponse<Song[]>>(`/songs/search`, { params });

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

  private ApiResponse<T = any>(type: 'success' | 'error', r: any): {
    status: number;
    statusText: string;
    error: string | null;
    data: T | null;
  } {
    if (type === 'error') return {
      status: r.status || 0,
      statusText: 'ERROR',
      error: r.message,
      data: null
    }

    return {
      status: r.status,
      statusText: r.statusText,
      data: r.data as T,
      error: null
    }
  }
}

const apiService = new ApiService();
export default apiService;