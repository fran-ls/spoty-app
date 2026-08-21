export type LocalPlayer = {
  shuffle: boolean;
  repeat: boolean;
  volume: number;
  progress: number;
  timesRepeat?: number;
  songId?: string | null;
  playlistId?: string | null;
}

const key = 'songfy-player';

export async function getLocalPlayer(): Promise<Partial<LocalPlayer>> {
  const player = localStorage.getItem(key);
  return player ? JSON.parse(player) : {
    progress: 0
  }
}

export async function updateLocalPlayer(
  data: Partial<LocalPlayer>,
  player?: Partial<LocalPlayer>
) {
  const item = player ? player : getLocalPlayer();
  localStorage.setItem(key, JSON.stringify({ ...item, ...data }));
}