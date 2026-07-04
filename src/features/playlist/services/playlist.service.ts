import { api, apiFetch } from "../../../shared/utils/api";
import type { Playlist, PlaylistDTO, PlaylistFilters, PlaylistInclude, PlaylistResponse, PlaylistSong, PlaylistSongDTO, PlaylistSongInclude } from "../playlist.types";
import type { SearchResponse } from "../../../shared/types/common.types";
import { envs } from "../../../shared/utils/envs";
import { tokenService } from "../../auth/services/token.service";

class PlaylistService {
  playlistCover(id: string, cover?: string | null) {
    if (!cover || typeof cover !== 'string') {
      return '';
    }
    if (!cover.includes('/api/')) {
      return cover || '';
    }

    return `${envs.API_URL}/playlists/cover/${id}`;
  }

  async getPlaylistSongs(playlistId: string, filters?: Record<string, any>) {
    const params: Record<string, any> = {}

    if (filters) {
      for (const f in filters) {
        const v = filters[f];
        if (v) params[f] = v;
      }
    }

    return await apiFetch<PlaylistResponse>(() => (
      api.get(`/playlists/${playlistId}/tracks`, {
        params: filters ? params : undefined,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async removeSongFromPlaylist(id: string) {
    return await apiFetch<Playlist | null>(() => (
      api.post(`/playlists/remove-track`, { id }, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async addSongToPlaylist(data: PlaylistSongDTO, include?: PlaylistSongInclude) {
    return await apiFetch<PlaylistSong>(() => (
      api.post(`/playlists/new-track`, data, {
        params: {
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async removePlaylist(id: string, isRemoveFiles = false) {
    return await apiFetch<Playlist>(() => (
      api.delete(`/playlists/${id}`, {
        params: {
          include_files: isRemoveFiles,
        },
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
          cover: this.playlistCover(id, data.cover)
        }
      }
    });
  }

  async getUserPlaylists(userId: string, filters?: PlaylistFilters, include?: PlaylistInclude) {
    return await apiFetch<SearchResponse<Playlist[]>>(() => (
      api.get(`/playlists/u/${userId}`, {
        params: {
          ...filters,
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async getPlaylist(id: string, include?: PlaylistInclude) {
    return await apiFetch<Playlist>(async () => {
      const r = await api.get(`/playlists/${id}`, {
        params: include ? include : undefined,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });
      const data = r.data;

      return {
        ...r,
        data: {
          ...data,
          cover: this.playlistCover(id, data.cover)
        }
      }
    });
  }

  async searchPlaylists(filters?: PlaylistFilters, include?: PlaylistInclude) {
    return await apiFetch<SearchResponse<Playlist[]>>(() => (
      api.get(`/playlists/search`, {
        params: {
          ...filters,
          include: include ? JSON.stringify(include) : undefined
        },
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