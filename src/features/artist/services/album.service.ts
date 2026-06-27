import type { Album, AlbumDTO, AlbumFilters } from "../album.types";
import type { SearchResponse } from "../../../shared/types/common.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";

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
    return await apiFetch<Album>(() => (
      api.post('/albums', data, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async updateAlbum(id: string, data: Partial<AlbumDTO>) {
    // const formData = new FormData();

    // if (data.file) {
    //   formData.append('artist', data.file);
    // }

    // for (const f in data) {
    //   const v = (data as any)[f];

    //   if (f !== 'file' && v) {
    //     formData.append(f, v);
    //   }
    // }

    return await apiFetch<Album>(() => (
      api.put(`/albums/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
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
}

const albumService = new AlbumService();
export default albumService;