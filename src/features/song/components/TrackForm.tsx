import { useRef, useState } from "react";
import { DiscIcon, FileAudioIcon, ImageUpIcon, InfoIcon, Music2Icon, PauseIcon, PlayIcon, PlusCircleIcon, SearchIcon, Trash2Icon, UploadIcon, UserIcon, XIcon } from "lucide-react";
import type { SongDTO, SongFileUrls } from "../song.types";
import type { Artist } from "../../artist/artist.types";
import type { Album } from "../../artist/album.types";
import { formatTime } from "../../../shared/utils/formatTime";
import { AudioPlayer, type AudioPlayerState } from "../../player/AudioPlayer";
import ArtistSelect from "../../artist/components/ArtistSelect";
import AlbumSelect from "../../artist/components/AlbumSelect";
import songService from "../services/song.service";
import Select from "../../../shared/components/Select";
import useToaster from "../../../shared/hooks/useToaster";
import Loader from "../../../shared/components/Loader";
import SmartImage from "../../../shared/components/SmartImage";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Toaster from "../../../shared/components/Toaster";

const coverUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYvobAjd42bG0K_tSQaLfpvHNVFxAgAo-R3C-Ei4Kt_Yv5hU3N5ZTiobLniGnjhECkh1cNd5Fxabf0_pYKOLXmc7j6nfXGGCmopV179tIFexWEB4uJgxST-FFKTU846GKkpwDoWI20uSxTYklnUxOH5FTz4MtgY3NDxPYpbPeukvjtc5Rcy0vu-iMgJfPwvBGUIKYLecfP8xmgOzImY2LRW15GagQZ5oD824sAUXCQRZfc7uG8l01yStM71Dl76Y3YCyhC0ZxEg2JM';

interface TrackFormProps {
  artists: Artist[];
  albums: Album[];
  isLoadMoreArtist: boolean;
  isLoadMoreAlbums: boolean;
  artistSearchQuery: string;
  albumSearchQuery: string;
  setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  setArtistSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setAlbumSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  loadMoreArtists: () => void;
  loadMoreAlbums: () => void;
  triggerCreateArtist: () => void;
  triggerCreateAlbum: () => void;
}

