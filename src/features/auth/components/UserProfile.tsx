import { useEffect, useRef, useState } from "react";
import { CameraIcon, CircleXIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import type { UserDTO } from "../auth.types";
import useAuth from "../hooks/useAuth";
import { fileToDataURL } from "../../../shared/utils/fileToDataURL";
import { authService } from "../services/auth.service";

const UserProfile = () => {
  const { user, isProfile, dispatch, showProfile } = useAuth();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [isHover, setIsHover] = useState(false);
  const [isHidePass, setIsHidePass] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<UserDTO>>({
    email: user?.email || '',
    username: user?.username || '',
    photoURL: null,
  });

  const splitName = user?.username?.split(' ') || [];
  const username = splitName[0]?.[0].toUpperCase() + (splitName[1]?.[0].toUpperCase() || '');
  const image = authService.userImage(user?.id!);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const f = e.target.files?.[0];

    if (f) {
      setFile(f);
      fileToDataURL(f).then((url) => setForm({ ...form, photoURL: url }));
    }
  }

  async function onSave() {
    if (!user || !user?.id) return;

    const r = await authService.update(user.id, { ...form, file });
    const data = r.data;

    if (data && data.id) {
      showProfile();
      dispatch({
        type: 'login',
        payload: {
          ...data, photoURL: authService.userImage(data.id)
        }
      });
    }
  }

  const onClose = () => {
    showProfile();
    setForm({ ...user!, photoURL: image });
  }

  useEffect(() => { image && setForm({ ...form, photoURL: image }) }, []);

  return (!isProfile ? <></> :
    <>
      <div
        onClick={onClose}
        className="z-100 w-full flex items-center justify-center min-h-screen bg-black/50 fixed top-0 left-0"
      />

      <div className="z-100 w-full flex items-center justify-center min-h-screen absolute top-0 left-0">
        <div className="text-white rounded-2xl w-full max-w-md bg-[#212121]">
          <h1 className="p-3 pl-4 text-lg">
            Editar perfil
          </h1>

          <div className="p-4">
            <div
              className={`${form.photoURL ? '' : 'bg-primary'} cursor-pointer text-black w-32 h-32 rounded-full mx-auto mb-10 flex items-center justify-center relative`}
              onClick={() => inputFileRef.current?.click()}
              onPointerEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {!form.photoURL
                ?
                <span className="text-5xl">
                  {username}
                </span>
                :
                <img
                  className="w-full h-full object-cover rounded-full border-0"
                  crossOrigin="use-credentials"
                  src={form.photoURL}
                  alt="Avatar"
                />
              }

              {isHover && form.photoURL &&
                <button
                  className="bg-black/50 w-full h-full rounded-full p-2 cursor-pointer flex items-center justify-center absolute top-1/2 left-1/2 -translate-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setForm({ ...form, photoURL: image || null });
                  }}
                >
                  <CircleXIcon className="text-white" size={28} />
                </button>
              }

              <button
                className="bg-[#212121] rounded-full border border-[#3e3e3e] p-1.25 cursor-pointer absolute bottom-2 right-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  inputFileRef.current?.click();
                }}
                onPointerOver={() => setIsHover(false)}
              >
                <CameraIcon className="text-[#adaaaa]" size={16} />
              </button>

              <input
                className="hidden" type="file"
                onChange={onFileChange}
                ref={inputFileRef}
              />
            </div>

            <div className="space-y-2">
              <div className="focus-within:border-white p-3 text-sm border border-[#3e3e3e] rounded-md">
                <label className="text-xs block">
                  Nombre de usuario
                </label>
                <input
                  className="w-full"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Usuario"
                  value={form.username}
                  type="text"
                />
              </div>

              <div className="focus-within:border-white p-3 text-sm border border-[#3e3e3e] rounded-md">
                <label className="text-xs block">
                  Correo electrónico
                </label>
                <input
                  className="w-full"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Correo"
                  value={form.email}
                  type="email"
                />
              </div>

              <div className="focus-within:border-white p-3 text-sm border border-[#3e3e3e] rounded-md relative">
                <label className="text-xs block">
                  Nueva contraseña
                </label>
                <input
                  className="w-[calc(100%-28px)] pass-input"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Contraseña"
                  value={form.password}
                  type={isHidePass ? 'password' : 'text'}
                />

                <button
                  onClick={() => setIsHidePass(!isHidePass)}
                  className="text-[#909090] cursor-pointer absolute bottom-3 right-3"
                  type="button"
                >
                  {isHidePass ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                </button>
              </div>

              <div className="flex mt-5 gap-3 text-sm">
                <button
                  onClick={onClose}
                  className="hover:bg-[#262626] border border-[#3e3e3e] ml-auto cursor-pointer text-white font-semibold py-1.5 px-3 rounded-full"
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={onSave}
                  className="cursor-pointer bg-white text-black font-semibold py-1.5 px-3 rounded-full"
                  type="button"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile;