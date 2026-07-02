import { envs } from "../../shared/utils/envs";

export function getIsUploadToSpotify() {
  const isUpload = localStorage.getItem(envs.YTDROP_STORAGE_KEY);
  return JSON.parse(isUpload || 'false');
}

export const setIsUploadToSpotify = (value: string) => {
  localStorage.setItem(envs.YTDROP_STORAGE_KEY, `${value}`);
}