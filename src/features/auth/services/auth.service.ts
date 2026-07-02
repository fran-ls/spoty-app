import type { AuthData, User, UserDTO } from "../auth.types";
import { tokenService } from "./token.service";
import { api, apiFetch } from "../../../shared/utils/api";
import { envs } from "../../../shared/utils/envs";

class AuthService {
  async register(user: UserDTO) {
    const response = await apiFetch<AuthData>(() => {
      return api.post('/auth/register', user);
    });

    if (response.status === 401) {
      response.error = 'Not authenticated';
      response.message = 'Inicia sesión';
      return response;
    }
    if (response.status === 409) {
      response.error = 'Email already exists';
      response.message = 'El correo no está disponible';
      return response;
    }
    else if (response.status === 429) {
      response.error = 'Too many request';
      response.message = 'Demasiadas solicitudes, inténtelo de nuevo en 15 minutos';
      return response;
    }
    else if (response.status === 0) {
      response.message = 'Solicitud fallida';
      return response;
    }

    const { data } = response;

    if (data && data.accessToken) {
      tokenService.setToken(data.accessToken);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await apiFetch<AuthData>(() => {
      return api.post('/auth/login', { email, password });
    });

    if (response.status === 401) {
      response.error = 'Invalid credentials';
      response.message = 'Credenciales inválidas';
      return response;
    }
    else if (response.status === 400) {
      response.error = 'Validation error';
      response.message = 'Ingresa un correo válido';
      return response;
    }

    const { data } = response;

    if (data && data.accessToken) {
      tokenService.setToken(data.accessToken);
    }

    return response;
  }

  async logout() {
    const response = await apiFetch<null>(() => {
      return api.post('/auth/logout');
    });

    if (response.success) {
      tokenService.clearToken();
    }

    return response;
  }

  async logoutAll() {
    const response = await apiFetch<null>(() => {
      return api.post('/auth/logout-all');
    });

    if (response.success) {
      tokenService.clearToken();
    }

    return response;
  }

  async logoutAllByEmail(email: string) {
    const response = await apiFetch<null>(() => {
      return api.post('/auth/logout-all/email', { email });
    });

    if (response.success) {
      tokenService.clearToken();
    }

    return response;
  }

  async getProfile(): Promise<User | null> {
    const auth = await tokenService.refreshAccessToken();

    if (auth.status === 0) {
      auth.success = false;
    }

    if (auth.status === 401 || auth.status === 400) {
      auth.success = false;
      // await this.logout();
    }

    if (!auth.success) return null;

    const response = await apiFetch<User>(() => {
      return api.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      });
    });

    if (response.status === 0) {
      response.success = false;
      return null;
    }

    if (response.error || response.errors || !response.success) {
      response.message = 'Not authenticated';
      response.success = false;
    }

    response.success = true;
    return response.data;
  }

  async update(id: string, user: Partial<UserDTO>) {
    const formData = new FormData();

    if (user.file) {
      formData.append('avatar', user.file);
    }

    for (const k in user) {
      const f = (user as any)[k];

      if (k !== 'file' && f) {
        formData.append(k, f);
      }
    }

    const response = await apiFetch<User>(() => {
      return api.put(`/users/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    });

    return response;
  }

  userImage(userId: string, url?: string | null) {
    if (!userId || !url || typeof url !== 'string') {
      return '';
    }
    if (!url.includes('/api/')) {
      return url || '';
    }
    return `${envs.API_URL}/users/image/${userId}`;
  }
}

export const authService = new AuthService();