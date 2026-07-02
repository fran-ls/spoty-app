import type { FormatType, SrcQuality } from "./common.type";

export interface HistoryItem {
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

export interface HistoryResponse {
  items: HistoryItem[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages?: number;
  }
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

export interface HistoryStat {
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