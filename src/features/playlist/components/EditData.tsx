import { useState } from "react";
import { EllipsisIcon, GlobeIcon, LockIcon, MusicIcon, PenIcon, XIcon } from "lucide-react";
import type { PlayListDTO } from "../playlist.types";

interface EditDataProps {
  form: PlayListDTO;
  isPublic: boolean;
  coverInputRef: React.RefObject<HTMLInputElement | null>
  setForm: React.Dispatch<React.SetStateAction<PlayListDTO>>;
  onChangeVisibility: () => void;
  onSavePlaylist: () => void;
  onClose: () => void;
}

const EditData = (props: EditDataProps) => {
  const {
    isPublic, form, coverInputRef, setForm,
    onChangeVisibility, onClose, onSavePlaylist
  } = props;

  const [isHover, setIsHover] = useState(false);

  const onFormChange = (field: keyof PlayListDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  return (
    <>
      <div className="bg-black/50 min-h-screen w-full fixed top-0 left-0 z-10" />

      <div className="bg-[#212121] p-6 rounded-lg w-full max-w-xl z-15 fixed top-1/2 left-1/2 -translate-1/2">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">
            Editar información
          </h1>
          <button
            onClick={onClose}
            className="hover:bg-[#3a3a3a] transition duration-100 p-1.5 rounded-full"
            type="button"
          >
            <XIcon className="text-[#adaaaa] w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div
            onPointerEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="text-[#adaaaa] font-medium text-center min-w-45 w-45 h-45 rounded bg-[#282828] overflow-hidden relative"
          >
            {form.cover ? (
              <img
                className="object-cover w-full h-full"
                src={form.cover}
                alt=""
              />
            ) : (
              <MusicIcon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-1/2" />
            )}

            {isHover && (
              <>
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className={`${form.cover ? 'bg-black/50' : 'bg-[#282828]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
                  type="button"
                >
                  <PenIcon className="w-8 h-8" />
                  <span>Elegir foto</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm({ ...form, file: null, cover: '' });
                  }}
                  className="hover:text-white bg-black w-7 h-7 rounded-full flex flex-col items-center gap-1 justify-center absolute top-2 right-2"
                  type="button"
                >
                  <EllipsisIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <div className="text-sm mt-1 w-full">
            <div className="mb-3.5 relative input-group">
              <input
                onChange={(e) => onFormChange('name', e.target.value)}
                value={form.name}
                className="w-full h-10 px-3 py-1 bg-[#3e3e3e] rounded border-white/20 focus:border focus:bg-transparent peer transition-all duration-100"
                placeholder="Añade un nombre"
                name="name"
                type="text"
                required
              />
              <label
                className="z-1 text-xs before:content-[''] before:w-14.25 before:h-2 before:absolute before:bg-[#212121] before:-z-1 before:left-0 before:top-0.5 w-[calc(100%-12px*2)] text-[#777] font-bold peer-focus:opacity-100 opacity-0 absolute -top-2 left-3 transition-all duration-100"
                htmlFor="name"
              >
                <span className="text-xs ml-1.25">Nombre</span>
              </label>
            </div>

            <div className="relative input-group">
              <textarea
                onChange={(e) => onFormChange('description', e.target.value)}
                value={form.description}
                className="w-full h-31 px-3 py-2 bg-[#3e3e3e] rounded resize-none border-white/20 focus:bg-transparent focus:border peer transition-all duration-100"
                placeholder="Añade una descripción opcional"
                name="description"
              />
              <label
                className="z-1 text-xs before:content-[''] before:w-20.25 before:h-2 before:absolute before:bg-[#212121] before:-z-1 before:left-0 before:top-0.5 w-[calc(100%-12px*2)] text-[#777] font-bold peer-focus:opacity-100 opacity-0 absolute -top-2 left-3 transition-all duration-100"
                htmlFor="name"
              >
                <span className="text-xs ml-1.25">Descripción</span>
              </label>
            </div>
          </div>
        </div>
        <div className="text-sm w-full mt-4 flex items-center gap-4">
          <button
            onClick={onChangeVisibility}
            className="hover:bg-[#3e3e3e] border-[#3e3e3e] border rounded-full transition-all duration-100 flex items-center gap-2 cursor-pointer px-4 py-2"
            type="button"
          >
            {!isPublic
              ? <GlobeIcon className="w-4 h-4" />
              : <LockIcon className="w-4 h-4" />
            }
            <span>
              {isPublic ? 'Hacer privada' : 'Hacer pública'}
            </span>
          </button>
          <button
            onClick={onSavePlaylist}
            className="text-black font-bold bg-white rounded-full px-4 py-2 ml-auto inline-block cursor-pointer"
            type="button"
          >
            Guardar
          </button>
        </div>
      </div >
    </>
  )
}

export default EditData;