import { useRef, useState } from "react";
import { GlobeIcon, ImageIcon, LockIcon } from "lucide-react";
import type { PlaylistDTO } from "./playlist.types";

interface PlaylistFormProps {
}

const PlaylistForm = ({ }: PlaylistFormProps) => {
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PlaylistDTO>({
    name: '',
    description: '',
    cover: '',
    isPublic: false,
    gradientColor: '',
    bgColor: '',
    userId: '',
    file: null
  });

  const onFormChange = (field: keyof PlaylistDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-5 animate-fade-in"
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
          className="w-full bg-[#181818] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all"
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

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
          Imagen de Portada
        </label>
        <div
          onClick={() => coverInputRef.current?.click()}
          className="h-28 border border-dashed border-white/10 hover:border-primary/40 bg-[#161616] hover:bg-[#191919] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all gap-1.5 p-3 text-center"
        >
          <input
            type="file"
            ref={coverInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (form.cover) URL.revokeObjectURL(form.cover);

              if (file) {
                setForm({ ...form, file, cover: URL.createObjectURL(file) });
              }
            }}
            accept="image/*"
            className="hidden"
          />
          <ImageIcon className="text-gray-500" size={20} />
          <span className="text-[11px] text-gray-300 font-bold">
            {form.cover ? 'Modificar carátula' : 'Subir imagen de portada'}
          </span>
          <span className="text-[9px] text-gray-500">JPG, PNG formato cuadrado</span>
        </div>
      </div>

      {/* Privacy switch */}
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

      {/* Actions */}
      <div className="pt-4 border-t border-white/5 flex gap-3 justify-end">
        <button
          type="button"
          // onClick={() => resetFormValues('playlist')}
          className="px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-white transition-all outline-none"
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="bg-primary text-black font-black uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl hover:scale-102 active:scale-95 transition-all shadow-md shadow-primary/10"
        >
          Crear Playlist
        </button>
      </div>
    </form>
  )
}

export default PlaylistForm;