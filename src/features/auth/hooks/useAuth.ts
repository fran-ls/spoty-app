import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserDTO } from "../auth.types";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import useToaster from "../../../shared/hooks/useToaster";
import { routes } from "../../../shared/utils/routes";
import playerService from "../../player/services/player.service";
import libraryService from "../../library/services/library.service";
import usePlayer from "../../player/hooks/usePlayer";

const useAuth = () => {
  const [form, setForm] = useState<UserDTO>({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { state, dispatch } = useContext(AuthContext)!;
  const { toast, isActive, isFirstLoad, showToast, setToast, setIsActive } = useToaster();
  const { resetPlayer } = usePlayer();

  const navigate = useNavigate();

  const validation = (data: any, fields: string, custom: string[] = []) => {
    const keys = fields.split(' ');
    const errs: Record<string, string> = {}

    keys.forEach((k, i) => {
      if (!data[k]) {
        const f = custom[i] ? custom[i] : k;
        errs[k] = `${f} es obligatorio`;
      }
    });

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }

    return true;
  }

  const register = async (data: UserDTO) => {
    const ok = validation(data, 'username email password', [
      'Nombre de usuario', 'Correo', 'Contraseña'
    ]);
    if (!ok) return;

    if (data.password.length < 8) return showToast({
      title: 'Mejora tu contraseña',
      message: 'Mínimo 8 caracteres para la contraseña',
      type: 'error'
    });
    else if (!/[A-Z]/.test(data.password)) return showToast({
      title: 'Mejora tu contraseña',
      message: 'La contraseña debe contener al menos una letra mayúscula',
      type: 'error'
    });
    else if (!/[0-9]/.test(data.password)) return showToast({
      title: 'Mejora tu contraseña',
      message: 'La contraseña debe contener al menos un número',
      type: 'error'
    });

    setLoading(true);
    const response = await authService.register(data);
    setLoading(false);

    if (!response.success) return showToast({
      title: 'Ocurrió un problema',
      message: response.message!,
      type: 'error'
    });

    const { user, accessToken } = response.data || {};
    if (!user || !accessToken) return;

    await libraryService.createLibrary({ userId: user.id });
    await playerService.createPlayer({ userId: user.id });

    dispatch({
      type: 'login',
      payload: user
    });

    navigate(routes.home);
  }

  const login = async (data: any) => {
    const ok = validation(data, 'email password', ['Correo', 'Contraseña']);
    if (!ok) return showToast({
      title: 'Llena los campos',
      message: 'Todos los campos son obligatorios',
      type: 'error'
    });

    setLoading(true);
    const response = await authService.login(data.email, data.password);
    setLoading(false);

    if (!response.success) return showToast({
      title: 'Ocurrió un problema',
      message: response.message!,
      type: 'error'
    });

    const user = response.data?.user;

    if (!user) {
      await logout();
      return;
    }

    dispatch({
      type: 'login',
      payload: user
    });

    navigate(routes.home);
  }

  const logout = async () => {
    resetPlayer();
    dispatch({ type: 'logout' });
    return await authService.logout();
  }

  const getProfile = async () => {
    dispatch({ type: 'checking' });

    const data = await authService.getProfile();

    if (!data) {
      dispatch({ type: 'logout' });
      return;
    }

    dispatch({
      type: 'login',
      payload: {
        id: data.id,
        email: data.email,
        username: data.username,
        photoURL: data.photoURL,
        role: data.role
      }
    });
  }

  const onCloseToast = () => setIsActive(false);

  const showProfile = () => {
    dispatch({ type: 'profile' });
  }

  return {
    ...state,
    isAdmin: state.user?.role === 'ADMIN',
    isActive,
    isFirstLoad,
    form, setForm,
    errors, setErrors,
    toast, setToast,
    loading, setLoading,
    onCloseToast,
    dispatch,
    register,
    login,
    logout,
    getProfile,
    showProfile
  }
}

export default useAuth;