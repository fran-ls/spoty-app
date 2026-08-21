import { useState } from 'react';
import { Music, User as UserIcon, LogIn, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import "../../../assets/css/toaster.css";
import Toaster from '../../../shared/components/Toaster';
import useAuth from '../hooks/useAuth';

const AuthPage: React.FC = () => {
  const {
    form, toast, isActive, isFirstLoad, loading,
    setForm, login, register, onCloseToast
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isHidePass, setIsHidePass] = useState(true);

  const inputs = [
    {
      isHide: isLogin,
      label: 'Nombre de usuario',
      placeholder: 'Tu alias',
      value: form.username,
      name: 'username',
      required: !isLogin,
      icon: <UserIcon size={16} />
    },
    {
      label: 'Correo',
      value: form.email,
      placeholder: 'jane@gmail.com',
      name: 'email',
      type: 'email',
      icon: <MailIcon size={16} />
    },
    {
      label: 'Contraseña',
      value: form.password,
      placeholder: '••••••••',
      name: 'password',
      type: 'password',
      icon: <LockIcon size={16} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#090909] bg-linear-to-br from-[#121212] via-[#050505] to-black flex flex-col justify-center items-center px-4 relative select-none overflow-hidden" id="auth-screen-root">
      <Toaster
        title={toast.title}
        message={toast.message}
        isActive={isActive}
        isFirstLoad={isFirstLoad}
        onClose={onCloseToast}
        type="error"
      />

      {/* Background ambient decorative shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-700/5 blur-[120px] pointer-events-none animate-pulse duration-7000" />

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Brand Logo Header */}
        <div className="hidden items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_10px_30px_rgba(28,184,83,0.3)] border border-white/10">
            <Music
              className="text-black"
              strokeWidth={3}
              size={24}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-1.5 leading-none">
              SoundUp
            </h1>
            <span className="text-[10px] font-mono tracking-widest text-primary font-black uppercase">
              Web Player
            </span>
          </div>
        </div>

        <div className="w-full bg-[#121212]/75 border border-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)]" id="auth-form-card">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <p className="text-xs text-[#adaaaa] mt-1.5">
              {isLogin ? 'Disfruta de tus canciones, álbumes y playlists' : 'Regístrate gratis para comenzar a escuchar'}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              isLogin ? login(form) : register(form);
            }}
            className="space-y-4"
          >
            <div className="space-y-4 overflow-auto input-wrap">
              {inputs.map((input) => (
                <div
                  className={`${!input.isHide ? 'block' : 'hidden'} space-y-1.5 relative`}
                  key={input.name}
                >
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#adaaaa] font-bold">
                    {input.label}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#adaaaa] group-focus-within:text-white transition-colors">
                      {input.icon}
                    </div>

                    <input
                      className={`w-full bg-[#181818] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:ring-primary focus:border-primary text-white placeholder:text-[#adaaaa]/60 outline-none transition-all ${input.type === 'password' ? 'pr-10 pass-input' : ''}`}
                      onChange={(e) => setForm({ ...form, [input.name]: e.target.value })}
                      name={input.name}
                      value={input.value}
                      placeholder={input.placeholder}
                      required={input.required ?? true}
                      type={input.type === 'password' && !isHidePass ? 'text' : input.type || 'text'}
                    />

                    {input.type === 'password' &&
                      <button
                        onClick={() => setIsHidePass(!isHidePass)}
                        className="text-[#909090] cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                        type="button"
                      >
                        {isHidePass ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                      </button>
                    }
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-55 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_15px_rgba(28,184,83,0.15)] mt-6"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {isLogin ? 'Entrar' : 'Registrarse'}
                  </span>
                  <LogIn size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Tab Footer */}
          <div className="mt-8 text-center text-xs">
            <span className="text-[#adaaaa]">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </span>{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-bold"
            >
              {isLogin ? 'Registrarse' : 'Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage;