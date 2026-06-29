import { useEffect, useState } from "react";
import { DiscIcon, ImageUpIcon, InfoIcon, SearchIcon, UserIcon, XIcon } from "lucide-react";
import type { Artist } from "../artist.types";
import type { Album, AlbumDTO } from "../album.types";
import ArtistSelect from "./ArtistSelect";
import useToaster from "../../../shared/hooks/useToaster";
import albumService from "../services/album.service";
import SmartImage from "../../../shared/components/SmartImage";
import useArtist from "../hooks/useArtist";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Toaster from "../../../shared/components/Toaster";

const coverUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYvobAjd42bG0K_tSQaLfpvHNVFxAgAo-R3C-Ei4Kt_Yv5hU3N5ZTiobLniGnjhECkh1cNd5Fxabf0_pYKOLXmc7j6nfXGGCmopV179tIFexWEB4uJgxST-FFKTU846GKkpwDoWI20uSxTYklnUxOH5FTz4MtgY3NDxPYpbPeukvjtc5Rcy0vu-iMgJfPwvBGUIKYLecfP8xmgOzImY2LRW15GagQZ5oD824sAUXCQRZfc7uG8l01yStM71Dl76Y3YCyhC0ZxEg2JM';

interface AlbumFormProps {
  artists: Artist[];
  isLoadMore: boolean;
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  setIsPanel2Open: React.Dispatch<React.SetStateAction<boolean>>;
  loadMoreArtists: () => void;
}

