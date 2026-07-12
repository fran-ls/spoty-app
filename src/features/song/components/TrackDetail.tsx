import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, CircleMinus, ClockIcon, DiscIcon, Music2Icon, MusicIcon, PenIcon, UploadIcon, UserIcon } from "lucide-react";
import type { Track } from "../../song/song.types";
import SmartImage from "../../../shared/components/SmartImage";
import Toaster from "../../../shared/components/Toaster";
import useToaster from "../../../shared/hooks/useToaster";
import MenuItem from "../../../shared/components/MenuItem";
import songService from "../../song/services/song.service";
import { AudioPlayer } from "../../player/AudioPlayer";
import { formatTime } from "../../../shared/utils/formatTime";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import useArtist from "../../artist/hooks/useArtist";
import SearchWidget from "../../../shared/components/SearchWidget";
import artistService from "../../artist/services/artist.service";
import albumService from "../../artist/services/album.service";
import useAlbum from "../../artist/hooks/useAlbum";

interface TrackDetailProps {
  activeTrack: Track | null;
  onRemove: () => Promise<boolean>;
  onClose: () => void;
}

const TrackDetail = ({ activeTrack, onClose, onRemove }: TrackDetailProps) => {
  const { artists, artistMeta, searchArtists } = useArtist();
  const { albums, albumMeta, searchAlbums } = useAlbum();
  const { toast, isActive, isFirstLoad, onClose: onCloseToast } = useToaster();

  const [isTrackMenu, setIsTrackMenu] = useState(false);
  const [isRemoveFiles, setIsRemoveFiles] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<Track>({ ...activeTrack! });

  const [isEditArtist, setIsEditArtist] = useState(false);
  const [artist, setArtist] = useState({
    id: '',
    name: ''
  });

  const [isEditAlbum, setIsEditAlbum] = useState(false);
  const [album, setAlbum] = useState({
    id: '',
    title: ''
  });

  const fileUrl = useMemo(() => (
    songService.streamUrl(activeTrack!.id, activeTrack?.fileUrl)
  ), [activeTrack]);

  async function onRemoveTrack() {
    if (!activeTrack || !activeTrack.id) return false;
    const { data } = await songService.removeSong(activeTrack.id, isRemoveFiles);
    onClose();
    if (data) {
      await onRemove();
      return true;
    }
    return false;
  }

  async function updateTrack() {
    if (!activeTrack || !activeTrack.id) return;

    await songService.updateSong(activeTrack.id, {
      title: form.title,
      albumId: album.id,
      artistId: artist.id
    });
  }

  const loadMoreArtists = async (query: string, page: number) => {
    await searchArtists({
      name: query,
      limit: 10,
      page
    });
  }

  const loadMoreAlbums = async (query: string, page: number) => {
    await searchAlbums({
      title: query,
      limit: 10,
      page
    });
  }

  useEffect(() => {
    setAlbum({
      id: activeTrack?.album?.id || '',
      title: activeTrack?.album?.title || ''
    });
    setArtist({
      id: activeTrack?.artist?.id || '',
      name: activeTrack?.artist?.name || ''
    });
  }, [activeTrack]);

  return (
    <div className="animate-fade-in relative overflow-hidden">
      <section className="p-5 space-y-6 upload-panel-wrap">
        <div className="text-center pb-4 border-b border-white/5 relative">
          <SmartImage
            wrapClassName="w-28 h-28 rounded-xl bg-white/5 border border-white/10 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
            url={songService.songCoverUrl(activeTrack!.id, activeTrack!.cover)}
            icon={(
              <MusicIcon className="w-[30%] h-[30%] text-gray-400" />
            )}
          />

          <h3 className="text-xl font-black text-white leading-tight">
            {activeTrack?.title || 'Álbum Musical'}
          </h3>
          <p className="text-xs text-primary font-bold mt-1">
            {artist.name || 'Artista'}
          </p>
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
            Tema Musical
          </span>

          <MenuItem
            styles={{ btn: 'absolute top-0 right-0' }}
            onActive={() => setIsTrackMenu(true)}
            actions={() => {
              setIsTrackMenu(false);
            }}
            open={isTrackMenu}
            sections={[{
              label: 'actions',
              items: [
                {
                  action: 'remove',
                  label: 'Eliminar pista',
                  icon: (
                    <CircleMinus
                      className="text-current"
                      size={20}
                    />
                  ),
                  onAction: () => onRemoveTrack()
                },
                {
                  action: 'share',
                  label: 'Compartir',
                  icon: (
                    <UploadIcon
                      className="text-current"
                      size={20}
                    />
                  )
                }
              ]
            }, {
              label: 'files',
              items: [
                {
                  action: 'toggle',
                  label: 'Incluir archivos',
                  isActive: isRemoveFiles,
                  subtext: 'Borrar archivos de la pista',
                  onAction: (isActive) => setIsRemoveFiles(isActive!)
                }
              ]
            }]}
          />
        </div>

        {fileUrl && (
          <AudioPlayer
            title={activeTrack?.title}
            url={fileUrl}
            file={null}
          />
        )}

        <div className="space-y-4 text-[#adaaaa]">
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
              title="Editar título"
              type="button"
            >
              <PenIcon size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="w-full flex items-center justify-between gap-2">
              <UserIcon size={20} />
              <span
                className="w-full text-sm line-clamp-1"
                title={artist.name}
              >
                {artist.name}
              </span>
            </div>

            <button
              onClick={() => setIsEditArtist(!isEditArtist)}
              className={`${isEditArtist ? 'text-primary' : ''} p-1`}
              title="Editar artista"
              type="button"
            >
              <PenIcon size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="w-full flex items-center gap-2">
              <DiscIcon size={20} />
              <span className="text-sm">
                Álbum
              </span>
            </div>
            <span className="text-sm ml-auto">
              {album.title || ''}
            </span>
            <button
              onClick={() => setIsEditAlbum(!isEditAlbum)}
              className={`${isEditAlbum ? 'text-primary' : ''} p-1`}
              title="Editar álbum"
              type="button"
            >
              <PenIcon size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ClockIcon size={20} />
            <span className="text-sm">
              Duración
            </span>
            <span className="text-sm ml-auto">
              {formatTime(activeTrack?.duration || 0)}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <CalendarIcon size={20} />
            <span className="text-sm">
              Fecha en la que se subió
            </span>
            <span className="text-sm ml-auto">
              {activeTrack?.createdAt ? getFmtDate(activeTrack?.createdAt, 'dd MMM yyyy') : ''}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-white transition-all outline-none"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={updateTrack}
            className="cursor-pointer bg-primary text-black font-black uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-xl hover:scale-102 active:scale-95 transition-all shadow-md shadow-primary/10"
            type="submit"
          >
            Guardar
          </button>
        </div>
      </section>

      <SearchWidget
        keys={{
          label: 'name',
          value: 'id',
          sub: 'id'
        }}
        label="Buscar artista"
        open={isEditArtist}
        items={artists}
        meta={artistMeta}
        isLoadMore={artistMeta.hasNextPage}
        loadMore={loadMoreArtists}
        onClose={() => setIsEditArtist(false)}
        payload={({ value, label }) => {
          setArtist({
            id: value,
            name: label || 'Seleccionar'
          });

          setForm({
            ...form,
            artistId: value
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
        open={isEditAlbum}
        items={albums}
        meta={albumMeta}
        isLoadMore={albumMeta.hasNextPage}
        loadMore={loadMoreAlbums}
        onClose={() => setIsEditAlbum(false)}
        payload={({ value, label }) => {
          setAlbum({
            id: value,
            title: label || 'Seleccionar'
          });

          setForm({
            ...form,
            albumId: value
          });
        }}
        loadIcon={({ id, cover }) => (
          <SmartImage
            wrapClassName="bg-white/5 text-gray-400 w-9 h-9 rounded-md border border-white/5 overflow-hidden shrink-0"
            url={albumService.albumCover(id, cover)}
            icon={<DiscIcon size={16} />}
          />
        )}
      />

      <Toaster
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        onClose={onCloseToast}
        {...toast}
      />
    </div>
  )
}

export default TrackDetail;