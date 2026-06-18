import type { PaginationMeta } from "../types/common.types";
import { envs } from "./envs";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  init?: RequestInit;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export interface HttpResponse<T = any> {
  success: boolean;
  status: number;
  data: T | null;
  meta?: PaginationMeta;
  message?: string;
  error?: string | null;
  errors?: Record<string, string>[];
}

interface UploadOptions {
  url: string;
  file: File | Blob;
  fieldName?: string;
  extraData?: Record<string, any>;
  headers?: Record<string, string>;
}

export class Fetchy {
  private headers: Record<string, string> = {};
  public BASE_URL: string = envs.API_URL;

  private async request<T>(options: RequestOptions): Promise<HttpResponse<T>> {
    const { init, url, method, headers = {}, body } = options;

    const config: RequestInit = init ? init : {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    }

    try {
      const response: Response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const data = (
        contentType?.includes('application/json')
          ? await response.json()
          : await response.text()
      );

      return {
        success: data.success,
        status: response.status,
        data: data.data,
        ...(data.meta && { meta: data.meta }),
        message: data.message,
        error: data.error,
        ...(data.errors && { errors: data.errors }),
      }
    } catch (err: any) {
      return {
        success: false,
        status: 0,
        data: null,
        error: err.message || 'Unexpected error'
      }
    }
  }

  async petition<T>(url: string, init: RequestInit = {}) {
    return this.request<T>({
      url,
      method: init?.method || 'GET' as any,
      headers: init?.headers || {} as any,
      body: init.body,
      init
    });
  }

  async get<T>(url: string, headers = this.headers): Promise<HttpResponse<T>> {
    return this.request<T>({
      url: !this.BASE_URL ? url : `${this.BASE_URL}${url}`,
      method: 'GET',
      headers,
    })
  }

  async post<T>(url: string, body: any = {}, headers = this.headers) {
    return this.request<T>({
      url: !this.BASE_URL ? url : `${this.BASE_URL}${url}`,
      method: 'POST',
      headers,
      body
    })
  }

  async put<T>(url: string, body: any = {}, headers = this.headers) {
    return this.request<T>({
      url: !this.BASE_URL ? url : `${this.BASE_URL}${url}`,
      method: 'PUT',
      headers,
      body
    })
  }

  async patch<T>(url: string, body: any = {}, headers = this.headers) {
    return this.request<T>({
      url: !this.BASE_URL ? url : `${this.BASE_URL}${url}`,
      method: 'PATCH',
      headers,
      body
    })
  }

  async delete<T>(url: string, headers = this.headers) {
    return this.request<T>({
      url: !this.BASE_URL ? url : `${this.BASE_URL}${url}`,
      method: 'DELETE',
      headers,
    })
  }

  async upload<T>(options: UploadOptions): Promise<HttpResponse<T>> {
    const { url, file, fieldName = 'file', extraData = {}, headers = this.headers } = options;

    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      Object.entries(extraData).forEach(([key, value]) => formData.append(key, value));

      const response: Response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();

      if (!response.ok) return {
        success: false,
        status: response.status,
        data: null,
        error: JSON.stringify(data)
      }

      return {
        success: true,
        status: response.status,
        data
      }
    } catch (err: any) {
      return {
        success: false,
        status: 0,
        data: null,
        error: err.message || 'Unexpected error'
      }
    }
  }
}

const fetchy = new Fetchy();
export default fetchy;