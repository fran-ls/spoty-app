import type { PlaylistLayoutK, PlaylistOrderByK } from "../library.types";

export const PLAYLIST_SORT_LABEL: Record<PlaylistOrderByK, string> = {
  RECENT: 'Recientes',
  NAME: 'Orden alfabético'
} as const

export const PLAYLIST_LAYOUT_LABEL: Record<PlaylistLayoutK, string> = {
  LIST: 'Lista predeterminada',
  COMPACT_LIST: 'Lista compacta',
  GRID: 'Cuadrícula'
} as const