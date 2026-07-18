import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";
import type { Player, PlayerDTO, PlayerInclude } from "../player.types";

class PlayerService {
  async getPlayer(userId: string, include?: PlayerInclude) {
    return await apiFetch<Player>(() => (
      api.get(`/player/u?userId=${userId}`, {
        params: {
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async createPlayer(data: PlayerDTO, include?: PlayerInclude) {
    return await apiFetch<Player>(() => (
      api.post('/player/u', data, {
        params: {
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  async updatePlayer(
    id: string,
    data: Partial<PlayerDTO>,
    include?: PlayerInclude
  ) {
    return await apiFetch<Player>(() => (
      api.put(`/player/u/${id}`, data, {
        params: {
          include: include ? JSON.stringify(include) : undefined
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }
}

const playerService = new PlayerService;
export default playerService;