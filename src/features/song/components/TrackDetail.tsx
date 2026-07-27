import { useEffect, useMemo, useState } from "react";
import {
  CalendarIcon, CircleMinus, ClockIcon, DiscIcon, Music2Icon, MusicIcon, PenIcon,
  PlayIcon, SquarePenIcon, UploadIcon, UserIcon, UserRoundPenIcon
} from "lucide-react";
import type { Track } from "../../song/song.types";
import type { Artist } from "../../artist/artist.types";
import type { Album } from "../../artist/album.types";
import SmartImage from "../../../shared/components/SmartImage";
import Toaster from "../../../shared/components/Toaster";
import useToaster from "../../../shared/hooks/useToaster";
import MenuItem from "../../../shared/components/MenuItem";
import songService from "../../song/services/song.service";
import { AudioPlayer } from "../../player/components/AudioPlayer";
import { getTimeParts } from "../../../shared/utils/formatTime";
import { getFmtDate } from "../../../shared/utils/getFormatDate";
import useArtist from "../../artist/hooks/useArtist";
import SearchWidget from "../../../shared/components/SearchWidget";
import artistService from "../../artist/services/artist.service";
import albumService from "../../artist/services/album.service";
import useAlbum from "../../artist/hooks/useAlbum";
import { PlayOffIcon } from "../../../shared/components/Icons";
import Tooltip from "../../../shared/components/Tooltip";

interface TrackDetailProps {
  activeTrack: Track | null;
  onRemove: () => Promise<boolean>;
  onClose: () => void;
}

