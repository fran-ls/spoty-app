import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EllipsisIcon, ListIcon, MusicIcon, PenIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import type { Playlist, PlaylistDTO } from '../playlist.types';
import LayoutMenu from '../components/LayoutMenu';
import ActionMenu from '../components/ActionMenu';
import EditData from '../components/EditData';
import BackgroundColor from '../components/BackgroundColor';
import apiService from '../../../shared/services/api.service';
import { fileToDataURL } from '../../../shared/utils/fileToDataURL';
import { routes } from '../../../shared/utils/routes';
import DeleteConfirm from '../components/DeleteConfirm';

const NewPlaylistPage: React.FC = () => {
  const [currentCover, setCurrentCover] = useState<string | null>(null);
  const [gradientColor, setGradientColor] = useState('#121212');
  const [bgColor, setBgColor] = useState('#3a3a3a');
  const [isPublic, setIsPublic] = useState(false);
  const [form, setForm] = useState<PlaylistDTO>({
    name: '',
    description: '',
    cover: '',
    isPublic,
    gradientColor,
    bgColor,
    userId: '',
    file: null
  });

  const [isBackground, setIsBackground] = useState(false);
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [isSearch, _setIsSearch] = useState(true);
  const [query, setQuery] = useState('');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    file && fileToDataURL(file).then((url) => {
      setForm({ ...form, file, cover: url });
    });
  }

  const onSetForm = (data: Playlist) => {
    setForm({
      ...form,
      ...data,
      description: data.description || '',
      cover: data.cover || ''
    });

    setBgColor(data.bgColor);
    setGradientColor(data.gradientColor);
    setIsPublic(data.isPublic);
    setCurrentCover(data.cover);
  }

  const getPlaylist = async () => {
    if (!playlistId) return;

    const r = await apiService.getPlaylist(playlistId);

    if (r.status === 404) {
      navigate(routes.home);
      return;
    }

    if (r.data) {
      onSetForm(r.data);
    }
  }

  const onSavePlaylist = async (values: PlaylistDTO = form, isNew = false) => {
    if (isNew) {
      const r = await apiService.newPlaylist({
        ...values,
        name: values.name.trim(),
        description: values.description.trim()
      });

      return r.data;
    }

    if (!playlistId) return null;

    const r = await apiService.updatePlaylist(playlistId, {
      ...values,
      name: values.name.trim(),
      description: values.description.trim()
    });

    if (r.status === 200 && r.data) {
      onSetForm(r.data);
    }

    return r.data;
  }

  const onRemovePlaylist = async () => {
    if (!playlistId) return;
    const { data } = await apiService.removePlaylist(playlistId);

    if (data?.id) {
      navigate(routes.home);
    }
  }

  useEffect(() => { getPlaylist() }, [playlistId]);

  return (
    <div className="min-h-full text-white select-none animate-fade--in bg-surface">
      <div
        style={{
          background: `linear-gradient(to bottom, ${bgColor} 0%, ${gradientColor || '#121212'} 100%)`,
        }}
        className="p-6 flex items-center gap-6"
      >
        <div
          onPointerEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-[925px]:min-w-58 min-[925px]:min-h-58 w-[25vw] h-[25vw] min-w-[25vw] min-h-[25vw] rounded bg-[#262626] overflow-hidden relative"
        >
          {form.cover ?
            <img
              className="object-cover w-full h-full"
              src={form.cover}
              alt=""
            />
            :
            <MusicIcon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-1/2" />
          }

          {isHover &&
            <>
              <button
                onClick={() => coverInputRef.current?.click()}
                className={`${form.cover ? 'bg-black/50' : 'bg-[#262626]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
                type="button"
              >
                <PenIcon className="w-10 h-10" />
                <span>Elegir foto</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setForm({
                    ...form,
                    file: null,
                    cover: currentCover ? currentCover : ''
                  });
                }}
                className="hover:text-white bg-black w-7 h-7 rounded-full flex flex-col items-center gap-1 justify-center absolute top-3 right-3"
                type="button"
              >
                <EllipsisIcon className="w-5 h-5" />
              </button>
            </>
          }

          <input
            onChange={onFileChange}
            ref={coverInputRef}
            className="hidden"
            accept="image/*"
            name="cover"
            type="file"
          />
        </div>

        <div className="mt-auto w-full">
          <span className="block text-sm font-medium">
            Lista {isPublic ? 'pública' : 'privada'}
          </span>
          <h1
            onClick={() => setIsEdit(true)}
            className="playlist-title google-sans-flex-font font-black cursor-pointer"
            title={form.name}
          >
            {form.name}
          </h1>

          <div className="mt-2 flex items-center">
            <button
              className="bg-[#ffffff36] p-1 rounded-full"
              type="button"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <a href="#">
              <span className="text-sm ml-2 font-bold">
                Fran Lemus
              </span>
            </a>
          </div>
        </div>
      </div>

      <div
        className="p-6 space-y-6 relative"
        style={{
          background: `linear-gradient(to bottom, ${gradientColor} 0%, #0e0e0e 100%)`,
        }}
      >
        <div className="text-sm text-[#adaaaa] flex items-center justify-between relative">
          <div className="relative">
            <button
              onClick={() => setIsOpenAction(!isOpenAction)}
              className="h-8 px-2 hover:text-white cursor-pointer"
              type="button"
            >
              <EllipsisIcon className="w-8 h-8" />
            </button>

            {isOpenAction &&
              <ActionMenu
                isPublic={isPublic}
                onIsEdit={() => {
                  setIsEdit(true);
                  setIsOpenAction(false);
                  setIsBackground(false);
                  setIsRemove(false);
                }}
                onIsBackground={() => setIsBackground(!isBackground)}
                onChangeVisibility={() => {
                  onSavePlaylist({ ...form, isPublic: !isPublic })
                }}
                onClose={() => setIsOpenAction(!isOpenAction)}
                onRemove={() => {
                  setIsEdit(false);
                  setIsOpenAction(false);
                  setIsBackground(false);
                  setIsRemove(true);
                }}
              />
            }
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="font-semibold hover:text-white cursor-pointer h-8 px-2 flex items-center gap-2"
              type="button"
            >
              <span>Lista</span>
              <ListIcon className="inline-flex w-5 h-5" />
            </button>

            {isOpen &&
              <LayoutMenu onClose={() => setIsOpen(!isOpen)} />
            }
          </div>
        </div>

        {isSearch &&
          <>
            <div className="h-px bg-white/10" />

            <div className="my-4">
              <label className="my-3 text-[22px] font-bold block" htmlFor="query">
                Encontremos algo para tu lista
              </label>
              <div className="text-[#adaaaa] px-3 py-2.5 text-sm w-full max-w-82 bg-[#1f1f1f] gap-2 flex items-center rounded">
                <SearchIcon className="min-w-5 w-5 h-5" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full min-h-full"
                  placeholder="Buscar canciones"
                  name="query"
                  type="text"
                />
                {query &&
                  <button
                    onClick={() => setQuery('')}
                    type="button"
                  >
                    <XIcon className="min-w-5 w-5 h-5" />
                  </button>
                }
              </div>
            </div>
          </>
        }
      </div>

      {isBackground &&
        <BackgroundColor
          bgColor={bgColor}
          gradientColor={gradientColor}
          isBackground={isBackground}
          setBgColor={setBgColor}
          setGradientColor={setGradientColor}
          onClose={() => setIsBackground(false)}
          onSave={async () => {
            const data = await onSavePlaylist({ ...form, bgColor, gradientColor });
            if (data?.id) setIsBackground(false);
          }}
        />
      }

      {isEdit &&
        <EditData
          form={form}
          isPublic={isPublic}
          currentCover={currentCover}
          setForm={setForm}
          onChangeVisibility={() => {
            onSavePlaylist({ ...form, isPublic: !isPublic })
          }}
          coverInputRef={coverInputRef}
          onSave={() => onSavePlaylist()}
          onClose={() => setIsEdit(false)}
        />
      }

      {isRemove &&
        <DeleteConfirm
          isOpen={isRemove}
          playlistName={form.name}
          onClose={() => setIsRemove(false)}
          onConfirm={onRemovePlaylist}
        />
      }
    </div>
  )
}

export default NewPlaylistPage;