import { useState } from "react";
import { ImageUpIcon, InfoIcon, UserIcon, UserRoundCheckIcon } from "lucide-react";
import type { Artist, ArtistDTO } from "../artist.types";
import useToaster from "../../../shared/hooks/useToaster";
import artistService from "../services/artist.service";
import SmartImage from "../../../shared/components/SmartImage";
import Toaster from "../../../shared/components/Toaster";

interface ArtistFormProps {
  setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  setIsPanel2Open: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArtistForm = (props: ArtistFormProps) => {
  const { setArtists, setIsPanel2Open } = props;

  const [isLoading, setIsLoading] = useState(false);
  const { isActive, toast, isFirstLoad, showToast, onClose } = useToaster(5000);

  const [isImgHover, setIsImgHover] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [form, setForm] = useState<ArtistDTO>({ name: '' });

  const cover = form.image || fileUrl || '';

  const onFormChange = (field: keyof ArtistDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(file);
    onFormChange('file', file);
    setFileUrl(url);
  }

  async function onSave() {
    if (isLoading) return;
    setIsLoading(true);

    const { data, error } = await artistService.newArtist(form);
    setIsLoading(false);

    if (error || !data) {
      showToast({
        message: error || 'Ocurrió un error',
        type: 'error',
        icon: (
          <InfoIcon
            className="min-w-5 stroke-2"
            size={20}
          />
        )
      });
      return;
    }

    setArtists((prev) => [data, ...prev]);

    showToast({
      message: 'Artista guardado',
      type: 'success',
      icon: (
        <UserRoundCheckIcon
          className="min-w-5 stroke-2"
          size={20}
        />
      )
    });
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="p-5 min-h-full flex flex-col gap-5 animate-fade-in"
      >
        <div>
          <h3 className="text-sm font-bold text-white mb-1">
            Registrar Perfil de Artista
          </h3>
          <p className="text-[10px] text-gray-400">
            Crea una ficha para poder asignar canciones y álbumes.
          </p>
        </div>

        <div className="text-center pb-4 border-b border-white/5">
          <div
            className="w-28 h-28 rounded-full border border-white/20 bg-white/5 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
            onPointerEnter={() => setIsImgHover(true)}
            onMouseLeave={() => setIsImgHover(false)}
          >
            <SmartImage
              wrapClassName="w-full h-full rounded-full bg-white/5 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
              url={cover}
              icon={(
                <UserIcon className="w-[30%] h-[30%] text-gray-400" />
              )}
            />

            {isImgHover &&
              <label className={`${cover ? 'bg-black/50 text-white' : 'bg-[#2f2f2f] text-gray-400'} p-1 w-full h-full absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center justify-center cursor-pointer transition-all gap-1.5 text-center`}>
                <input
                  type="file"
                  onChange={onFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <ImageUpIcon size={24} />
              </label>
            }
          </div>

          <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
            <span>{form?.name || 'Artista'}</span>
            <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[6px] font-black" title="Perfil Registrado">✓</span>
          </h3>
          <p className="text-[9px] font-mono uppercase tracking-wider text-primary font-bold mt-1">
            Artista Registrado
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
            Nombre del Artista
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            required
            placeholder="ej. Tame Impala, Daft Punk"
            className="w-full bg-[#202020] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
            Biografía / Historia
          </label>
          <textarea
            rows={4}
            value={form.bio || ''}
            onChange={(e) => onFormChange('bio', e.target.value)}
            placeholder="Escribe la trayectoria e historia del artista..."
            className="w-full bg-[#202020] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all resize-none"
          />
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex gap-3 justify-end">
          <button
            onClick={() => setIsPanel2Open(false)}
            className="px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider"
            type="button"
          >
            Cancelar
          </button>
          <button
            className={`w-36 bg-primary text-black font-black uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl hover:scale-102 transition-all shadow-md shadow-primary/10 flex items-center justify-center ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            type="submit"
          >
            {!isLoading
              ? 'Registrar Perfil'
              : <div className="tex-center w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            }
          </button>
        </div>
      </form>

      <Toaster
        onClose={onClose}
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        {...toast}
      />
    </>
  )
}

export default ArtistForm;