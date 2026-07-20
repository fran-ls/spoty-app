import type { Library, LibraryDTO, LibraryInclude } from "../library.types";
import type { Playlist, PlaylistFilters, PlaylistInclude } from "../../playlist/playlist.types";
import type { SearchResponse } from "../../../shared/types/common.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";

class LibraryService {
  async getLibrary(userId: string, include?: LibraryInclude) {
    return await apiFetch<Library>(() => (
      api.get(`/library/u/${userId}`, {
        params: {
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
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

  async getSystemPlaylists(filters?: PlaylistFilters, include?: PlaylistInclude) {
    return await apiFetch<Playlist[]>(() => (
      api.get('/library/s', {
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

  async createLibrary(library: LibraryDTO, include?: LibraryInclude) {
    return await apiFetch<Library>(() => (
      api.post('/library/u', library, {
        params: {
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async updateLibrary(
    id: string,
    library: Partial<LibraryDTO>,
    include?: LibraryInclude
  ) {
    return await apiFetch<Library>(() => (
      api.put(`/library/u/${id}`, library, {
        params: {
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async getOrCreateLibrary(userId: string, include?: LibraryInclude) {
    let r = await this.getLibrary(userId, include);
    if (r.error) return r;

    let lib = r.data;
    if (!lib) {
      r = await libraryService.createLibrary({ userId }, include);
      lib = r.data;
    }

    return r;
  }
}

const libraryService = new LibraryService();
export default libraryService;