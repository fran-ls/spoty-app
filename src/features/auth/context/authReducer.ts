import type { AuthState, AuthAction } from "./types";

export const initialState: AuthState = {
  status: 'checking',
  user: null
}

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'checking':
      return {
        ...state,
        status: 'checking',
        errorMessage: undefined,
      }

    case 'login':
      return {
        status: 'authenticated',
        user: {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          photoURL: action.payload.photoURL,
        },
        errorMessage: undefined,
      }

    case 'logout':
      return {
        user: null,
        status: 'not-authenticated',
        errorMessage: action.payload?.errorMessage
      }

    default:
      return state;
  }
}