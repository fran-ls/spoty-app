import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiService } from "../api/api.service";

type TabT = 'login' | 'register';

const useAuth = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const { setUser, setLoggedIn } = authCtx;

  const [tab, setTab] = useState<TabT>('login');
  const [data, setData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [isShowPass, setIsShowPass] = useState(false);
  const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isFocus, setIsFocus] = useState(false);
  const [keyPressed, setkeyPressed] = useState('');

  function switchTab(tab: TabT) {
    setTab(tab)
    setError('');
  }

  function togglePassword(input: 'pass' | 'confirm' = 'pass') {
    if (input === 'pass') {
      setIsShowPass(!isShowPass);
    }
    else if (input === 'confirm') {
      setIsShowConfirmPass(!isShowConfirmPass);
    }
  }

  function validateRegister() {
    if (data.password.trim().length < 6) {
      setError('La contraseña es muy corta');
      return false;
    }

    if (data.password.trim() !== data.confirmPassword.trim()) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  }

  async function onAuthFetch() {
    const isRegister = tab === 'register';

    if (!data.username || !data.password || (isRegister && !data.confirmPassword)) {
      setError('Completa todos los campos');
      return;
    }

    if (isRegister) {
      const ok = validateRegister();
      if (!ok) return;
    }

    setError('');
    setIsLoading(true);

    let r = await apiService.auth(isRegister, data);
    setIsLoading(false);

    if (!isRegister && r.status === 401) {
      setError('Credenciales inválidas');
      return
    }

    if (r.status === 409) {
      setError('El usuario ya está en uso');
      return
    }

    if (r.error) {
      setError(r.error);
      return;
    }

    if (!r.data?.username) return;

    r = await apiService.getProfile();

    if (r.data && r.data.logged_in) {
      setUser(r.data);
      setLoggedIn(true);
      navigate('/');
    }
  }

  return {
    ...authCtx,
    isShowPass, isShowConfirmPass,
    tab, setTab,
    data, setData,
    isLoading, setIsLoading,
    error, setError,
    isFocus, setIsFocus,
    keyPressed, setkeyPressed,
    switchTab, togglePassword,
    onAuthFetch,
  }
}

export default useAuth;