import { createContext, useReducer, type ReactNode } from "react";
import { authReducer, initialState } from "./authReducer";
import type { AuthAction } from "./types";

interface AuthContextProps {
  state: typeof initialState;
  dispatch: React.ActionDispatch<[action: AuthAction]>
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}