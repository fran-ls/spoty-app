import type { AuthTokens } from "../auth.types";
import { api, ApiResponse, type ApiRes } from "../../../shared/utils/api";

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

  async refreshAccessToken(): ApiRes<AuthTokens> {
    try {
      const res = await api.post('/auth/refresh');
      const r = ApiResponse<AuthTokens>('success', res);

      if (r.status === 409) {
        r.success = true;
        return r;
      }

      if (!r.success) return r;

      const { data } = r;

      if (data && data.accessToken) {
        this.setToken(data.accessToken);
      }

      return r;
    } catch (err) {
      return ApiResponse('error', err);
    }
  }
}

export const tokenService = new TokenService();