export const FormatType = {
  VIDEO: 'video',
  AUDIO: 'audio'
} as const;

export type FormatType = (typeof FormatType)[keyof typeof FormatType];


export const AudioQuality = {
  MAX: 320,
  HIGH: 192,
  LOW: 128
} as const;

export type AudioQuality = (typeof AudioQuality)[keyof typeof AudioQuality];

export type AudioQualityType = keyof typeof AudioQuality;


export const VideoQuality = {
  FULL_HD: 1080,
  HD: 720,
  SD: 480,
  LOW: 360
} as const;

export type VideoQuality = (typeof VideoQuality)[keyof typeof VideoQuality];

export type VideoQualityType = keyof typeof VideoQuality;


export type SrcQuality = AudioQuality | VideoQuality;