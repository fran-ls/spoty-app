export interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string | null;
  role: Role;
}

export type Role = 'USER' | 'ADMIN' | 'ADMIN-MEMBER';

export interface UserDTO {
  email: string;
  password: string;
  username: string;
  photoURL?: string | null;
  file?: File | null;
}

export type AuthData = AuthTokens & {
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  // refreshToken: string;
}