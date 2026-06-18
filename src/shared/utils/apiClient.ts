import { tokenService } from "../../features/auth/services/token.service";
import { envs } from "./envs";
import { Fetchy } from "./client";

class ApiFetch extends Fetchy {
  public BASE_URL: string = envs.API_URL;

  private config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }

  async get<T>(url: string, headers: Record<string, string> = {}) {
    const token = tokenService.getToken();

    return await this.petition<T>(`${this.BASE_URL}${url}`, {
      ...this.config,
      method: 'GET',
      headers: {
        ...this.config.headers,
        ...headers,
        ...(token && {
          Authorization: `Bearer ${token}`,
        })
      }
    });
  }

  async post<T>(url: string, body: any = undefined, headers = this.config.headers) {
    const token = tokenService.getToken();

    return await this.petition<T>(`${this.BASE_URL}${url}`, {
      ...this.config,
      method: 'POST',
      headers: {
        ...this.config.headers,
        ...headers,
        ...(token && {
          Authorization: `Bearer ${token}`,
        })
      },
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async put<T>(url: string, body: any = undefined, headers = this.config.headers) {
    const token = tokenService.getToken();

    return await this.petition<T>(`${this.BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        ...this.config.headers,
        ...headers,
        ...(token && {
          Authorization: `Bearer ${token}`,
        })
      },
      body: body ? JSON.stringify(body) : body
    });
  }

  async patch<T>(url: string, body: any = undefined, headers = this.config.headers) {
    const token = tokenService.getToken();

    return await this.petition<T>(`${this.BASE_URL}${url}`, {
      method: 'PATCH',
      headers: {
        ...this.config.headers,
        ...headers,
        ...(token && {
          Authorization: `Bearer ${token}`,
        })
      },
      body: body ? JSON.stringify(body) : body
    });
  }

  async delete<T>(url: string, body: any = undefined, headers?: Record<string, string>) {
    const token = tokenService.getToken();

    return await this.petition<T>(`${this.BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        ...this.config.headers,
        ...headers,
        ...(token && {
          Authorization: `Bearer ${token}`,
        })
      },
      body: body ? JSON.stringify(body) : body
    });
  }
}

export const apiFetch = new ApiFetch();