const TrackForm = (props: TrackFormProps) => {
  const {
    artists, albums, isLoadMoreArtist, isLoadMoreAlbums, artistSearchQuery, loadMoreAlbums,
    albumSearchQuery, loadMoreArtists, triggerCreateArtist, triggerCreateAlbum, setArtists,
    setArtistSearchQuery, setAlbumSearchQuery
  } = props;
  const { isActive, toast, isFirstLoad, showToast, onClose } = useToaster(5000);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const bgColor = '#181818';

  const [player, setPlayer] = useState<AudioPlayerState>({
    isPause: true,
    isPlaying: false,
    progress: 0,
    duration: 0,
    play: () => { },
    togglePlay: () => { }
  });

  const [isImgHover, setIsImgHover] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<SongFileUrls>({
    audio: '',
    cover: coverUrl
  });
  const [form, setForm] = useState<SongDTO>({
    title: '',
    artistName: '',
    albumName: '',
    audio: null,
    quality: '128',
    cover: ''
  });

  const [isArtistSearch, setIsArtistSearch] = useState(false);
  const [artistOption, setArtistOption] = useState({
    label: 'Seleccionar',
    value: ''
  });
  const [isAlbumSearch, setIsAlbumSearch] = useState(false);
  const [albumOption, setAlbumOption] = useState({
    label: 'Seleccionar',
    value: ''
  });

  const { loaderRef } = useInfiniteScroll(() => {
    if (!isLoadMoreArtist) return;
    loadMoreArtists();
  });

  const onFormChange = (field: keyof SongDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, fileField: 'audio' | 'coverFile', fileUrlField?: 'audio' | 'cover') => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    const urlField = fileUrlField || fileField;

    if (file) {
      const url = (previewUrls as any)[fileField];
      if (url) URL.revokeObjectURL(url);

      const fileUrl = URL.createObjectURL(file);
      setForm({ ...form, [fileField]: file });
      setPreviewUrls({ ...previewUrls, [urlField]: fileUrl });
    }
  }

  const onRemoveAudio = () => {
    if (previewUrls.audio) URL.revokeObjectURL(previewUrls.audio);

    setPreviewUrls({ ...previewUrls, audio: '' });
    onFormChange('audio', null);
    player.togglePlay();
  }

  async function onSave() {
    const { data, error } = await songService.uploadSong({ ...form, includeArtist: true });

    if (error || !data) {
      showToast({
        message: 'Ocurrió un error',
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

    if (data.artist) {
      setArtists((prev) => [data.artist, ...prev]);
    }

    showToast({
      message: 'Subida exitosa',
      type: 'success',
      icon: <Music2Icon size={16} />
    });
  }

  return (
    <div
      style={{ position: 'relative' }}
      className="relative overflow-hidden"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        style={{ position: 'relative' }}
        className="p-5 space-y-5 min-h-full h-[calc(100vh-73px-56px)] animate-fade-in overflow-y-auto relative panel-wrap"
      >
        <div className="text-center pb-4 border-b border-white/5">
          <div
            className="bg-white/5 w-28 h-28 rounded-xl overflow-hidden border border-white/10 mx-auto shadow-2xl relative mb-3.5"
            onPointerEnter={() => setIsImgHover(true)}
            onMouseLeave={() => setIsImgHover(false)}
          >
            <img
              src={previewUrls.cover}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />

            {isImgHover &&
              <label className={`${previewUrls.cover ? 'bg-black/50 text-white' : 'text-gray-400 bg-[#161616]'} p-1 w-full h-full absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center justify-center cursor-pointer transition-all gap-1.5 text-center`}>
                <input
                  type="file"
                  onChange={(e) => onFileChange(e, 'coverFile', 'cover')}
                  accept="image/*"
                  className="hidden"
                />
                <ImageUpIcon size={24} />
              </label>
            }
          </div>
          <h3 className="text-base font-black text-white leading-tight">
            {form?.title}
          </h3>
          <p className="text-xs text-primary font-bold mt-1">
            {form?.artistName || 'Canción'}
          </p>
          <p className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
            {form.albumName || 'Álbum Musical'}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
            Archivo de sonido
          </label>

          {!form.audio ? (
            <div
              onClick={() => audioInputRef.current?.click()}
              className="h-28 border border-dashed border-white/10 hover:border-primary/40 bg-[#161616] hover:bg-[#191919] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all gap-1.5 p-3 text-center"
            >
              <input
                type="file"
                ref={audioInputRef}
                onChange={(e) => onFileChange(e, 'audio', 'audio')}
                accept="audio/*"
                className="hidden"
              />
              <UploadIcon className="text-primary animate-pulse" size={20} />
              <span className="text-[11px] text-gray-300 font-bold">Seleccionar audio</span>
              <span className="text-[9px] text-gray-500">Archivos MP3, WAV, OGG, M4A</span>
            </div>
          ) : (
            <div className="bg-[#181818] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <FileAudioIcon size={15} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-white truncate leading-none">
                    {form.audio.name}
                  </p>
                  <span className="text-[9px] text-gray-400 font-mono mt-1 block">
                    {`${(form.audio.size / (1024 * 1024)).toFixed(2)} MB • ${formatTime(player.duration)}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-2">
                {!player.isPlaying &&
                  <button
                    onClick={() => player.togglePlay()}
                    className="hidden bg-primary hover:scale-103 active:scale-97 text-black font-black text-[9px] tracking-wide uppercase px-3 py-1.5 rounded-full items-center gap-1.5 transition-all outline-none"
                    type="button"
                  >
                    {player.isPlaying ? (
                      <>
                        <PauseIcon size={10} fill="black" />
                        <span>Detener</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon size={10} fill="black" />
                        <span>Escuchar</span>
                      </>
                    )}
                  </button>
                }

                {form.audio &&
                  <AudioPlayer
                    unstyled={true}
                    file={form.audio}
                    url={previewUrls.audio}
                    setPlayer={setPlayer}
                  />
                }

                <button
                  onClick={onRemoveAudio}
                  className="cursor-pointer ml-2 text-[10px] text-red-400 font-bold hover:underline hover:text-red-300 flex items-center gap-0.5"
                  title="Borrar audio"
                  type="button"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
            Título del Tema
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            required
            placeholder="Escribe el título de la canción"
            className="text-[13px] w-full bg-[#181818] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1 z-15">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
                Artista
              </label>

              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={triggerCreateArtist}
                  className="cursor-pointer text-[9px] font-bold text-primary hover:underline transition-all flex items-center gap-0.5 outline-none"
                  title="Nuevo artista"
                  type="button"
                >
                  <PlusCircleIcon size={14} />
                </button>
                <button
                  onClick={() => setIsArtistSearch(true)}
                  className="cursor-pointer text-[9px] p-0.5 font-bold text-primary hover:underline transition-all flex items-center gap-0.5 outline-none"
                  title="Buscar artista"
                  type="button"
                >
                  <SearchIcon size={14} />
                </button>
              </div>
            </div>

            <ArtistSelect
              items={artists}
              option={artistOption}
              isLoadMore={isLoadMoreArtist}
              loadMore={loadMoreArtists}
              payload={(option) => {
                const item = option.item;

                setArtistOption({
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

          <div className="space-y-1 z-10">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
                Álbum
              </label>
              <div className="flex justify-between items-center gap-2">

                <button
                  type="button"
                  onClick={triggerCreateAlbum}
                  className="cursor-pointer text-[9px] font-bold text-primary hover:underline transition-all flex items-center gap-0.5 outline-none"
                >
                  <PlusCircleIcon size={14} />
                </button>
                <button
                  onClick={() => setIsAlbumSearch(true)}
                  className="cursor-pointer text-[9px] p-0.5 font-bold text-primary hover:underline transition-all flex items-center gap-0.5 outline-none"
                  title="Buscar artista"
                  type="button"
                >
                  <SearchIcon size={14} />
                </button>
              </div>
            </div>

            <AlbumSelect
              items={albums}
              option={albumOption}
              isLoadMore={isLoadMoreAlbums}
              loadMore={loadMoreAlbums}
              payload={(option) => {
                const item = option.item;

                setAlbumOption({
                  label: item?.title || 'Seleccionar',
                  value: option.value
                });

                setForm({
                  ...form,
                  albumId: option.value,
                  albumName: item?.title || ''
                });
              }}
            />
          </div>

          <div className="text-white">
            <label className="mb-1 block text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
              Calidad
            </label>

            <Select
              selectedIndex={1}
              items={[
                { value: '320', label: '320 - Max' },
                { value: '192', label: '192 - Alta' },
                { value: '128', label: '128 - Normal' }
              ]}
              payload={(option) => setForm({ ...form, quality: option.value })}
              styles={{
                backgroundColor: bgColor,
                border: '1px solid #ffffff0d',
                padding: '12px 16px',
                fontSize: '13px',
                borderRadius: 12
              }}
              ulStyles={{
                backgroundColor: bgColor,
                border: '1px solid #ffffff0d',
                borderRadius: '12px',
                fontSize: '13px'
              }}
              liStyles={{
                backgroundColor: bgColor,
                padding: '6px 12px',
                fontSize: '13px'
              }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-3 justify-end">
          <button
            className="cursor-pointer px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-white transition-all outline-none"
            type="button"
          >
            Limpiar
          </button>
          <button
            className="cursor-pointer bg-primary text-black font-black uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl hover:scale-102 active:scale-95 transition-all shadow-md shadow-primary/10"
            type="submit"
          >
            Subir Canción
          </button>
        </div>
      </form>

      <section
        style={{ boxShadow: '0px 0px 5px 2px #0e0e0e' }}
        className={`${isArtistSearch ? 'translate-y-0' : 'translate-y-[100vh]'} h-100 p-5 text-gray-400 bg-[#181818] overflow-hidden w-full z-50 transition duration-150 absolute bottom-0 right-0`}
      >
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm">
              Buscar artista
            </h2>

            <button
              onClick={() => setIsArtistSearch(false)}
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
              onChange={(e) => setArtistSearchQuery(e.target.value)}
              value={artistSearchQuery}
              placeholder="Buscar por nombre..."
              type="search"
            />
          </div>
        </div>

        <div
          className="mt-4 overflow-y-auto max-h-66"
          id="album-search-artist"
        >
          {artists.map((art) => (
            <div
              onClick={() => {
                setArtistOption({
                  label: art.name,
                  value: art.id
                });

                setForm({
                  ...form,
                  artistId: art.id,
                  artistName: art.name
                });

                setIsArtistSearch(false);
              }}
              className="hover:bg-white/5 cursor-pointer p-2 flex items-center gap-3" key={art.id}
            >
              <SmartImage
                wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0"
                url={null}
                icon={(
                  <UserIcon size={16} />
                )}
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

          {isLoadMoreArtist &&
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

      <section
        style={{ boxShadow: '0px 0px 5px 2px #0e0e0e' }}
        className={`${isAlbumSearch ? 'translate-y-0' : 'translate-y-[100vh]'} h-100 p-5 text-gray-400 bg-[#181818] overflow-hidden w-full z-50 transition duration-150 absolute bottom-0 right-0`}
      >
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm">
              Buscar álbum
            </h2>

            <button
              onClick={() => setIsAlbumSearch(false)}
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
              onChange={(e) => setAlbumSearchQuery(e.target.value)}
              value={albumSearchQuery}
              placeholder="Buscar por título, artista..."
              type="search"
            />
          </div>
        </div>

        <div
          className="mt-4 overflow-y-auto max-h-66"
          id="album-search-artist"
        >
          {albums.map((al) => (
            <div
              onClick={() => {
                setAlbumOption({
                  label: al.title,
                  value: al.id
                });

                setForm({
                  ...form,
                  albumId: al.id,
                  albumName: al.title
                });

                setIsAlbumSearch(false);
              }}
              className="hover:bg-white/5 cursor-pointer p-2 flex items-center gap-3" key={al.id}
            >
              <SmartImage
                wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0"
                url={null}
                icon={(
                  <DiscIcon size={16} />
                )}
              />

              <div className="overflow-hidden flex flex-col gap-1">
                <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                  {al.title}
                </p>
                <span className="text-[9px] text-gray-400 font-mono">
                  {al.id}
                </span>
              </div>
            </div>
          ))}

          {isLoadMoreAlbums &&
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

export default TrackForm;