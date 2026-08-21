import type { HistoryPlaylist, HistorySong, PlayHistory, PlayHistoryDTO, PlayHistoryFilters, THistoryRes } from "../playHistory.types";
import type { SearchResponse } from "../../../shared/types/common.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";

class PlayHistoryService {
  async searchHistory(userId: string, filters?: PlayHistoryFilters) {
    return await apiFetch<SearchResponse<PlayHistory[]>>(() => (
      api.get(`/play-history/${userId}/search`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async getLastPlaylistsPlayed(userId: string, filters?: PlayHistoryFilters) {
    return await apiFetch<HistoryPlaylist[]>(() => (
      api.get(`/play-history/${userId}/last-playlists`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async getHistory(userId: string, filters?: PlayHistoryFilters) {
    return await apiFetch<THistoryRes>(() => (
      api.get(`/play-history/${userId}`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async getSongs(userId: string, filters?: PlayHistoryFilters) {
    return await apiFetch<SearchResponse<HistorySong[]>>(() => (
      api.get(`/play-history/${userId}/songs`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ))
  }

  async getPlaylists(userId: string, filters?: PlayHistoryFilters) {
    return await apiFetch<SearchResponse<HistoryPlaylist[]>>(() => (
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