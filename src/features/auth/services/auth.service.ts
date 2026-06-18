import type { HttpResponse } from "../../../shared/utils/client";
import type { AuthData, User, UserDTO } from "../auth.types";
import { apiFetch } from "../../../shared/utils/apiClient";
import { tokenService } from "./token.service";

class AuthService {
  async register(user: UserDTO) {
    const response = await apiFetch.post<AuthData>('/auth/register', user);

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
    const response = await apiFetch.post<AuthData>('/auth/login', {
      email, password
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
    const response = await apiFetch.post<null>('/auth/logout');

    if (response.success) {
      tokenService.clearToken();
    }

    return response;
  }

  async logoutAll() {
    const response = await apiFetch.post<null>('/auth/logout-all');

    if (response.success) {
      tokenService.clearToken();
    }

    return response;
  }

  async logoutAllByEmail(email: string) {
    const response = await apiFetch.post<null>('/auth/logout-all/email', { email });

    if (response.success) {
      tokenService.clearToken();
    }

    return response;
  }

  async getProfile(): Promise<HttpResponse<User>> {
    const auth = await tokenService.refreshAccessToken();

    const resp = {
      success: auth.success,
      status: auth.status,
      data: null,
      message: auth.message,
      error: auth.error
    }

    if (auth.status === 0) return resp;

    if (auth.status === 401 || auth.status === 400) {
      await this.logout();
    }

    if (!auth.success) return resp;

    const response = await apiFetch.get<User>('/auth/me');
    if (response.status === 0) return response;

    if (response.error || response.errors || !response.success) {
      response.message = 'Not authenticated';
    }

    return response;
  }
}

export const authService = new AuthService();