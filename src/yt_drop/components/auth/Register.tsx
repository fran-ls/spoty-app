import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/api.service";
import { useAuthCtx } from "../../context/AuthContext";

interface RegisterProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const Register = ({ setError }: RegisterProps) => {
  const [data, setData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isShowPass, setIsShowPass] = useState(false);
  const [isShowConfirmPass, setIsShowRepeatPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [keyPressed, setkeyPressed] = useState('');

  const { setUser, setLoggedIn } = useAuthCtx();
  const navigate = useNavigate();

  async function onRegister() {
    setError('');

    if (!data.username || !data.password || !data.confirmPassword) {
      setError('Completa todos los campos');
      return;
    }

    if (data.password.trim().length < 6) {
      setError('La contraseña es muy corta');
      return;
    }

    if (data.password.trim() !== data.confirmPassword.trim()) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    const r = await apiService.register(data);

    if (r.status === 409) {
      setError('El usuario ya está en uso');
      setIsLoading(false);
      return
    }

    if (r.data?.username) {
      const { data } = await apiService.getProfile();
      setLoggedIn(true); // quitar

      if (data && data.logged_in) {
        setUser(r.data);
        setLoggedIn(true);
        navigate('/');
      }
    }

    if (r.error) {
      setError(r.error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (isFocus && keyPressed.toLowerCase() === 'enter') {
      onRegister();
    }
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onRegister();
      }}
      id="form-register"
    >
      <div className="form-wrap">
        <div className="form-input-wrap">
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onKeyDown={(e) => setkeyPressed(e.key)}
              className="form-input"
              id="r-user"
              type="text"
              placeholder="nuevo_usuario"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrap">
              <input
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onKeyDown={(e) => setkeyPressed(e.key)}
                className="form-input"
                style={{ paddingRight: '44px' }}
                id="r-pass"
                type={isShowPass ? 'text' : 'password'}
                placeholder="Mín. 6 caracteres"
                autoComplete="new-password"
              />
              <button
                onClick={() => setIsShowPass(!isShowPass)}
                className="toggle-pw"
                style={{
                  color: isShowPass ? 'var(--accent)' : ''
                }}
                tabIndex={-1}
                type="button"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <div className="input-wrap">
              <input
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onKeyDown={(e) => setkeyPressed(e.key)}
                className="form-input"
                style={{ paddingRight: '44px' }}
                id="r-pass2"
                type={isShowConfirmPass ? 'text' : 'password'}
                placeholder="Repite la contraseña"
                autoComplete="new-password"
              />
              <button
                onClick={() => setIsShowRepeatPass(!isShowConfirmPass)}
                className="toggle-pw"
                style={{
                  color: isShowConfirmPass ? 'var(--accent)' : ''
                }}
                tabIndex={-1}
                type="button"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn-submit"
        type="submit"
        id="btn-register"
      >
        {!isLoading
          ? 'Crear cuenta'
          : <span className="spinner"></span>
        }
      </button>
    </form>
  )
}

export default Register;