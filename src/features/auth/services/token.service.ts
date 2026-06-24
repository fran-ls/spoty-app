import type { AuthTokens } from "../auth.types";
import { api, apiFetch } from "../../../shared/utils/api";

class TokenService {
  private accessToken: string | null = null;

  getToken() {
    return this.accessToken;
  }

  setToken(token: string) {
    this.accessToken = token;
  }

  clearToken() {
    this.accessToken = null;
  }

  async refreshAccessToken() {
    const r = await apiFetch<AuthTokens>(() => {
      return api.post('/auth/refresh');
    });

    r.success = false;

    if (r.status === 409) {
      r.success = true;
    }

    const { data } = r;

    if (data && data.accessToken) {
      this.setToken(data.accessToken);
      r.success = true;
    }

    return r;
  }
}

export const tokenService = new TokenService();