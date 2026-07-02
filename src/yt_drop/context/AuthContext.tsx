import { useEffect, useState, createContext, type ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/auth.type";
import { apiService } from "../api/api.service";

interface AuthCtx {
  user: User | null;
  loggedIn: boolean;
  authUserIsAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthCtx>({
  user: null,
  loggedIn: false,
  authUserIsAdmin: false,
  setUser: () => { },
  setLoggedIn: () => { },
});

export const AuthUserProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User | null>({
    username: 'Frank',
    role: 'admin',
  });
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  const navigate = useNavigate();

  const getAuthUser = async () => {
    return;
    const r = await apiService.getProfile();
    setLoggedIn(r.data?.logged_in ?? false);

    if (r.data.logged_in) {
      navigate('/');
    }
  }

  useEffect(() => { getAuthUser() }, []);

  return (
    <AuthContext.Provider value={{
      user, setUser, loggedIn, setLoggedIn,
      authUserIsAdmin: user?.role === 'admin',
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthCtx = () => {
  const ctx = useContext(AuthContext);
  return ctx;
}