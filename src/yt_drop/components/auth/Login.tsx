import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/api.service";
import { useAuthCtx } from "../../context/AuthContext";

interface LoginProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const Login = ({ setError }: LoginProps) => {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const [isShowPass, setIsShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [keyPressed, setkeyPressed] = useState('');

  const { setUser, setLoggedIn } = useAuthCtx();
  const navigate = useNavigate();

  async function onLogin() {
    setError('');

    if (!data.username || !data.password) {
      setError('Completa todos los campos');
      return;
    }

    setIsLoading(true);

    const r = await apiService.login(data);

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
      onLogin();
    }
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin();
      }}
      id="form-login"
    >
      <div className="form-group">
        <label className="form-label">Usuario</label>
        <input
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onKeyDown={(e) => setkeyPressed(e.key)}
          className="form-input"
          id="l-user"
          placeholder="tu_usuario"
          autoComplete="username"
          type="text"
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
            id="l-pass"
            type={isShowPass ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            style={{
              paddingRight: '44px',
            }}
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
            <svg id="eye-l" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      <button
        className="btn-submit"
        disabled={isLoading}
        type="submit"
        id="btn-login"
      >
        {!isLoading
          ? 'Entrar'
          : <span className="spinner"></span>
        }
      </button>
    </form>
  )
}

export default Login;