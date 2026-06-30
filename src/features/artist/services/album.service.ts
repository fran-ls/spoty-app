import type { Album, AlbumDTO, AlbumFilters } from "../album.types";
import type { SearchResponse } from "../../../shared/types/common.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";
import { envs } from "../../../shared/utils/envs";

class AlbumService {
  async searchAlbums(filters?: AlbumFilters) {
    const params: Record<string, any> = {}

    for (const f in filters) {
      const v = (filters as any)[f];
      if (v) params[f] = v;
    }

    return await apiFetch<SearchResponse<Album[]>>(() => (
      api.get(`/albums/search`, {
        params: filters ? params : undefined,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async newAlbum(data: AlbumDTO) {
    const formData = new FormData();

    if (data.file) {
      formData.append('album', data.file);
    }

    for (const f in data) {
      const v = (data as any)[f];
      if (f !== 'file' && v) formData.append(f, v);
    }

    return await apiFetch<Album>(() => (
      api.post('/albums', formData, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }

  async updateAlbum(id: string, data: Partial<AlbumDTO>) {
    const formData = new FormData();

    if (data.file) {
      formData.append('album', data.file);
    }

    for (const f in data) {
      const v = (data as any)[f];
      if (f !== 'file' && v) formData.append(f, v);
    }

    return await apiFetch<Album>(() => (
      api.put(`/albums/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }

  async deleteAlbum(id: string) {
    return await apiFetch<Album>(() => (
      api.delete(`/albums/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  albumCover(id: string, imageUrl = '') {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return '';
    }
    if (!imageUrl.includes('/api/')) {
      return imageUrl || '';
    }
    return `${envs.API_URL}/albums/cover/${id}`;
  }
}

const albumService = new AlbumService();
export default albumService;