import { useEffect } from "react";
import "../assets/css/auth.css";
import useAuth from "../hooks/useAuth";
import { AppIcon } from "../components/shared/Icons";

const AuthPage = () => {
  const {
    tab, data, isLoading, error, isFocus, keyPressed, isShowPass, isShowConfirmPass,
    switchTab, setData, setIsFocus, setkeyPressed, togglePassword, onAuthFetch
  } = useAuth();

  const isRegister = tab === 'register';

  useEffect(() => {
    if (isFocus && keyPressed.toLowerCase() === 'enter') {
      onAuthFetch();
    }
  }, []);

  return (
    <div className="yt-drop-auth-wrap">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="login-wrap">
        <div className="logo">
          <div className="logo-icon">
            <AppIcon />
          </div>
          <span>YTDrop</span>
        </div>
        <p className="tagline">
          Descarga videos y audios de YouTube
        </p>

        <div className="card">
          <div className="tabs">
            <button
              onClick={() => switchTab('login')}
              className={`${tab === 'login' ? 'active' : ''} tab`}
              id="tab-login"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`${isRegister ? 'active' : ''} tab`}
              id="tab-register"
            >
              Registrarse
            </button>
          </div>

          <div className={`error-msg ${error ? 'show' : ''}`} id="error-box">
            {error}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAuthFetch();
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
                    placeholder={isRegister ? 'nuevo_usuario' : 'tu_usuario'}
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
                      placeholder={isRegister ? 'Mín. 6 caracteres' : '••••••••'}
                      autoComplete="new-password"
                    />
                    <button
                      onClick={() => togglePassword('pass')}
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

                {isRegister && (
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
                        onClick={() => togglePassword('confirm')}
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
                )}
              </div>
            </div>

            <button
              className="btn-submit"
              type="submit"
              id="btn-register"
            >
              {!isLoading
                ? (isRegister ? 'Crear cuenta' : 'Entrar')
                : <span className="spinner"></span>
              }
            </button>
          </form>

          <p className="hint">
            Admin por defecto → <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage;