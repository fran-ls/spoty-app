import { useRef, useState } from "react";
import { DiscIcon, FileAudioIcon, ImageUpIcon, Music2Icon, PauseIcon, PlayIcon, PlusCircleIcon, SearchIcon, Trash2Icon, UploadIcon, UserIcon } from "lucide-react";
import type { Song, SongDTO, SongFileUrls } from "../song.types";
import { formatTime } from "../../../shared/utils/formatTime";
import { AudioPlayer, type AudioPlayerState } from "../../player/components/AudioPlayer";
import ArtistSelect from "../../artist/components/ArtistSelect";
import AlbumSelect from "../../artist/components/AlbumSelect";
import songService from "../services/song.service";
import Select from "../../../shared/components/Select";
import useToaster from "../../../shared/hooks/useToaster";
import SmartImage from "../../../shared/components/SmartImage";
import Toaster from "../../../shared/components/Toaster";
import useArtist from "../../artist/hooks/useArtist";
import SearchWidget, { type WidgetSearch } from "../../../shared/components/SearchWidget";
import { images } from "../../../shared/data/images.data";
import useApiFetch from "../../../shared/hooks/useApiFetch";
import albumService from "../../artist/services/album.service";
import useAlbum from "../../artist/hooks/useAlbum";
import artistService from "../../artist/services/artist.service";

interface TrackFormProps {
  triggerCreateArtist: () => void;
  triggerCreateAlbum: () => void;
}

const TrackForm = (props: TrackFormProps) => {
  const { triggerCreateArtist, triggerCreateAlbum } = props;
  const { artists, artistMeta, searchArtists } = useArtist();
  const { albums, albumMeta, searchAlbums } = useAlbum();
  const { isActive, toast, isFirstLoad, showToast, onClose } = useToaster(5000);
  const useApi = useApiFetch(showToast);

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
    cover: images.cover
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
  const [search, setSearch] = useState<WidgetSearch>({
    query: '',
    page: 0
  });
  const [artistOption, setArtistOption] = useState({
    label: 'Seleccionar',
    value: ''
  });

  const [isAlbumSearch, setIsAlbumSearch] = useState(false);
  const [albumSearch, setAlbumSearch] = useState<WidgetSearch>({
    query: '',
    page: 0
  });
  const [albumOption, setAlbumOption] = useState({
    label: 'Seleccionar',
    value: ''
  });

  const onFormChange = (field: keyof SongDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  function onFileChange(
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
    fileField: 'audio' | 'coverFile',
    fileUrlField?: 'audio' | 'cover'
  ) {
    const file = e.target.files?.[0] || null;
    const urlField = fileUrlField || fileField;
    if (!file) return;

    const url = (previewUrls as any)[fileField];
    if (url) URL.revokeObjectURL(url);

    const fileUrl = URL.createObjectURL(file);
    setForm({ ...form, [fileField]: file });
    setPreviewUrls({ ...previewUrls, [urlField]: fileUrl });
  }

  function onRemoveAudio() {
    if (previewUrls.audio) URL.revokeObjectURL(previewUrls.audio);
    setPreviewUrls({ ...previewUrls, audio: '' });
    onFormChange('audio', null);
    player.togglePlay();
  }

  const loadMoreArtists = async (query: string, page: number, isSelect = false) => {
    await searchArtists({
      name: query,
      limit: 10,
      page
    });

    if (isSelect) setSearch({ ...search, page: page + 1 });
  }

  const loadMoreAlbums = async (query: string, page: number, isSelect = false) => {
    await searchAlbums({
      title: query,
      limit: 10,
      page
    });

    if (isSelect) setAlbumSearch({ ...albumSearch, page: page + 1 });
  }

  async function uploadTrack() {
    const config = {
      message: 'Subida exitosa',
      icon: <Music2Icon size={16} />
    }

    useApi.save<Song>(() => songService.uploadSong(form, { artist: true }), config);
  }

  return (
    <div className="relative overflow-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          uploadTrack();
        }}
        className="p-5 animate-fade-in relative upload-panel-main-wrap"
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
          <h3 className="text-xl font-black text-white leading-tight">
            {form?.title || 'Tema'}
          </h3>
          <p className="text-xs text-primary font-bold mt-1">
            {form?.artistName || 'Artista'}
          </p>
          <p className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
            {form.albumName || 'Tema'}
          </p>
        </div>

        <div className="space-y-1.5 my-4">
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
                  <p
                    className="text-[11px] font-bold text-white truncate leading-none"
                    title={form.audio.name}
                  >
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

        <div className="grid grid-cols-1 gap-4 mb-4">
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

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
              Portada URL
            </label>
            <input
              type="text"
              value={form.cover || ''}
              onChange={(e) => onFormChange('cover', e.target.value)}
              placeholder="https://portada.jpg"
              className="text-[13px] w-full bg-[#181818] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
              Audio URL
            </label>
            <input
              type="text"
              value={form.fileUrl || ''}
              onChange={(e) => onFormChange('fileUrl', e.target.value)}
              placeholder="https://audio.mp3"
              className="text-[13px] w-full bg-[#181818] border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-600 outline-none transition-all"
            />
          </div>

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
              isLoadMore={artistMeta.hasNextPage}
              loadMore={() => loadMoreArtists(search.query, search.page, true)}
              payload={({ value, label, item }) => {
                setArtistOption({
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
              isLoadMore={albumMeta.hasNextPage}
              loadMore={() => loadMoreAlbums(albumSearch.query, albumSearch.page, true)}
              payload={({ label, value, item }) => {
                setAlbumOption({
                  label: label || 'Seleccionar',
                  value
                });

                setForm({
                  ...form,
                  albumId: value,
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

      <SearchWidget
        keys={{
          label: 'name',
          value: 'id',
          sub: 'id'
        }}
        label="Buscar artista"
        open={isArtistSearch}
        items={artists}
        meta={artistMeta}
        isLoadMore={artistMeta.hasNextPage}
        loadMore={loadMoreArtists}
        onClose={() => setIsArtistSearch(false)}
        payload={({ value, label, item, search: sq }) => {
          setSearch(sq);

          setArtistOption({
            label: label || 'Seleccionar',
            value
          });

          setForm({
            ...form,
            artistId: value,
            artistName: item?.name || ''
          });
        }}
        loadIcon={({ id, image }) => (
          <SmartImage
            wrapClassName="bg-white/5 text-gray-400 w-9 h-9 rounded-full border border-white/5 overflow-hidden shrink-0"
            url={artistService.artistImage(id, image)}
            icon={<UserIcon size={16} />}
          />
        )}
      />

      <SearchWidget
        keys={{
          label: 'title',
          value: 'id',
          sub: 'id'
        }}
        label="Buscar álbum"
        open={isAlbumSearch}
        items={albums}
        meta={albumMeta}
        isLoadMore={albumMeta.hasNextPage}
        loadMore={loadMoreAlbums}
        onClose={() => setIsAlbumSearch(false)}
        payload={({ value, label, item, search: sq }) => {
          setAlbumSearch(sq);

          setAlbumOption({
            label: label || 'Seleccionar',
            value
          });

          setForm({
            ...form,
            albumId: value,
            albumName: item.title
          });
        }}
        loadIcon={({ id, cover }) => (
          <SmartImage
            wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-md bg-white/5 border border-white/10 overflow-hidden shrink-0"
            url={albumService.albumCover(id, cover)}
            icon={<DiscIcon size={16} />}
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

export default TrackForm;