import axios from "axios";
import { envs } from "./envs";

export const api = axios.create({
  baseURL: envs.API_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

interface ApiResponse<T> {
  success: boolean;
  status: number;
  statusText: string;
  data: T | null;
  message: string;
  errorMessage: string | null;
  error: any;
  errors?: any;
}

export type ApiRes<T> = Promise<ApiResponse<T>>;

export async function apiFetch<T = any>(callback: () => Promise<any>): ApiRes<T> {
  try {
    const response = await callback();
    const data = response.data?.data;

    const r = {
      ...response,
      ...(data && { ...data }),
      data: data || response.data
    }

    return {
      success: r.success ?? true,
      status: r.status || 200,
      statusText: r.statusText,
      message: r.message,
      data: r.data as T,
      errorMessage: null,
      error: null,
      ...(r.errors && { ...r.errors })
    }
  } catch (err: any) {
    return {
      success: false,
      status: err.status || err.code || 0,
      statusText: 'ERROR',
      data: null,
      message: err.message,
      errorMessage: err.message,
      error: err
    }
  }
}

export async function ApiResponse<T = any>(response: any): ApiRes<T> {
  const data = response.data?.data;

  const r = {
    ...response,
    ...(data && { ...data }),
    data: data || response.data
  }

  return {
    success: r.success ?? true,
    status: r.status || 200,
    statusText: r.statusText || r.success ? 'OK' : 'ERROR',
    message: r.message,
    data: r.data as T || null,
    errorMessage: r.errorMessage,
    error: r.error || null,
    ...(r.errors && { ...r.errors })
  }
}