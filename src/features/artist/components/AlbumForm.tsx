import { useState } from "react";
import { DiscIcon, ImageUpIcon, SearchIcon, UserIcon } from "lucide-react";
import type { Album, AlbumDTO } from "../album.types";
import ArtistSelect from "./ArtistSelect";
import useToaster from "../../../shared/hooks/useToaster";
import albumService from "../services/album.service";
import SmartImage from "../../../shared/components/SmartImage";
import useArtist from "../hooks/useArtist";
import Toaster from "../../../shared/components/Toaster";
import useApiFetch from "../../../shared/hooks/useApiFetch";
import SearchWidget, { type WidgetSearch } from "../../../shared/components/SearchWidget";
import { images } from "../../../shared/data/images.data";

interface AlbumFormProps {
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  setIsPanel2Open: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlbumForm = (props: AlbumFormProps) => {
  const { setAlbums, setIsPanel2Open } = props;
  const { artists, artistMeta, searchArtists } = useArtist();
  const { isActive, toast, isFirstLoad, showToast, onClose } = useToaster(5000);
  const useApi = useApiFetch(showToast);

  const [isImgHover, setIsImgHover] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [form, setForm] = useState<AlbumDTO>({
    title: '',
    cover: '',
    file: null,
    artistName: '',
    artistId: ''
  });
  const imageUrl = form.cover || fileUrl || images.cover;

  const [isSearchWidget, setIsSearchWidget] = useState(false);
  const [search, setSearch] = useState<WidgetSearch>({
    query: '',
    page: 0
  });
  const [option, setOption] = useState({
    label: 'Seleccionar',
    value: ''
  });

  const onFormChange = (field: keyof AlbumDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    onFormChange('file', file);
  }

  async function loadMoreSearchArtists(query: string, page: number) {
    await searchArtists({
      name: query,
      limit: 10,
      page
    });
  }

  const loadMoreArtists = async (query: string, page: number, isSelect = false) => {
    await searchArtists({
      name: query,
      limit: 10,
      page
    });

    if (isSelect) setSearch({ ...search, page: page + 1 });
  }

  async function onSaveAlbum() {
    const config = {
      message: 'Álbum guardado',
      icon: (
        <DiscIcon
          className="min-w-5 stroke-2"
          size={20}
        />
      )
    }

    useApi.save<Album>(() => albumService.newAlbum(form), config)
      .then((data) => data && setAlbums((prev) => [data, ...prev]));
  }

  return (
    <div className="relative overflow-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveAlbum();
        }}
        className="p-5 flex flex-col gap-5 animate-fade-in upload-panel-wrap"
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

          <h3 className="text-xl text-primary font-bold mt-1">
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
              onClick={() => setIsSearchWidget(true)}
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
            isLoadMore={artistMeta.hasNextPage}
            bgColor="#202020"
            loadMore={() => loadMoreArtists(search.query, search.page, true)}
            payload={({ value, label, item }) => {
              setOption({
                label: label || 'Seleccionar',
                value: value
              });

              setForm({
                ...form,
                artistId: value,
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
            className={`${useApi.isSaveLoading ? 'cursor-default' : 'cursor-pointer'} w-35.75 bg-primary text-black font-black uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl flex items-center justify-center hover:scale-102 transition-all shadow-md shadow-primary/10`}
            type="submit"
          >
            {!useApi.isSaveLoading
              ? 'Registrar Álbum'
              : <div className="tex-center w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            }
          </button>
        </div>
      </form>

      <SearchWidget
        keys={{
          label: 'name',
          value: 'id',
          sub: 'id'
        }}
        label="Buscar artista"
        open={isSearchWidget}
        items={artists}
        meta={artistMeta}
        isLoadMore={artistMeta.hasNextPage}
        loadMore={loadMoreSearchArtists}
        onClose={() => setIsSearchWidget(false)}
        payload={({ value, label, item, search: sq }) => {
          setSearch(sq);

          setOption({
            value: value,
            label: label || 'Seleccionar'
          });

          setForm({
            ...form,
            artistId: value,
            artistName: item?.name || ''
          });
        }}
        loadIcon={() => (
          <SmartImage
            wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0"
            url={null}
            icon={<UserIcon size={16} />}
          />
        )}
      />

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