const TrackDetail = ({ activeTrack, onClose, onRemove }: TrackDetailProps) => {
  const { artists, artistMeta, searchArtists } = useArtist();
  const { albums, albumMeta, searchAlbums } = useAlbum();
  const { toast, isActive, isFirstLoad, onClose: onCloseToast } = useToaster();

  const [isPlay, setIsPlay] = useState(false);
  const [isTrackMenu, setIsTrackMenu] = useState(false);
  const [isRemoveFiles, setIsRemoveFiles] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isTitleTooltip, setIsTitleTooltip] = useState(false);

  const [form, setForm] = useState<Track>({
    id: '',
    title: '',
    artistId: '',
    duration: 0,
    fileUrl: '',
    createdAt: ''
  });

  const [isEditArtist, setIsEditArtist] = useState(false);
  const [artist, setArtist] = useState<Partial<Artist> & Required<{ id: string; name: string }>>({
    id: '',
    name: ''
  });

  const [isEditAlbum, setIsEditAlbum] = useState(false);
  const [album, setAlbum] = useState<Partial<Album> & Required<{ id: string; title: string }>>({
    id: '',
    title: ''
  });

  const fileUrl = useMemo(() => (
    songService.streamUrl(activeTrack!.id, activeTrack?.fileUrl)
  ), [activeTrack]);

  const [duration, setDuration] = useState({
    str: '00:00',
    int: 0,
    mins: 0,
    secs: 0
  });

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
      artistId: artist.id,
      duration: duration.int
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

  function onDurationChange(time: number) {
    const { min, secs, stringSecs } = getTimeParts(time);

    setDuration({
      str: `${min}:${stringSecs}`,
      int: time,
      mins: min,
      secs
    });
  }

  useEffect(() => {
    if (activeTrack) {
      const { album: activeTrackAlbum, artist: activeTrackArtist } = activeTrack;
      setForm({ ...activeTrack });

      setAlbum({
        ...activeTrackAlbum,
        id: activeTrackAlbum?.id || '',
        title: activeTrackAlbum?.title || ''
      });

      setArtist({
        ...activeTrackArtist,
        id: activeTrackArtist?.id || '',
        name: activeTrackArtist?.name || '',
        image: artistService.artistImage(
          activeTrackArtist?.id || '',
          activeTrackArtist?.image
        ) || ''
      });

      onDurationChange(activeTrack.duration);
    }
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

          <h3
            onDoubleClick={() => setIsTitleTooltip(!isTitleTooltip)}
            className="text-xl font-black text-white leading-tight truncate select-none"
            title={form.title}
          >
            {form.title || 'Álbum Musical'}
          </h3>
          {isTitleTooltip && (
            <div className="mt-1">
              <Tooltip text={form.title} />
            </div>
          )}
          <p
            className="text-xs text-primary font-bold mt-1"
            title={artist.name}
          >
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

        <div className="text-[#adaaaa] flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEdit(!isEdit)}
              className={`${isEdit ? 'text-primary' : ''} p-1 cursor-pointer`}
              title="Editar datos"
              type="button"
            >
              <SquarePenIcon size={20} />
            </button>
            <button
              onClick={() => {
                setIsEditArtist(!isEditArtist);
                setIsEditAlbum(false);
              }}
              className={`${isEditArtist ? 'text-primary' : ''} p-1 cursor-pointer`}
              title="Editar artista"
              type="button"
            >
              <UserRoundPenIcon size={20} />
            </button>
            <button
              onClick={() => {
                setIsEditAlbum(!isEditAlbum);
                setIsEditArtist(false);
              }}
              className={`${isEditAlbum ? 'text-primary' : ''} p-1 cursor-pointer relative`}
              title="Editar álbum"
              type="button"
            >
              <DiscIcon size={20} />
              <span className="absolute bottom-2 right-1.5 bg-[#181818] h-3 w-0.5 rotate-45"></span>
              <PenIcon className="absolute bottom-2 right-px" strokeWidth={3} size={12} />
            </button>
          </div>

          <button
            onClick={() => setIsPlay(!isPlay)}
            className={`${isEditAlbum ? 'text-primary' : ''} ml-auto p-2 cursor-pointer bg-primary rounded-full`}
            title={!isPlay ? "Reproducir" : "Dejar de reproducir"}
            type="button"
          >
            {isPlay
              ? <PlayOffIcon className="fill-black text-black" size={16} />
              : <PlayIcon className="fill-black stroke-0" size={16} />
            }
          </button>
        </div>

        {(fileUrl && isPlay) && (
          <AudioPlayer
            title={form.title}
            url={fileUrl}
            file={null}
            unstyled
          />
        )}

        <div className="space-y-5 text-[#adaaaa]">
          <div className="flex items-center justify-between gap-2">
            <Music2Icon size={20} />

            {!isEdit
              ?
              <h2
                className="block w-full text-[15px] font-semibold truncate"
                title={form.title}
              >
                {form.title || 'Tema'}
              </h2>
              :
              <input
                className="w-full text-[15px] font-bold border-b border-[#424242]"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                value={form.title}
                type="text"
              />
            }
          </div>

          <div className="flex items-center gap-2">
            <SmartImage
              styles={{
                imgWrap: `${artist.image ? '' : 'p-1 border border-white/10'} min-w-5.5 w-5.5 h-5.5 rounded-full bg-white/5 overflow-hidden relative`,
                iconWrap: 'w-full h-full flex items-center justify-center relative border-0'
              }}
              url={artist.image || ''}
              icon={(
                <UserIcon size={16} />
              )}
            />
            <span
              className="text-[13px] truncate"
              title={artist.name}
            >
              {artist.name || 'Artista'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <DiscIcon size={20} />
              <span className="text-sm">
                Álbum
              </span>
            </div>
            <span
              className="text-sm ml-auto truncate"
              title={album.title}
            >
              {album.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ClockIcon className="min-w-5" size={20} />
            <span className="text-sm">
              Duración
            </span>

            {isEdit &&
              <div className="flex items-center gap-2">
                <input
                  className="text-center w-full text-sm border-b border-[#424242]"
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (/[^0-9]/.test(value)) return;

                    const mins = Number(value) * 60;
                    const secs = duration.secs;
                    onDurationChange(mins + secs);
                  }}
                  value={duration.mins}
                  type="text"
                />
                <span>:</span>
                <input
                  className="text-center w-full text-sm border-b border-[#424242]"
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (/[^0-9]/.test(value)) return;

                    const secs = Number(value);
                    if (secs > 59) return;

                    const mins = duration.mins * 60;
                    onDurationChange(mins + secs);
                  }}
                  value={duration.secs}
                  type="text"
                />
              </div>
            }

            <span className="text-sm ml-auto">
              {duration.str}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <CalendarIcon className="min-w-5" size={20} />
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
        payload={({ value, label, item }) => {
          const image = artistService.artistImage(item.id, item.image)

          setArtist({
            ...item,
            id: value,
            name: label || '',
            image
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
          sub: 'artist.name'
        }}
        label="Buscar álbum"
        open={isEditAlbum}
        items={[
          {
            id: '',
            title: 'Sin asignar',
            artistId: '',
            artist: {
              name: 'Quitar del álbum'
            }
          },
          ...albums
        ]}
        meta={albumMeta}
        isLoadMore={albumMeta.hasNextPage}
        loadMore={loadMoreAlbums}
        onClose={() => setIsEditAlbum(false)}
        payload={({ value, item, label }) => {
          setAlbum({
            ...item,
            id: value,
            title: label.toLowerCase() === 'sin asignar' ? '' : label || ''
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