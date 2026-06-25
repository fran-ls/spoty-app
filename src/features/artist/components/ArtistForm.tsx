import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import type { ArtistDTO } from "../artist.types";

interface ArtistFormProps {
  form: ArtistDTO;
  iPanel2Open: boolean;
  setForm: React.Dispatch<React.SetStateAction<ArtistDTO>>;
  setIsPanel2Open: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArtistForm = (props: ArtistFormProps) => {
  const { form, setForm, setIsPanel2Open } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileUrl, setFileUrl] = useState<string>('');

  const onFormChange = (field: keyof ArtistDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="min-h-full flex flex-col gap-5 animate-fade-in"
    >
      <div>
        <h3 className="text-sm font-bold text-white mb-1">Registrar Perfil de Artista</h3>
        <p className="text-[10px] text-gray-400">Crea una ficha para poder asignar canciones y álbumes.</p>
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
          Foto de Perfil
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-white/10 hover:border-primary/40 bg-[#1e1e1e] hover:bg-[#222] rounded-xl py-6 flex flex-col items-center justify-center cursor-pointer transition-all gap-1.5 px-4 text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
          />
          <ImageIcon className="text-gray-500" size={20} />
          <span className="text-xs text-gray-200 font-bold">
            {fileUrl ? 'Modificar avatar' : 'Subir foto del artista'}
          </span>
          <span className="text-[9px] text-gray-500">Resolución cuadrada para círculo</span>
        </div>
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
          className="bg-primary text-black font-black uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl hover:scale-102 transition-all shadow-md shadow-primary/10"
          type="submit"
        >
          Registrar Perfil
        </button>
      </div>
    </form>
  )
}

export default ArtistForm;