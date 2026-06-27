import type { SearchResponse } from "../../../shared/types/common.types";
import type { Song, SongDTO, TrackFilters } from "../song.types";
import { api, apiFetch, ApiResponse } from "../../../shared/utils/api";
import { envs } from "../../../shared/utils/envs";
import { tokenService } from "../../auth/services/token.service";
import { uploadToSupabase } from "../../../shared/utils/uploadToSupabase";

class SongService {
  async searchSongs(filters?: TrackFilters) {
    const params: Record<string, any> = {}

    if (filters) {
      for (const f in filters) {
        const v = (filters as any)[f];
        if (v) params[f] = v;
      }
    }

    return await apiFetch<SearchResponse<Song[]>>(() => (
      api.get(`/songs/search`, {
        params: filters ? params : filters,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  streamUrl(songId: string, fileUrl = '') {
    if (typeof fileUrl !== 'string') {
      return '';
    }
    if (!fileUrl.includes('/api/')) {
      return fileUrl;
    }
    return `${envs.API_URL}/songs/stream/${songId}`;
  }

  async stream(songId: string) {
    return await apiFetch(() => (
      api.get(`/songs/stream/${songId}`, {
        responseType: 'stream',
        headers: {
          'Range': 'bytes=0-',
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }

  songCoverUrl(songId: string, cover: string | null | undefined) {
    if (!cover || typeof cover !== 'string') {
      return '';
    }
    if (!cover.includes('/api/')) {
      return cover || '';
    }
    return `${envs.API_URL}/songs/cover/${songId}`;
  }

  async uploadSong(data: SongDTO) {
    const formData = new FormData();

    const files = [
      {
        field: 'audio',
        fieldname: 'audios',
        file: data.audio
      },
      {
        field: 'coverFile',
        fieldname: 'tracks',
        file: data.coverFile
      }
    ];

    if (data.audio && envs.IS_PROD) {
      const extname = data.audio.name.split('.').at(-1);

      const upload = await uploadToSupabase({
        bucketName: 'Audios',
        file: data.audio,
        filepath: `${data.quality}/${crypto.randomUUID()}.${extname}`
      });

      if (upload.error) return ApiResponse<null>({
        success: false,
        status: 400,
        message: 'Error uploading to server',
        error: upload.error
      });

      data.fileUrl = upload.data;
    }
    else {
      for (const f of files) {
        const file = (data as any)[f.field];
        if (file) formData.append(f.fieldname, file);
      }
    }

    const exclude = 'audio coverFile'.split(' ');

    for (const f in data) {
      const v = (data as any)[f];

      if (!exclude.includes(f) && v) {
        formData.append(f, v);
      }
    }

    return await apiFetch<Song>(() => (
      api.post('/songs/upload', formData, {
        params: {
          audio_quality: data.quality
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }

  async updateSong(id: string, data: SongDTO) {
    const formData = new FormData();

    const files = [
      {
        field: 'audio',
        fieldname: 'audios',
        file: data.audio
      },
      {
        field: 'coverFile',
        fieldname: 'tracks',
        file: data.coverFile
      }
    ];

    for (const f of files) {
      const file = (data as any)[f.field];
      if (file) formData.append(f.fieldname, file);
    }

    const exclude = 'audio coverFile'.split(' ');

    for (const f in data) {
      const v = (data as any)[f];

      if (!exclude.includes(f) && v) {
        formData.append(f, v);
      }
    }

    return await apiFetch<Song>(() => (
      api.put(`/songs/${id}`, formData, {
        params: {
          audio_quality: data.quality
        },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    ));
  }

  async removeSong(songId: string, isRemoveFiles = false) {
    return await apiFetch<Song>(() => (
      api.delete(`/songs/${songId}`, {
        params: { include_files: isRemoveFiles },
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
  }
}

const songService = new SongService();
export default songService;