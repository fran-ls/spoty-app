import { CalendarIcon, ClockIcon, CloudUpload, DiscIcon, EllipsisIcon, ImageIcon, Music2Icon, MusicIcon, PenIcon, Trash2Icon, UserIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { Song, SongDTO } from "../song.types";
import songService from "../services/song.service";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import { formatTime } from "../../../shared/utils/formatTime";
import SmartImage from "../../../shared/components/SmartImage";

interface TrackModalProps {
  activeTrack: Song | null;
  onClose: () => void;
  onUpdateSong: (song: SongDTO) => Promise<void>;
}

const TrackModal = (props: TrackModalProps) => {
  const { activeTrack, onClose, onUpdateSong } = props;

  const [isImgHover, setIsImgHover] = useState(false);
  const [isActions, setIsActions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [fileUrl, setFileUrl] = useState('');
  const [form, setForm] = useState<SongDTO>({
    artistName: activeTrack?.artist?.name || '',
    title: activeTrack?.title || '',
    audio: null,
    quality: '',
    cover: songService.songCoverUrl(activeTrack?.id!, activeTrack?.cover) || null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cover = fileUrl || form.cover || '';

  return (
    <div className="bg-black/50 flex items-center justify-center z-100 fixed min-h-screen w-full top-0 left-0">
      <div className="text-[#adaaaa] py-3 bg-[#212121] w-full max-w-105 rounded-2xl">
        <header className="px-6 py-3 flex items-center gap-3 justify-between">
          <h1 className="text-xl font-bold">
            Información de la canción
          </h1>
          <button
            onClick={() => onUpdateSong(form)}
            className="hover:bg-[#3e3e3e] ml-auto rounded-full p-1.5"
            title="Guardar cambios"
            type="button"
          >
            <CloudUpload size={20} />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-[#3e3e3e] rounded-full p-1"
            title="Cerrar"
            type="button"
          >
            <XIcon />
          </button>
        </header>

        <SmartImage
          url={cover}
          wrapClassName="bg-[#3e3e3e] mx-auto my-2 w-50 h-50 rounded"
        />

        <div
          className="hidden bg-[#3e3e3e] mx-auto my-2 w-50 h-50 rounded overflow-hidden relative"
          onPointerEnter={() => setIsImgHover(true)}
          onMouseLeave={() => {
            setIsImgHover(false);
            setIsActions(false);
          }}
        >
          {cover
            ?
            <img
              className="w-full h-full object-cover"
              src={cover}
              crossOrigin="anonymous"
              alt=""
            />
            :
            <MusicIcon
              className="absolute top-1/2 left-1/2 -translate-1/2"
              size={50}
            />
          }

          {isImgHover &&
            <button
              onClick={() => setIsActions(!isActions)}
              className="bg-black text-white hover:bg-[#3e3e3e] ml-auto rounded-full p-1.5 absolute top-2 right-2"
              type="button"
            >
              <EllipsisIcon size={20} />
            </button>
          }

          {isActions && isImgHover &&
            <div className="bg-black w-40 p-2 absolute top-12 right-2 rounded">
              <button
                onClick={() => {
                  setForm({ ...form, coverFile: null });
                  setFileUrl('');
                }}
                className="w-full hover:bg-[#3e3e3e] flex items-center gap-2 p-1"
                type="button"
              >
                <Trash2Icon size={20} />
                <span>Quitar foto</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full hover:bg-[#3e3e3e] flex items-center gap-2  p-1"
                type="button"
              >
                <ImageIcon size={20} />
                <span>Cambiar foto</span>
              </button>
              <input
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setForm({ ...form, coverFile: f });
                    setFileUrl(URL.createObjectURL(f));
                  }
                }}
                ref={fileInputRef}
                className="hidden"
                type="file"
              />
            </div>
          }
        </div>

        <div className="p-6 pb-4 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="w-full flex items-center justify-between gap-2">
              <Music2Icon size={20} />

              {!isEdit
                ?
                <h2
                  className="w-full text-lg font-bold line-clamp-1"
                  title={form.title}
                >
                  {form.title}
                </h2>
                :
                <input
                  className="w-full text-lg font-bold border-b border-[#424242]"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  value={form.title}
                  type="text"
                />
              }
            </div>

            <button
              onClick={() => setIsEdit(!isEdit)}
              className={`${isEdit ? 'text-primary' : ''} p-1`}
              type="button"
            >
              <PenIcon size={20} />
            </button>
          </div>

          <div className="mt-4 w-full flex items-center justify-between gap-2">
            <UserIcon size={20} />

            {!isEdit
              ?
              <span
                className="w-full text-sm line-clamp-1"
                title={form.artistName}
              >
                {form.artistName}
              </span>
              :
              <input
                className="w-full text-sm border-b pb-1 border-[#424242]"
                onChange={(e) => setForm({ ...form, artistName: e.target.value })}
                value={form.artistName}
                type="text"
              />
            }
          </div>
        </div>

        <div className="px-6 py-3  space-y-1 flex items-center gap-2">
          <DiscIcon size={20} />
          <span className="text-sm">
            Álbum
          </span>
          <span className="text-sm ml-auto">
            The Fame
          </span>
        </div>

        <div className="px-6 py-3  space-y-1 flex items-center gap-2">
          <ClockIcon size={20} />
          <span className="text-sm">
            Duración
          </span>
          <span className="text-sm ml-auto">
            {formatTime(activeTrack?.duration || 0)}
          </span>
        </div>

        <div className="px-6 py-3 space-y-1 flex items-center gap-2">
          <CalendarIcon size={20} />
          <span className="text-sm">
            Publicada
          </span>
          <span className="text-sm ml-auto">
            {getFmtDate(activeTrack?.createdAt!, 'dd MMM yyyy')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TrackModal;