import React, { useEffect, useRef, useState } from 'react';
import { Music2Icon, MusicIcon, PenIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import type { PlaylistDTO, PlaylistFormAction, PlaylistFormState } from '../../playlist/playlist.types';
import type { Song, SongCover, SongDTO } from '../song.types';
import GradientEditor from '../../playlist/components/GradientEditor';
import Footer from '../../playlist/components/Footer';
import { getTimeParts } from '../../../shared/utils/formatTime';
import SongList from '../components/SongList';
import songService from '../services/song.service';
import SongListEmpty from '../components/SongListEmpty';
import { usePlayer } from '../../../shared/context/PlayerContext';
import useAuth from '../../auth/hooks/useAuth';
import { GRADIENT_COLORS, GRADIENT_CSS } from '../../../shared/data/gradientColors.data';
import PlaylistMenu, { type PlaylistMenuAction } from '../../playlist/components/PlaylistMenu';
import TrackModal from '../components/TrackModal';
import SongDeleteConfirm from '../components/SongDeleteConfirm';
import PlaylistForm from '../../playlist/components/PlaylistForm';
import SmartImage from '../../../shared/components/SmartImage';
import useTrack from '../hooks/useTrack';

const SongPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { setQueueMeta } = usePlayer();
  const { tracks, trackMeta, searchTracks, setTracks, setTrackMeta } = useTrack()

  const [gradientCSS, setGradientCSS] = useState<string>(GRADIENT_CSS);
  const [bgColor, setBgColor] = useState(GRADIENT_COLORS[0].color || '#3b3b3b');
  const [gradientColor, setGradientColor] = useState(GRADIENT_COLORS[1].color || '#111111');
  const [isPublic, setIsPublic] = useState(false);

  // const [currentCover, setCurrentCover] = useState('');
  const [form, setForm] = useState<PlaylistDTO>({
    name: 'Canciones',
    description: 'Todas las canciones',
    cover: '',
    isPublic,
    gradientColor,
    bgColor,
    userId: '',
    file: null
  });

  const [isBackground, setIsBackground] = useState(false);
  const [isSearch, _setIsSearch] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);
  const [isPlaylistMenu, setIsPlaylistMenu] = useState(false);
  const [isRemoveSong, setIsRemoveSong] = useState(false);
  const [isEditTrack, setIsEditTrack] = useState(false);

  const [coverImages, setCoverImages] = useState<SongCover[]>([]);
  const [activeTrack, setActiveTrack] = useState<Song | null>(null);
  const [toasterTime, setToasterTime] = useState(2500);

  const duration = getTimeParts(trackMeta?.totalDuration ?? 0);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const username = user?.username?.split(' ')[0] || 'Username';
  const isTrackCount = trackMeta.total === 0 || trackMeta.total > 1;

  async function getTracks(page: number) {
    const data = await searchTracks({
      title: query,
      orderBy: 'createdAt',
      limit: 10,
      page
    }, {
      album: 'id title',
      artist: 'id name'
    });

    if (data) setQueueMeta({
      ...data.meta,
      playlistId: '',
      totalDuration: 0
    });
  }

  async function onRemoveSong(isRemoveFiles = false) {
    const songId = activeTrack?.id
    if (!activeTrack || !songId) return false;

    const r = await songService.removeSong(songId, isRemoveFiles);
    if (r.error || !r.data || !r.data?.id) return false;

    setTracks((prev) => prev.filter((t) => t.id !== songId));
    setTrackMeta({ ...trackMeta, total: trackMeta.total - 1 });

    setIsRemoveSong(false);
    setActiveTrack(null);
    setToasterTime(3500);

    toast(
      <div className="text-white flex items-center gap-2 p-2 pr-3 min-w-10 rounded-lg bg-black">
        <div className="bg-[#262626] min-w-10 w-10 h-10 rounded overflow-hidden relative">
          <MusicIcon
            className="absolute top-1/2 left-1/2 -translate-1/2"
            size={20}
          />
        </div>
        <div>
          <span
            className="line-clamp-1 font-medium"
            title={activeTrack?.title}
          >
            {activeTrack?.title}
          </span>
          <span className="text-sm block text-red-500">
            Se quitó de la lista
          </span>
        </div>
      </div>
    );

    return true;
  }

  async function getPlaylistCover() {
    const images: SongCover[] = [];

    for (const song of tracks) {
      if (song.cover) {
        const coverUrl = songService.songCoverUrl(song.id, song.cover);
        images.push({ id: song.id, url: coverUrl });
      }

      if (images.length === 4) {
        break;
      }
    }

    setCoverImages(images);
  }

  async function onUpdateSong(song: SongDTO) {
    const songId = activeTrack?.id;
    if (!songId || !isAdmin) return;

    const { data } = await songService.updateSong(songId, {
      ...song,
      albumId: activeTrack?.album?.id
    });

    if (data && data.id && activeTrackIndex !== null) {
      const trackToUpdate = tracks[activeTrackIndex];
      tracks[activeTrackIndex] = {
        ...trackToUpdate,
        ...data,
        cover: songService.songCoverUrl(songId, data.cover)
      }

      setActiveTrackIndex(null);
      setActiveTrack(null);
      setIsEditTrack(false);
    }
  }

  function playlistMenuActions(action: PlaylistMenuAction | 'open') {
    switch (action) {
      case 'open':
        setIsPlaylistMenu(true);
        return;
      case 'remove':
        setIsRemoveSong(true);
        setIsPlaylistMenu(false);
        return;
      case 'add-to-queue':
        setIsPlaylistMenu(false);
        return;
      case 'view-track':
        setIsEditTrack(true);
        setIsPlaylistMenu(false);
        return;
      case 'share':
        setIsPlaylistMenu(false);
        return;
      default:
        setIsPlaylistMenu(false);
        return;
    }
  }

  const onFormChange = (field: keyof PlaylistFormState, value: any) => {
    if (field === 'isPublic') {
      setIsPublic(value);
      return;
    }

    if (field === 'file') {
      setForm({
        ...form,
        [field]: value || null,
        cover: value ? URL.createObjectURL(value) : ''
        // cover: currentCover ? currentCover : ''
      });
      return;
    }

    setForm({ ...form, [field]: value });
  }

  function onPlaylistFormAction(
    action: PlaylistFormAction,
    payload?: { field: keyof PlaylistFormState, value: any }
  ) {
    switch (action) {
      case 'set-state':
        payload && onFormChange(payload.field, payload.value);
        return;
      case 'select-file':
        coverInputRef.current?.click();
        return;
      case 'save':
        setIsEdit(false);
        return;
      default:
        setIsEdit(false);
        return;
    }
  }

  useEffect(() => { getPlaylistCover() }, [tracks]);
  useEffect(() => { setTimeout(() => { getTracks(page) }, 300) }, [query]);

  return (
    <>
      <div className="min-w-full text-white select-none scroll-smooth relative">
        <div className="animate-fade-in">
          <div
            style={{
              background: gradientCSS
            }}
            className="min-[500px]:flex-row min-[500px]:pt-6 pt-10 px-6 pb-44 flex-col flex items-center sm:gap-6 gap-4 overflow-x-auto hide-scrollbar"
          >
            <div
              onPointerEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-[925px]:min-w-58 min-[925px]:min-h-58 min-[500px]:min-w-[25vw] min-[500px]:min-h-[25vw] min-w-40 min-h-40 w-[25vw] h-[25vw] min-[500px]:rounded bg-[#262626] relative overflow-hidden"
            >
              <SmartImage
                wrapClassName="w-full h-full"
                icon={<MusicIcon className="w-1/4 h-1/4" />}
                url={form.cover}
              />

              {!form.cover && coverImages.length > 3 && coverImages.map((d, i) => {
                const className = i === 0
                  ? 'top-0 left-0' : i === 1
                    ? 'top-0 right-0' : i === 3
                      ? 'bottom-0 left-0' : 'bottom-0 right-0';

                return (
                  <img
                    className={`${className} absolute w-1/2 h-1/2 object-cover`}
                    crossOrigin="anonymous"
                    src={d.url}
                    alt=""
                    key={d.id}
                  />
                )
              })}

              {isHover &&
                <button
                  className={`${(form.cover || coverImages.length > 3) ? 'bg-black/50' : 'bg-[#262626]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
                  onClick={() => onPlaylistFormAction('select-file')}
                  type="button"
                >
                  <PenIcon className="w-10 h-10" />
                  <span>Elegir foto</span>
                </button>
              }

              <input
                onChange={(e) => onFormChange('file', e.target.files?.[0])}
                ref={coverInputRef}
                className="hidden"
                type="file"
              />
            </div>

            <div className="mt-auto w-full">
              <span className="min-[500px]:block hidden text-sm font-medium">
                Lista {isPublic ? 'pública' : 'privada'}
              </span>
              <h1
                onClick={() => setIsEdit(true)}
                className={`min-[500px]:mb-0 mb-5 min-[500px]:text-left text-center font-black cursor-pointer ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font' : 'playlist-title-font truncate'}`}
              >
                {form.name || 'Mi lista'}
              </h1>

              {form.description &&
                <div className="min-[500px]:block hidden text-sm text-slate-400">
                  {form.description}
                </div>
              }

              <div className="mt-2 flex items-center">
                <button
                  className="bg-[#ffffff36] p-1 rounded-full"
                  type="button"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>

                <a href="#" className="min-[500px]:inline-flex hidden hover:underline">
                  <span className="text-sm ml-2 font-bold">
                    {username}
                  </span>
                </a>
                <span className="min-[500px]:inline-flex hidden text-sm ml-2 font-bold">
                  •
                </span>
                <span className="min-[500px]:inline-flex hidden text-sm ml-2 text-nowrap">
                  {trackMeta.total} {isTrackCount ? 'canciones' : 'canción'}, {duration.min} min {duration.stringSecs}s
                </span>

                <div className="min-[500px]:hidden flex-wrap gap-2 flex w-full items-center justify-between">
                  <div>
                    <a href="#" className="hover:underline">
                      <span className="text-sm ml-2 font-bold">
                        {username}
                      </span>
                    </a>
                    <span className="text-sm ml-2 font-bold">
                      •
                    </span>
                    <span className="min-[500px]:hidden inline-flex ml-2 text-sm font-medium">
                      {isPublic ? 'Pública' : 'Privada'}
                    </span>
                  </div>
                  <span className="min-[420px]:inline-flex hidden text-sm ml-2 text-nowrap">
                    {trackMeta.total} {isTrackCount ? 'canciones' : 'canción'}, {duration.min} min {duration.stringSecs}s
                  </span>
                </div>
              </div>

              <div className="min-[420px]:hidden mt-5 flex items-center justify-between gap-2">
                <Music2Icon className="stroke-[#adaaaa]" size={20} />
                <span className="text-sm text-nowrap mr-auto">
                  {trackMeta.total} {isTrackCount ? 'canciones' : 'canción'}
                </span>
                <span className="text-sm text-nowrap">
                  {duration.min} min {duration.stringSecs}s
                </span>
              </div>
            </div>
          </div>

          <div
            className="min-w-full w-full absolute top-[calc(100%-150px)] bg-[#0a080820] overflow-hidden"
            style={{
              // background: `linear-gradient(to bottom, ${gradientColor} 0%, #0e0e0e 100%)`,
            }}
          >
            <div className="p-6 space-y-6">
              <Footer
                songs={tracks}
                songMeta={trackMeta}
                isPlay={tracks.length > 0}
                isPublic={isPublic}
                isBackground={isBackground}
                setIsEdit={setIsEdit}
                setIsBackground={setIsBackground}
                searchTracks={(query) => {
                  setPage(0);
                  setQuery(query);
                }}
                onChangeVisibility={() => { }}
                setIsRemove={() => { }}
              />

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

            <div className="text-white select-none scroll-smooth animate-fade-in">
              {tracks.length === 0 ? (
                <SongListEmpty />
              ) : (
                <SongList
                  songs={tracks}
                  searchMeta={trackMeta}
                  onOpenPlaylistMenu={(track, index) => {
                    playlistMenuActions('open');
                    setActiveTrackIndex(index);
                    setActiveTrack(track);
                  }}
                  loadMore={() => {
                    if (page < trackMeta.totalPages) {
                      const nextPage = page + 1;
                      getTracks(nextPage);
                      setPage(nextPage);
                    }
                  }}
                />
              )}
            </div>
          </div>

          {isBackground &&
            <GradientEditor
              bgColor={bgColor}
              gradientColor={gradientColor}
              isBackground={isBackground}
              setBgColor={setBgColor}
              setGradientColor={setGradientColor}
              setGradientCSS={setGradientCSS}
              onClose={() => setIsBackground(false)}
              onSave={async () => {
                // const data = await onSavePlaylist({ ...form, bgColor, gradientColor });
                // if (data?.id) setIsBackground(false);
              }}
            />
          }
        </div>

        {isPlaylistMenu &&
          <PlaylistMenu
            actions={playlistMenuActions}
            onClose={() => setIsPlaylistMenu(false)}
          />
        }
      </div >

      {isEdit &&
        <PlaylistForm
          state={{ ...form, isPublic, coverImages }}
          onAction={onPlaylistFormAction}
          onClose={() => setIsEdit(false)}
        />
      }

      {isEditTrack &&
        <TrackModal
          isPlaylist={false}
          activeTrack={activeTrack}
          onUpdateSong={onUpdateSong}
          onClose={() => {
            setIsEditTrack(false);
            setActiveTrackIndex(null);
            setActiveTrack(null);
          }}
        />
      }

      {isRemoveSong &&
        <SongDeleteConfirm
          isOpen={isRemoveSong}
          songName={activeTrack?.title!}
          onConfirm={onRemoveSong}
          onClose={() => setIsRemoveSong(false)}
        />
      }

      <SonnerToaster
        duration={toasterTime}
        visibleToasts={1}
        position="bottom-center"
        toastOptions={{
          unstyled: true,
          style: { bottom: 80 }
        }}
      />
    </>
  )
}

export default SongPage;