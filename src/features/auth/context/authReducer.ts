import type { AuthState, AuthAction } from "./types";

export const initialState: AuthState = {
  user: null,
  status: 'checking',
  isProfile: false
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
        ...state,
        status: 'authenticated',
        user: {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          photoURL: action.payload.photoURL,
          role: action.payload.role
        },
        errorMessage: undefined,
      }

    case 'logout':
      return {
        ...state,
        user: null,
        status: 'not-authenticated',
        errorMessage: action.payload?.errorMessage
      }

    case 'profile':
      return {
        ...state,
        isProfile: !state.isProfile
      }

    default:
      return state;
  }
}