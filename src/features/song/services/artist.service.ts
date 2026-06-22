import type { SearchResponse } from "../../../shared/types/common.types";
import type { Artist, ArtistDTO } from "../artist.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";

class ArtistService {
  async getArtists(filters?: Record<string, any>) {
    const params: Record<string, any> = {}

    for (const f in filters) {
      const v = filters[f];
      if (v) params[f] = v;
    }

    return await apiFetch<SearchResponse<Artist[]>>(() => (
      api.get(`/artists/search`, {
        params: filters ? params : undefined,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async newArtist(data: ArtistDTO) {
    const formData = new FormData();

    if (data.file) {
      formData.append('artist', data.file);
    }

    for (const f in data) {
      const v = (data as any)[f];

      if (f !== 'file' && v) {
        formData.append(f, v);
      }
    }

    return await apiFetch<Artist>(() => (
      api.post('/artists', {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }

  async updateArtist(id: string, data: Partial<ArtistDTO>) {
    const formData = new FormData();

    if (data.file) {
      formData.append('artist', data.file);
    }

    for (const f in data) {
      const v = (data as any)[f];

      if (f !== 'file' && v) {
        formData.append(f, v);
      }
    }

    return await apiFetch<Artist>(() => (
      api.put(`/artists/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }
}

const artistService = new ArtistService();
export default artistService;