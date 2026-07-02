import type { FormatType, SrcQuality } from "./common.types";

export interface Download {
  id: string;
  duration: number;
  filename: string;
  format: FormatType;
  jobId: string;
  quality: SrcQuality;
  sizeBytes: number;
  status: DownloadStatus;
  thumbnail: string;
  title: string;
  url: string;
  uploader?: string;
  createdAt: any;
}

export interface DownloadResponse {
  items: Download[];
  meta: PaginationMeta;
}

export interface DownloadPayload {
  urls: string;
  format: string;
  quality: string;
}

export interface PaginationMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface DownloadStat {
  audios: number;
  errors: number;
  success: number;
  total: number;
  totalSize: number;
  videos: number;
}

export type DownloadStatus =
  'running' | 'downloading' | 'error' |
  'success' | 'finished' | 'done';