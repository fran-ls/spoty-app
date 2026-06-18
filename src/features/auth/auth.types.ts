export interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string | null;
}

export interface UserDTO {
  email: string;
  password: string;
  username: string;
}

export type AuthData = AuthTokens & {
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  // refreshToken: string;
}