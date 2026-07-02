import axios from "axios";
import type { Download, DownloadPayload, DownloadResponse, DownloadStat } from "../types/download.types";
import type { Artist, Playlist } from "../types/upload.types";
import { FormatType, VideoQuality } from "../types/common.types";
import { getIsUploadToSpotify } from "../helpers/getIsUpload";
import { envs } from "../../shared/utils/envs";
import { tokenService } from "../../features/auth/services/token.service";
import { api, ApiResponse, type ApiRes } from "../../shared/utils/api";

const ytDropApi = axios.create({
  baseURL: envs.YTDROP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

class DownloadService {
  private YT_URL = 'https://www.youtube.com/watch?v=';

  async getDownloadStats(): ApiRes<DownloadStat> {
    try {
      const r = await api.get('/downloads/stats', {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });
      return await ApiResponse(r);
    } catch (e) {
      return await ApiResponse(e);
    }
  }

  async getDownloads(filters: Record<string, string | number> = {}): ApiRes<DownloadResponse> {
    const params: Record<string, string | number> = {}

    for (const f in filters) {
      if (filters[f]) params[f] = filters[f];
    }

    try {
      const r = await api.get<Download>('/downloads', {
        params,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });
      return await ApiResponse<DownloadResponse>(r);
    } catch (e) {
      return await ApiResponse(e);
    }
  }

  async initDownload(payload: DownloadPayload): ApiRes<any> {
    const {
      urls = '',
      format = FormatType.VIDEO,
      quality = `${VideoQuality.LOW}`
    } = payload;

    if (!urls) return ApiResponse({
      validation: 'Ingresar enlaces de los videos, uno por línea',
    })

    const links = urls.split('\n').filter(url => url && url.includes(this.YT_URL));

    if (!links.length) return ApiResponse({
      validation: 'Ingresa enlaces válidos de Youtube',
    })

    const body = {
      urls: links.join('\n'),
      format: format.trim(),
      quality: quality.trim(),
      is_upload: getIsUploadToSpotify()
    }

    try {
      const r = await ytDropApi.post('/download', body);
      return await ApiResponse(r);
    } catch (e) {
      return await ApiResponse(e);
    }
  }

  async getJob(jobId: string): ApiRes<any> {
    try {
      const r = await ytDropApi.get(`/job/${jobId}`);
      return await ApiResponse(r);
    } catch (e) {
      return await ApiResponse(e);
    }
  }

  async download(item: Download): ApiRes<any> {
    try {
      const r = await api.get(`/downloads/file/${item.id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });
      const blob = await r.data;

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = item.title;
      a.click();
      URL.revokeObjectURL(a.href);

      return ApiResponse(r);
    } catch (e) {
      return await ApiResponse(e);
    }
  }

  async downloadZip(currentFiles: Download[]): ApiRes<any> {
    const isUpload = getIsUploadToSpotify();

    try {
      const r = await fetch(`${envs.YTDROP_API_URL}/download-zip/files?is_upload=${isUpload}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: currentFiles })
      });

      if (!r.ok) return await ApiResponse({
        ...r,
        error: 'Error al crear el ZIP',
      });

      const blob = await r.blob();

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ytdrop_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);

      return await ApiResponse({
        ...r,
        message: 'ZIP descargado',
      });
    } catch (e) {
      return await ApiResponse({
        error: 'Error al descargar ZIP',
      });
    }
  }

  async deleteDownload(id: string): ApiRes<Download> {
    try {
      const r = await api.delete(`/downloads/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });
      return await ApiResponse(r);
    } catch (e) {
      return ApiResponse(e);
    }
  }

  async clearDownloads(): ApiRes<any> {
    try {
      const r = await ytDropApi.delete('/history/clear');
      return await ApiResponse(r);
    } catch (e) {
      return await ApiResponse(e);
    }
  }

  async info(url: string): ApiRes<any> {
    try {
      const r = await ytDropApi.post('/info', { url });
      return await ApiResponse(r);
    } catch (e) {
      return await ApiResponse(e);
    }
  }

  async uploadToSpotify(items: Download[], artist: Artist, playlist: Playlist): ApiRes<any> {
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
      const r = await api.post('/downloads/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });

      if (r.statusText.toUpperCase() !== 'OK') {
        return await ApiResponse(r);
      }

      return await ApiResponse({
        ...r,
        message: 'uploaded to spotify clone'
      });
    } catch (e) {
      return await ApiResponse(e);
    }
  }
}

const downloadService = new DownloadService();
export default downloadService;