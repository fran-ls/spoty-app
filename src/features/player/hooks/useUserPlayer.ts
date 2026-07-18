import { useState } from "react";
import type { Player, PlayerInclude } from "../player.types";
import playerService from "../services/player.service";

const useUserPlayer = () => {
  const [player, setPlayer] = useState<Player | null>(null);

  async function getPlayer(userId: string, include?: PlayerInclude) {
    const { data } = await playerService.getPlayer(userId, include);
    if (data) setPlayer(data);
    return data;
  }

  return {
    player, setPlayer,
    getPlayer
  }
}

export default useUserPlayer;