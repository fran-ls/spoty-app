import { api, apiFetch } from "../../../shared/utils/api";
import type { Playlist, PlaylistDTO, PlaylistResponse, PlaylistSong } from "../playlist.types";
import { envs } from "../../../shared/utils/envs";
import { tokenService } from "../../auth/services/token.service";
import type { SearchResponse } from "../../../shared/types/common.types";

class PlaylistService {
  playlistCover(id: string) {
    return `${envs.API_URL}/playlists/cover/${id}`;
  }

  async getPlaylistSongs(playlistId: string, filters?: Record<string, any>) {
    const params: Record<string, any> = {}

    if (filters) {
      for (const f in filters) {
        if (filters[f]) params[f] = filters[f];
      }
    }

    return await apiFetch<PlaylistResponse>(() => (
      api.get(`/playlists/${playlistId}/songs`, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async removeSongFromPlaylist(id: string) {
    return await apiFetch<{ success: boolean }>(() => (
      api.post(`/playlists/remove-song`, { id }, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async addSongToPlaylist(playlistId: string, songId: string) {
    return await apiFetch<PlaylistSong>(() => (
      api.post(`/playlists/add-song`, { playlistId, songId }, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async removePlaylist(id: string) {
    return await apiFetch<Playlist>(() => (
      api.delete(`/playlists/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async updatePlaylist(id: string, playlist: Partial<PlaylistDTO>) {
    const formData = new FormData();

    if (playlist.file) {
      formData.append('cover', playlist.file);
    }

    for (const f in playlist) {
      if (f !== 'file') {
        formData.append(f, (playlist as any)[f]);
      }
    }

    return await apiFetch<Playlist>(async () => {
      const r = await api.put(`/playlists/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = r.data;

      return {
        ...r,
        data: {
          ...data,
          cover: data.cover ? this.playlistCover(id) : data.cover
        }
      }
    });
  }

  async getUserPlaylists(userId: string) {
    return await apiFetch<Playlist[]>(() => (
      api.get(`/playlists/u/${userId}`, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async getPlaylist(id: string) {
    return await apiFetch<Playlist>(async () => {
      const r = await api.get(`/playlists/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });
      const data = r.data;

      return {
        ...r,
        data: {
          ...data,
          cover: data.cover ? this.playlistCover(id) : data.cover
        }
      }
    });
  }

  async searchPlaylists(filters?: Record<string, any>) {
    const params: Record<string, any> = {}

    if (filters) {
      for (const f in filters) {
        if (filters[f]) params[f] = filters[f];
      }
    }

    return await apiFetch<SearchResponse<Playlist[]>>(() => (
      api.get(`/playlists/search`, {
        params,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async newPlaylist(playlist: PlaylistDTO, force = false) {
    const formData = new FormData();

    if (playlist.file) {
      formData.append('cover', playlist.file);
    }

    for (const f in playlist) {
      if (f !== 'file') {
        formData.append(f, (playlist as any)[f]);
      }
    }

    return await apiFetch<Playlist>(() => (
      api.post('/playlists', formData, {
        params: { force },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }
}

const playlistService = new PlaylistService();
export default playlistService;