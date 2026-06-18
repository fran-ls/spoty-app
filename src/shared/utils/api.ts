import axios from "axios";
import { envs } from "./envs";

export const api = axios.create({
  baseURL: envs.API_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
});

interface ResPayload<T> {
  success: boolean;
  status: number;
  statusText: string;
  message: string;
  error: string | null;
  data: T | null;
}

export type ApiRes<T> = Promise<ResPayload<T>>

export function ApiResponse<T = any>(
  type: 'success' | 'error',
  response: any
): ResPayload<T> {
  const data = response.data?.data;

  const r = {
    ...response,
    ...(data && { ...data }),
    data: data || response.data
  }

  if (type === 'error') return {
    success: false,
    status: r.status || r.code || 0,
    statusText: 'ERROR',
    message: r.message,
    error: r.error || r.message,
    data: null
  }

  return {
    success: r.success ?? true,
    status: r.status || 200,
    statusText: r.statusText,
    message: r.message,
    data: r.data as T,
    error: null
  }
}