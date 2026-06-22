import { useEffect, useRef, useState } from "react";
import { CircleXIcon, Music2Icon, PlusIcon, UploadIcon } from "lucide-react";
import { Toaster as SonnerToaster, toast } from 'sonner';
import type { SongDTO, SongFileUrls } from "../../song/song.types";
import type { Artist } from "../../song/artist.types";
import type { PaginationMeta } from "../../../shared/types/common.types";
import { CameraPlusIcon } from "../../../shared/components/Icons";
import songService from "../../song/services/song.service";
import { Player } from "./Player";
import artistService from "../../song/services/artist.service";
import ArtistSelect from "../../song/components/ArtistSelect";
import Select from "../../../shared/components/Select";

const SongForm = () => {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isNewArtist, setIsNewArtist] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [_artistMeta, setArtistMeta] = useState<PaginationMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [isImgHover, setIsImgHover] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<SongFileUrls>({
    audio: '',
    cover: ''
  });
  const [form, setForm] = useState<SongDTO>({
    title: '',
    artistName: '',
    audio: null,
    quality: '128',
    cover: ''
  });

  const cover = form.cover || previewUrls.cover || '';

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, fileField: 'audio' | 'coverFile', fileUrlField?: 'audio' | 'cover') => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    const urlField = fileUrlField || fileField;

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setForm({ ...form, [fileField]: file });
      setPreviewUrls({ ...previewUrls, [urlField]: fileUrl });
    }
  }

  async function onSave() {
    const r = await songService.uploadSong({ ...form, includeArtist: true });
    const data = r.data;

    if (data && data?.artist) {
      setArtists((prev) => [data.artist, ...prev]);

      toast(
        <div className="text-white bg-black flex items-center gap-2 p-2 pr-3 min-w-10 rounded">
          <div className="min-w-8 w-8 h-8 rounded overflow-hidden relative">
            <Music2Icon
              className="absolute top-1/2 left-1/2 -translate-1/2"
              size={16}
            />
          </div>
          <span>
            Subida exitosa
          </span>
        </div>
      );
    }
  }

  useEffect(() => {
    artistService.getArtists().then(({ data }) => {
      if (!data) return;
      setArtists(data.items);
      setArtistMeta(data.meta);
    });
  }, []);

  return (
    <section className="grid grid-cols-[280px_1fr] gap-12 form-section space-y-12" id="form-song">
      <div className="max-w-70 relative group aspect-square rounded-xl overflow-hidden bg-surface-container-highest border-2 border-dashed border-[#1a1a1a] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all">
        {(!form.cover || !form.coverFile) &&
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"
            data-alt="A stylized music album cover art featuring abstract geometric shapes and vibrant neon green lighting in a dark cinematic environment, consistent with a high-end music streaming app aesthetic. The visual style is editorial and modern."
            style={{
              backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuC_5ZIgEp5BnMLE-e3pGP6fedZuU-6LjucDTN0EIA1siNpekkjNTTEwpFEn4tjThHTlw3rM9sYeaUfpu_rgGJyMsN0aelqFVcP2YFkci61kLkQ7qn3rP7KGHfczemE78gVNRYCp-5cG5kIHa0olNjWFkwF9UPS6CD5NWFfZzPc8MD2fKXfZQUZBXJuWF-hnfWn9bYecDgHA6E1IZCRV-10rk6kz9iCqqs9ZwxY9_BteNknCf94VGNTbo8h6trpmR_gazUFpoWqlFE7V)"
            }}
          />
        }

        <div
          className="relative z-10 flex-1 w-full h-full flex items-center justify-center text-center"
          onClick={() => coverInputRef.current?.click()}
          onPointerEnter={() => setIsImgHover(true)}
          onMouseLeave={() => setIsImgHover(false)}
        >
          {cover ?
            <img
              className="w-full h-full object-cover"
              src={cover}
              alt=""
            /> :
            <CameraPlusIcon className="mb-2" size={40} />
          }

          {form.coverFile && isImgHover &&
            <button
              className="text-white bg-black/50 w-full h-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-1/2"
              onClick={(e) => {
                e.stopPropagation();
                // previewUrls.cover && URL.revokeObjectURL(previewUrls.cover);
                setPreviewUrls({ ...previewUrls, cover: '' });
                setForm({ ...form, coverFile: null });
              }}
              type="button"
            >
              <CircleXIcon size={28} />
            </button>
          }

          <input
            onChange={(e) => onFileChange(e, 'coverFile', 'cover')}
            ref={coverInputRef}
            className="hidden"
            accept="image/*"
            type="file"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 text-white w-full rounded-lg">
          <button
            onClick={() => audioInputRef.current?.click()}
            className="rounded-lg min-w-14 w-14 h-14 p-3 min-h-full flex gap-4 items-center justify-center bg-surface-container-low hover:bg-surface-container-highest transition-all cursor-pointer group"
            title="Subir MP3 o WAV"
          >
            <UploadIcon className="group-hover:text-primary min-w-5" size={20} />
            <span className="hidden text-center text-xs font-medium">
              Subir MP3 o WAV
            </span>
            <input
              onChange={(e) => onFileChange(e, 'audio')}
              ref={audioInputRef}
              className="hidden"
              accept="audio/*"
              type="file"
            />
          </button>

          <div className="min-w-35 bg-surface-container-low rounded-lg h-14 py-1 px-3">
            <label className="text-xs w-full">
              Calidad
            </label>

            <Select
              styles={{
                padding: 0,
                marginBottom: '8px'
              }}
              ulWrapStyles={{
                left: '-20%',
                width: '160px'
              }}
              selectedIndex={1}
              payload={(option) => setForm({ ...form, quality: option.value })}
              items={[
                { value: '320', label: '320 - Max' },
                { value: '192', label: '192 - Alta' },
                { value: '128', label: '128 - Normal' }
              ]}
            />
          </div>

          <Player
            file={form.audio}
            url={previewUrls.audio}
          />
        </div>

        <div className="space-y-4">
          <label className="text-white block text-sm font-bold text-on-surface">
            Título de la Canción
          </label>
          <input
            className="text-white w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 font-body transition-all"
            value={form.title}
            onChange={({ target }) => setForm({ ...form, title: target.value })}
            placeholder="Ej: Midnight Solitude"
            type="text"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4 relative">
            <label className="text-white block text-sm font-bold text-on-surface">
              Artista
            </label>

            <button
              className={`${isNewArtist ? '-rotate-45' : 'rotate-0'} duration-100 transition-transform absolute top-0 right-0 text-[#adaaaa]`}
              onClick={() => {
                setIsNewArtist(!isNewArtist);
                if (!isNewArtist) {
                  setForm({ ...form, artistName: '', artistId: '' })
                }
              }}
            >
              <PlusIcon size={20} />
            </button>

            {isNewArtist ?
              <input
                className="text-white w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 font-body transition-all"
                value={form.artistName}
                onChange={({ target }) => setForm({
                  ...form,
                  artistName: target.value,
                  artistId: ''
                })}
                placeholder="Ej: Lady Gaga"
                type="text"
              /> :
              <ArtistSelect
                items={artists}
                payload={(option) => {
                  const item = option.item;

                  setForm({
                    ...form,
                    artistId: option.value,
                    ...(item && { artistName: item.name })
                  });
                }}
              />
            }
          </div>

          <div className="space-y-4">
            <label className="text-white block text-sm font-bold text-on-surface">
              Álbum
            </label>
            <select
              className="text-white w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-1 focus:ring-primary/40 font-body transition-all appearance-none"
              value={form.albumId}
              onChange={({ target }) => setForm({ ...form, albumId: target.value })}
            >
              <option>Seleccionar Álbum</option>
              <option>Echoes of Light</option>
              <option>Single</option>
            </select>
          </div>
        </div>

        <div className="text-sm pt-8 flex justify-end gap-4">
          <button
            onClick={onSave}
            className="px-10 py-3 rounded-full bg-primary text-on-primary-container font-black shadow-xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all"
          >
            Guardar Canción
          </button>
        </div>
      </div>

      <SonnerToaster
        duration={5000}
        visibleToasts={1}
        position="top-center"
        toastOptions={{
          unstyled: true,
          style: { bottom: 80 }
        }}
      />
    </section>
  )
}

export default SongForm;