const AlbumForm = (props: AlbumFormProps) => {
  const { artists, isLoadMore, setAlbums, loadMoreArtists, setIsPanel2Open } = props;
  const { artists: artistSearch, artistMeta: searchArtistMeta, searchArtists } = useArtist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const [page, setPage] = useState(0);
  const filters = {
    name: searchQuery.trim(),
    limit: 10,
    page: 0
  }

  const { loaderRef } = useInfiniteScroll(() => {
    if (!searchArtistMeta.hasNextPage) return;
    searchArtists({ ...filters, page: page + 1 });
    setPage(page + 1);
  });

  const { isActive, toast, isFirstLoad, showToast, onClose } = useToaster(5000);
  const [isLoading, setIsLoading] = useState(false);

  const [isImgHover, setIsImgHover] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [option, setOption] = useState({
    label: 'Seleccionar',
    value: ''
  });

  const [form, setForm] = useState<AlbumDTO>({
    title: '',
    cover: '',
    file: null,
    artistName: '',
    artistId: ''
  });
  const imageUrl = form.cover || fileUrl || coverUrl;

  const onFormChange = (field: keyof AlbumDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
  }

  async function onSave() {
    if (isLoading) return;
    setIsLoading(true);

    const { data, error, errorMessage } = await albumService.newAlbum(form);
    setIsLoading(false);

    const err = error?.response?.data?.message;

    if (err || error || !data) {
      showToast({
        message: err || errorMessage || 'Ocurrió un error',
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

    setAlbums((prev) => [data, ...prev]);

    showToast({
      message: 'Álbum guardado',
      type: 'success',
      icon: (
        <DiscIcon
          className="min-w-5 stroke-2"
          size={20}
        />
      )
    });
  }

  useEffect(() => { setTimeout(() => searchArtists(filters), 300) }, [searchQuery]);

  return (
    <div className="relative overflow-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="p-5 min-h-full h-[calc(100vh-73px)] flex flex-col gap-5 animate-fade-in overflow-y-auto panel-wrap"
      >
        <div>
          <h3 className="text-sm font-bold text-white mb-1">
            Registrar Nuevo Álbum
          </h3>
          <p className="text-[10px] text-gray-400">
            Registra un álbum discográfico de un artista existente.
          </p>
        </div>

        <div className="text-center pb-4 border-b border-white/5">
          <div
            className="bg-white/5 w-28 h-28 rounded-xl overflow-hidden border border-white/10 mx-auto shadow-2xl relative mb-3.5"
            onPointerEnter={() => setIsImgHover(true)}
            onMouseLeave={() => setIsImgHover(false)}
          >
            <SmartImage
              wrapClassName="w-full h-full bg-white/5 mx-auto shadow-2xl relative mb-3.5"
              url={imageUrl}
              icon={(
                <DiscIcon className="w-[30%] h-[30%] text-gray-400" />
              )}
            />

            {isImgHover &&
              <label className={`${imageUrl ? 'bg-black/50 text-white' : 'bg-[#2f2f2f] text-gray-400'} p-1 w-full h-full absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center justify-center cursor-pointer transition-all gap-1.5 text-center`}>
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

          <h3 className="text-xs text-primary font-bold mt-1">
            {form.title || 'Álbum Musical'}
          </h3>
          <p className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
            {form.artistName || 'Artista'}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
            Título del Álbum
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            required
            placeholder="ej. Random Access Memories, Discovery"
            className="text-[13px] w-full bg-[#202020] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
              Artista del Álbum
            </label>
            <button
              onClick={() => setIsSearch(true)}
              className="cursor-pointer text-[9px] p-0.5 font-bold text-primary hover:underline transition-all flex items-center gap-0.5 outline-none"
              title="Buscar artista"
              type="button"
            >
              <SearchIcon size={14} />
            </button>
          </div>

          <ArtistSelect
            option={option}
            items={artists}
            isLoadMore={isLoadMore}
            bgColor="#202020"
            loadMore={loadMoreArtists}
            payload={(option) => {
              const item = option.item;

              setOption({
                label: item?.name || 'Seleccionar',
                value: option.value
              });

              setForm({
                ...form,
                artistId: option.value,
                artistName: item?.name || ''
              });
            }}
          />
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex gap-3 justify-end">
          <button
            onClick={() => setIsPanel2Open(false)}
            className="cursor-pointer px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider"
            type="button"
          >
            Cancelar
          </button>
          <button
            className={`${isLoading ? 'cursor-default' : 'cursor-pointer'} w-35.75 bg-primary text-black font-black uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl flex items-center justify-center hover:scale-102 transition-all shadow-md shadow-primary/10`}
            type="submit"
          >
            {!isLoading
              ? 'Registrar Álbum'
              : <div className="tex-center w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            }
          </button>
        </div>
      </form>

      <section
        style={{ boxShadow: '0px 0px 5px 2px #0e0e0e' }}
        className={`${isSearch ? 'translate-y-0' : 'translate-y-[100vh]'} h-100 p-5 text-gray-400 bg-[#181818] overflow-hidden w-full z-50 transition duration-150 absolute bottom-0 right-0`}
      >
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm">
              Buscar artista
            </h2>

            <button
              onClick={() => setIsSearch(false)}
              className="p-1 cursor-pointer"
              type="button"
            >
              <XIcon size={20} />
            </button>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <SearchIcon size={14} />
            </span>
            <input
              className="w-full bg-[#181818] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-500 outline-none transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              placeholder="Buscar por nombre, artista..."
              type="search"
            />
          </div>
        </div>

        <div className="mt-4 overflow-y-auto max-h-66 search-widget-content">
          {artistSearch.map((art) => (
            <div
              onClick={() => {
                setOption({
                  label: art.name,
                  value: art.id
                });

                setForm({
                  ...form,
                  artistId: art.id,
                  artistName: art.name
                });

                setIsSearch(false);
              }}
              className="hover:bg-white/5 cursor-pointer p-2 flex items-center gap-3" key={art.id}
            >
              <SmartImage
                wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0"
                url={null}
                icon={<UserIcon size={16} />}
              />

              <div className="overflow-hidden flex flex-col gap-1">
                <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                  {art.name}
                </p>
                <span className="text-[9px] text-gray-400 font-mono">
                  {art.id}
                </span>
              </div>
            </div>
          ))}

          {searchArtistMeta.hasNextPage &&
            <div
              className="bg-[#202020] flex items-center justify-center overflow-hidden"
              ref={loaderRef}
            >
              <Loader
                className="border-transparent border-t-slate-200"
                size={20}
                stroke={2}
              />
            </div>
          }
        </div>
      </section>

      <Toaster
        onClose={onClose}
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        {...toast}
      />
    </div>
  )
}

export default AlbumForm;