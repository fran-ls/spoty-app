import type { HistoryPlaylistRes, HistorySongRes, PlayHistory, PlayHistoryDTO, PlayHistoryFilters } from "../playHistory.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";

class PlayHistoryService {
  async getSongs(userId: string, filters?: PlayHistoryFilters) {
    return await apiFetch<HistorySongRes>(() => (
      api.get(`/play-history/${userId}/songs`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async getPlaylists(userId: string, filters?: PlayHistoryFilters) {
    return await apiFetch<HistoryPlaylistRes>(() => (
      api.get(`/play-history/${userId}/playlists`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async addSong(songId: string, userId?: string) {
    return await apiFetch<PlayHistory>(() => (
      api.post(`/play-history/songs${userId ? `/${userId}` : ''}`, { songId }, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async addPlaylist(playlistId: string, userId?: string) {
    return await apiFetch<PlayHistory>(() => (
      api.post(`/play-history/playlists${userId ? `/${userId}` : ''}`, { playlistId }, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async add(data: PlayHistoryDTO) {
    if (data.playlistId) {
      return await this.addPlaylist(data.playlistId, data.userId);
    }

    return await this.addSong(data.songId!, data.userId);
  }
}

const playHistoryService = new PlayHistoryService();
export default playHistoryService;