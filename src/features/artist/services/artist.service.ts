import type { SearchResponse } from "../../../shared/types/common.types";
import type { Artist, ArtistDTO, ArtistFilters, ArtistInclude } from "../../artist/artist.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";
import { envs } from "../../../shared/utils/envs";

class ArtistService {
  async searchArtists(filters?: ArtistFilters, include?: ArtistInclude) {
    return await apiFetch<SearchResponse<Artist[]>>(() => (
      api.get(`/artists/search`, {
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
      api.post('/artists', formData, {
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
      api.put(`/artists/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }

  async deleteArtist(id: string, isRemoveFiles = false) {
    return await apiFetch<Artist>(() => (
      api.delete(`/artists/${id}`, {
        params: {
          include_files: isRemoveFiles,
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  artistImage(id: string, imageUrl: string | null = '') {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return '';
    }
    if (!imageUrl.includes('/api/')) {
      return imageUrl || '';
    }
    return `${envs.API_URL}/artists/image/${id}`;
  }
}

const artistService = new ArtistService();
export default artistService;