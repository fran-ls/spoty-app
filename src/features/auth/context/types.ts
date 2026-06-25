import type { User } from "../auth.types";

export type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  errorMessage?: string;
  isProfile: boolean;
  isUploadModal: boolean;
}

export type AuthAction =
  | { type: 'checking' }
  | { type: 'profile' }
  | {
    type: 'login';
    payload: User;
  }
  | {
    type: 'logout';
    payload?: { errorMessage?: string }
  }
  | {
    type: 'upload',
    payload?: { isActive: boolean }
  }