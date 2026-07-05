import { useRef, useState } from "react";
import { GlobeIcon, ListVideoIcon, LockIcon, MusicIcon, PaletteIcon, PenIcon, SearchIcon, UserIcon } from "lucide-react";
import type { Playlist, PlaylistDTO } from "../playlist.types";
import SmartImage from "../../../shared/components/SmartImage";
import Toaster from "../../../shared/components/Toaster";
import useToaster from "../../../shared/hooks/useToaster";
import playlistService from "../services/playlist.service";
import GradientEditor from "./PanelGradientEditor";
import useUser from "../../artist/hooks/useUser";
import UserSelect from "../../artist/components/UserSelect";
import SearchWidget from "../../../shared/components/SearchWidget";
import useApiFetch from "../../../shared/hooks/useApiFetch";
import { authService } from "../../auth/services/auth.service";
import type { User } from "../../auth/auth.types";

const PanelPlaylistForm = () => {
  const { users, userMeta, searchUsers } = useUser();
  const { isActive, toast, isFirstLoad, showToast, onClose } = useToaster(5000);
  const useApi = useApiFetch(showToast);

  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isBackground, setIsBackground] = useState(false);
  const [isImgHover, setIsImgHover] = useState(false);
  const [isBgHover, setIsBgHover] = useState(false);

  const [bgColor, setBgColor] = useState('#3a3a3a');
  const [gradientColor, setGradientColor] = useState('#121212');
  const [fileUrl, setFileUrl] = useState('');
  const [form, setForm] = useState<PlaylistDTO>({
    name: '',
    description: '',
    cover: '',
    isPublic: false,
    gradientColor,
    bgColor,
    userId: '',
    file: null
  });

  const gradientCSS = `linear-gradient(to bottom, ${bgColor} 0%, ${gradientColor} 50%, #121212 100%)`

  const onFormChange = (field: keyof PlaylistDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(file);

    setFileUrl(url);
    setForm({ ...form, file });
  }

  async function onSave() {
    const config = {
      message: 'Lista guardada',
      icon: (
        <ListVideoIcon
          className="min-w-5 stroke-2"
          size={20}
        />
      )
    }

    useApi.save<Playlist>(
      () => playlistService.newPlaylist({
        ...form, bgColor, gradientColor
      }), config);
  }

  const [isUserSearch, setIsUserSearch] = useState(false);
  const [userOption, setUserOption] = useState({
    label: 'Usuario',
    value: ''
  });

  const loadMoreUsers = async (query: string, page: number) => {
    const q = query.trim();

    await searchUsers({
      username: q,
      email: q,
      limit: 10,
      page
    });
  }

  return (
    <div className="overflow-hidden relative">
      <div className="animate-fade-in upload-panel-main-wrap">
        <div
          style={{
            background: gradientCSS
          }}
          className="px-5 py-7 flex flex-col items-center justify-center relative"
          onPointerEnter={() => setIsBgHover(true)}
          onMouseLeave={() => setIsBgHover(false)}
        >
          <div
            onPointerEnter={() => setIsImgHover(true)}
            onMouseLeave={() => setIsImgHover(false)}
            className="mb-2 w-40 h-40 rounded bg-[#262626] relative overflow-hidden"
          >
            <SmartImage
              wrapClassName="w-full h-full bg-white/5 mx-auto shadow-2xl relative"
              url={fileUrl}
              icon={(
                <MusicIcon className="w-[30%] h-[30%] text-gray-400" />
              )}
            />

            {isImgHover &&
              <button
                className={`${fileUrl ? 'bg-black/50' : 'bg-[#262626]'} text-sm hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
                onClick={() => coverInputRef.current?.click()}
                type="button"
              >
                <PenIcon className="w-8 h-8" />
                <span>Elegir foto</span>
              </button>
            }

            <input
              onChange={onFileChange}
              ref={coverInputRef}
              className="hidden"
              type="file"
            />
          </div>

          <div className="w-full">
            <span className="mt-1 text-gray-400 block text-xs text-center">
              {form.isPublic ? 'Pública' : 'Privada'}
            </span>

            <h1
              style={{
                fontSize: '36px'
              }}
              className="playlist-title mt-2 text-white text-center font-black google-sans-flex-font"
            >
              {form.name || 'Mi lista'}
            </h1>

            <div className="mt-1 text-sm text-slate-400 text-center">
              {userOption.label || 'Usuario'}
            </div>
          </div>

          {isBgHover &&
            <button
              onClick={() => setIsBackground(true)}
              className="absolute top-3 right-3 cursor-pointer p-2 rounded text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-white transition-all outline-none"
              title="Color de fondo"
              type="button"
            >
              <PaletteIcon size={22} />
            </button>
          }
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="p-5 pt-0 space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
              Nombre de la playlist
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              required
              placeholder="Escribe el nombre de la playlist"
              className="text-[13px] w-full bg-[#181818] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
              Descripción
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              placeholder="Agrega una descripción opcional"
              className="w-full bg-[#181818] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
              Privacidad
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onFormChange('isPublic', true)}
                className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-1 transition-all outline-none ${form.isPublic
                  ? 'border-primary bg-primary/5 text-white font-bold'
                  : 'border-white/5 bg-[#161616] text-gray-400 hover:bg-white/5'
                  }`}
              >
                <GlobeIcon size={13} className={form.isPublic ? 'text-primary' : ''} />
                <span className="text-[10px]">Pública</span>
              </button>
              <button
                type="button"
                onClick={() => onFormChange('isPublic', false)}
                className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-1 transition-all outline-none ${!form.isPublic
                  ? 'border-primary bg-primary/5 text-white font-bold'
                  : 'border-white/5 bg-[#161616] text-gray-400 hover:bg-white/5'
                  }`}
              >
                <LockIcon size={13} className={!form.isPublic ? 'text-primary' : ''} />
                <span className="text-[10px]">Privada</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
                Usuario
              </label>
              <button
                onClick={() => setIsUserSearch(true)}
                className="cursor-pointer text-[9px] p-0.5 font-bold text-primary hover:underline transition-all flex items-center gap-0.5 outline-none"
                title="Buscar usuario"
                type="button"
              >
                <SearchIcon size={14} />
              </button>
            </div>

            <UserSelect
              bgColor="#202020"
              option={userOption}
              items={users}
              isLoadMore={userMeta.hasNextPage}
              loadMore={() => loadMoreUsers}
              payload={(option) => {
                const item = option.item;

                setUserOption({
                  label: item?.username || 'Seleccionar',
                  value: option.value
                });

                setForm({
                  ...form,
                  userId: option.value
                });
              }}
            />
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-3 justify-end">
            <button
              className="cursor-pointer px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-white transition-all outline-none"
              type="button"
            >
              Limpiar
            </button>
            <button
              className={`${useApi.isSaveLoading ? 'cursor-default' : 'cursor-pointer'} min-w-33 bg-primary text-black font-black flex items-center justify-center uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl hover:scale-102 active:scale-95 transition-all shadow-md shadow-primary/10`}
              type="submit"
            >
              {!useApi.isSaveLoading
                ? 'Crear Playlist'
                : <div className="tex-center w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              }
            </button>
          </div>
        </form>
      </div>

      <Toaster
        onClose={onClose}
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        {...toast}
      />

      <GradientEditor
        isActive={isBackground}
        bgColor={bgColor}
        gradientColor={gradientColor}
        setBgColor={setBgColor}
        setGradientColor={setGradientColor}
        onClose={() => setIsBackground(false)}
        onSave={() => { }}
      />

      <SearchWidget
        keys={{
          label: 'username',
          value: 'id',
          sub: 'email'
        }}
        label="Buscar usuario"
        open={isUserSearch}
        items={users}
        meta={userMeta}
        isLoadMore={userMeta.hasNextPage}
        loadMore={loadMoreUsers}
        onClose={() => setIsUserSearch(false)}
        payload={(p) => {
          setUserOption({
            label: p.label,
            value: p.value
          });
          setForm({ ...form, userId: p.value });
        }}
        loadIcon={(user: User) => (
          <SmartImage
            wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0"
            url={authService.userImage(user.id, user?.photoURL)}
            icon={<UserIcon size={16} />}
          />
        )}
      />
    </div>
  )
}

export default PanelPlaylistForm;