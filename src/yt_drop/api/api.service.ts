import axios from "axios";
import type { Artist, Playlist } from "../types/upload.type";
import { type PaginationMeta, type DownloadPayload, type HistoryItem, type HistoryResponse } from "../types/history.type";
import { FormatType, VideoQuality } from "../types/common.type";
import { getIsUploadToSpotify } from "../helpers/getIsUpload";
import { envs } from "../../shared/utils/envs";

const api = axios.create({
  baseURL: envs.YTDROP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

class ApiService {
  private YT_URL = 'https://www.youtube.com/watch?v=';

  async getHistoryStats() {
    const isUpload = getIsUploadToSpotify();
    if (isUpload) return await this.getSpotifyHistoryStats();

    try {
      const r = await api.get('/history/stats')
      return await this.ApiResponse('ok', {
        ...r,
        data: {
          ...r.data,
          totalSize: r.data.total_size
        }
      });
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async getSpotifyHistoryStats() {
    try {
      const r = await axios.get(`${envs.API_URL}/downloads/stats`)
      return await this.ApiResponse('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async getHistory(filters: Record<string, string | number> = {}) {
    const params: Record<string, string | number> = {}

    for (const f in filters) {
      if (filters[f]) params[f] = filters[f];
    }

    const isUpload = getIsUploadToSpotify();
    if (isUpload) return await this.getSpotifyHistory(params);

    try {
      const r = await api.get<HistoryResponse>('/history', { params })
      const data = r.data;
      const meta = data.meta as any;

      return await this.ApiResponse<PaginationMeta & { items: HistoryItem[] }>('ok', {
        ...r, data: {
          items: data.items,
          meta: {
            limit: meta.limit,
            page: meta.page,
            total: meta.total,
            totalPages: meta.total_pages || meta.totalPages
          } as PaginationMeta
        }
      });
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async getSpotifyHistory(filters: Record<string, string | number> = {}) {
    const params: Record<string, string | number> = {}

    for (const f in filters) {
      if (filters[f]) params[f] = filters[f];
    }

    try {
      const r = await axios.get(`${envs.API_URL}/downloads`, { params })
      return await this.ApiResponse<PaginationMeta & { items: HistoryItem[] }>('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async initDownload(payload: DownloadPayload) {
    const {
      urls = '',
      format = FormatType.VIDEO,
      quality = `${VideoQuality.LOW}`
    } = payload;

    if (!urls) return {
      validation: 'Ingresar enlaces de los videos, uno por línea',
    }

    const links = urls.split('\n').filter(url => url && url.includes(this.YT_URL));

    if (!links.length) return {
      validation: 'Ingresa enlaces válidos de Youtube',
    }

    const body = {
      urls: links.join('\n'),
      format: format.trim(),
      quality: quality.trim(),
      is_upload: getIsUploadToSpotify()
    }

    try {
      const r = await api.post('/download', body);
      return await this.ApiResponse('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async getJob(jobId: string) {
    try {
      const r = await api.get(`/job/${jobId}`);
      return await this.ApiResponse('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async download(item: HistoryItem) {
    const isUpload = getIsUploadToSpotify();

    try {
      let r = null;

      if (isUpload) {
        r = await fetch(`${envs.API_URL}/downloads/file/${item.id}`);
      }
      else {
        r = await fetch(`${envs.YTDROP_API_URL}/file/${encodeURIComponent(item.filename)}/${item.format}/${item.quality}?is_upload=${isUpload}`);
      }

      const blob = await r.blob();

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = item.title;
      a.click();
      URL.revokeObjectURL(a.href);

      return this.ApiResponse('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async downloadZip(currentFiles: HistoryItem[]) {
    const isUpload = getIsUploadToSpotify();

    try {
      const r = await fetch(`${envs.YTDROP_API_URL}/download-zip/files?is_upload=${isUpload}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: currentFiles })
      });

      if (!r.ok) return await this.ApiResponse('error', {
        ...r,
        error: 'Error al crear el ZIP',
      });

      const blob = await r.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ytdrop_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);

      return await this.ApiResponse('ok', {
        ...r,
        message: 'ZIP descargado',
      });
    } catch (e) {
      return await this.ApiResponse('error', {
        error: 'Error al descargar ZIP',
      });
    }
  }

  async deleteOneHistory(id: string) {
    try {
      const r = await api.delete(`/history/${id}`);
      return await this.ApiResponse('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async clearHistory() {
    try {
      const r = await api.delete('/history/clear');
      return await this.ApiResponse('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async info(url: string) {
    try {
      const r = await api.post('/info', { url });
      return await this.ApiResponse('ok', r);
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  async uploadToSpotify(items: HistoryItem[], artist: Artist, playlist: Playlist) {
    const formData = new FormData();
    formData.append('items', JSON.stringify(items));

    formData.append('artist', JSON.stringify({
      name: artist.name,
      bio: artist.bio,
      imageUrl: artist.imageUrl
    }));

    formData.append('playlist', JSON.stringify({
      name: playlist.name,
      bgColor: playlist.bgColor,
      gradientColor: playlist.gradientColor,
      coverUrl: playlist.coverUrl
    }));

    if (artist.file) {
      formData.append('image', artist.file)
    }
    if (playlist.file) {
      formData.append('cover', playlist.file)
    }

    try {
      const r = await axios.post(`${envs.API_URL}/downloads/upload`,
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (r.statusText.toUpperCase() !== 'OK') {
        return this.ApiResponse('error', r);
      }

      return await this.ApiResponse('ok', {
        ...r, message: 'uploaded to spotify clone'
      });
    } catch (e) {
      return await this.ApiResponse('error', e);
    }
  }

  private async ApiResponse<T = any>(type: 'ok' | 'error', response: any): Promise<{
    data?: T;
    status: number;
    statusText: string;
    message: string;
    error?: any;
  }> {
    const r = response;

    if (type === 'ok') return {
      status: r.status ?? 200,
      statusText: r.statusText || 'OK',
      message: r.message,
      data: r.data ?? null
    }

    return {
      status: r.status ?? 500,
      statusText: r.statusText,
      message: r.message ?? 'Error to fetch',
      error: r.error ?? 'Error to fetch'
    }
  }
}

export const apiService = new ApiService();