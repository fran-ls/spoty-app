import type { UserLibrary, UserLibraryDTO, UserLibraryInclude } from "../library.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";
import type { Playlist, PlaylistFilters, PlaylistInclude } from "../../playlist/playlist.types";

class LibraryService {
  async getUserLibrary(userId: string, include?: UserLibraryInclude) {
    return await apiFetch<UserLibrary>(() => (
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

  async newUserLibrary(library: UserLibraryDTO, include?: UserLibraryInclude) {
    return await apiFetch<UserLibrary>(() => (
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

  async updateUserLibrary(
    id: string,
    library: Partial<UserLibraryDTO>,
    include?: UserLibraryInclude
  ) {
    return await apiFetch<UserLibrary>(() => (
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

  async getOrCreateUserLibrary(userId: string, include?: UserLibraryInclude) {
    let r = await this.getUserLibrary(userId, include);
    if (r.error) return r;

    let lib = r.data;
    if (!lib) {
      r = await libraryService.newUserLibrary({ userId }, include);
      lib = r.data;
    }

    return r;
  }
}

const libraryService = new LibraryService();
export default libraryService;