import { AudioQuality, VideoQuality } from "../types/common.type"

export type SrcType = typeof QUALITIES;

export const QUALITIES = {
  audio: {
    [AudioQuality.MAX]: 'Max',
    [AudioQuality.HIGH]: 'Alta',
    [AudioQuality.LOW]: 'Baja',
  },
  video: {
    [VideoQuality.FULL_HD]: 'Full HD',
    [VideoQuality.HD]: 'HD',
    [VideoQuality.SD]: 'SD',
    [VideoQuality.LOW]: 'Baja'
  }
}