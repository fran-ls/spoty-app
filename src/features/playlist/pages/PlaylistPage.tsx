import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EllipsisIcon, ListIcon, Music2Icon, MusicIcon, PauseIcon, PenIcon, PlayIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import type { PlaylistSong } from '../playlist.types';
import LayoutMenu from '../components/LayoutMenu';
import ActionMenu from '../components/ActionMenu';
import EditData from '../components/EditData';
import BackgroundColor from '../components/BackgroundColor';
import DeleteConfirm from '../components/DeleteConfirm';
import SearchSongList from '../../song/components/SearchSongList';
import PlaylistSongs from '../components/PlaylistSongs';
import { usePlayer } from '../../../shared/context/PlayerContext';
import usePlaylist from '../hooks/usePlaylist';
import PlaylistMenu, { type PlaylistMenuAction } from '../components/PlaylistMenu';
import useAuth from '../../auth/hooks/useAuth';
import SmartImage from '../../../shared/components/SmartImage';
import TrackModal from '../../song/components/TrackModal';

const PlaylistPage: React.FC = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const { isPlaying, queueMeta, play, togglePlay } = usePlayer();
  const {
    isPlay, isPublic, playlistSongs, searchMeta, gradientColor, bgColor,
    form, isBackground, isRemove, isHover, isOpen, isEdit, isOpenAction, query, isSearch,
    searchSongs, duration, playlistMeta, playlistItems, coverImages, setGradientColor,
    setBgColor, setForm, setIsHover, setIsEdit, setIsOpenAction, setQuery, setIsSearch,
    onFileChange, getPlaylist, onSavePlaylist, onRemovePlaylist, getPlaylistTracks, searchTracks,
    addSongToPlaylist, onChangeVisibility, setIsOpen, setIsRemove, setIsBackground,
    removeSongFromPlaylist, getPlaylistCover, setSearchSongs
  } = usePlaylist();

  const [page, setPage] = useState(0);
  const [toasterTime, setToasterTime] = useState(2500);
  const [isViewTrack, setIsViewTrack] = useState(false);
  const [isPlaylistMenu, setIsPlaylistMenu] = useState(false);
  const [activeItem, setActiveItem] = useState<PlaylistSong | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const cover = form.fileUrl || form.cover;
  const username = user?.username?.split(' ')[0] || 'Username';
  const isTrackCount = playlistMeta.total === 0 || playlistMeta.total > 1;

  function playlistMenuActions(action: PlaylistMenuAction | 'open') {
    const onClose = () => setIsPlaylistMenu(false);

    switch (action) {
      case 'open':
        setIsPlaylistMenu(true);
        return;
      case 'add-to-queue':
        onClose();
        return;
      case 'remove':
        onRemoveTrack(activeItem?.id!);
        onClose();
        return;
      case 'view-track':
        setIsViewTrack(true);
        onClose();
        return;
      case 'share':
        onClose();
        return;
      case 'close':
        onClose();
        return;
      default:
        onClose();
        return;
    }
  }

  const onRemoveTrack = async (id: string) => {
    if (!id) return;

    const ok = await removeSongFromPlaylist(id);
    if (!ok) return;

    setActiveItem(null);
    setToasterTime(3500);

    toast(
      <div className="flex items-center gap-2 p-2 pr-3 min-w-10 rounded-lg bg-black">
        <div className="bg-[#262626] min-w-10 w-10 h-10 rounded overflow-hidden relative">
          <MusicIcon
            className="absolute top-1/2 left-1/2 -translate-1/2"
            size={20}
          />
        </div>
        <div>
          <span
            className="line-clamp-1 font-medium"
            title={activeItem?.song?.title}
          >
            {activeItem?.song?.title}
          </span>
          <span className="text-sm block text-red-500">
            Se quitó de la lista
          </span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (playlistId) {
      getPlaylist(playlistId);
      getPlaylistTracks(playlistId);
    }
  }, [playlistId]);

  useEffect(() => { getPlaylistCover() }, [playlistSongs]);
  useEffect(() => { if (query) setTimeout(() => searchTracks({ page: 0 }), 300) }, [query]);

  return (
    <div className="min-h-full text-white select-none relative">
      <div className="animate-fade-in">
        <section
          style={{
            background: `linear-gradient(to bottom, ${bgColor} 0%, ${gradientColor} 100%)`,
          }}
          className="min-[500px]:flex-row min-[500px]:pt-6 pt-10 px-6 pb-6 flex-col flex items-center gap-6 overflow-auto hide-scrollbar"
        >
          <div
            onPointerEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-[925px]:min-w-58 min-[925px]:min-h-58 min-[500px]:min-w-[25vw] min-[500px]:min-h-[25vw] min-w-40 min-h-40 w-[25vw] h-[25vw] min-[500px]:rounded bg-[#262626] overflow-hidden relative"
          >
            <SmartImage
              wrapClassName="w-full h-full"
              icon={<MusicIcon className="w-1/4 h-1/4" />}
              url={cover}
            />

            {!cover && coverImages.length > 3 && (
              coverImages.map((d, i) => {
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
              })
            )}

            {isHover &&
              <>
                <button
                  onClick={() => {
                    coverInputRef.current?.click();
                    setIsEdit(true);
                  }}
                  className={`${(cover || coverImages.length > 3) ? 'bg-black/50' : 'bg-[#262626]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
                  type="button"
                >
                  <PenIcon className="w-[25%] h-[25%] sm:w-10 sm:h-10" />
                  <span>Elegir foto</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (form.fileUrl) URL.revokeObjectURL(form.fileUrl);
                    setForm({
                      ...form,
                      file: null,
                      fileUrl: ''
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
            <span className="min-[500px]:block hidden text-sm font-medium">
              Lista {isPublic ? 'pública' : 'privada'}
            </span>
            <h1
              onClick={() => setIsEdit(true)}
              className={`min-[500px]:mb-0 mb-5 min-[500px]:text-left text-center  font-black cursor-pointer ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font' : 'playlist-title-font truncate'}`}
              title={form.name}
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
                {playlistMeta.total} {isTrackCount ? 'canciones' : 'canción'}, {duration.min} min {duration.stringSecs}s
              </span>

              <div className="min-[500px]:hidden flex-wrap gap-2 flex w-full items-center justify-between">
                <div>
                  <a href="#" className="hover:underline">
                    <span className="text-sm ml-2 font-bold">
                      {username}
                    </span>
                  </a>
                  <span className="text-sm mx-2 font-bold">
                    •
                  </span>
                  <span className="text-sm font-medium">
                    {isPublic ? 'Pública' : 'Privada'}
                  </span>
                </div>
                <span className="min-[420px]:inline-flex hidden text-sm ml-2 text-nowrap">
                  {playlistMeta.total} {isTrackCount ? 'canciones' : 'canción'}, {duration.min} min {duration.stringSecs}s
                </span>
              </div>
            </div>

            <div className="min-[420px]:hidden mt-5 flex items-center justify-between gap-2">
              <Music2Icon className="stroke-[#adaaaa]" size={20} />
              <span className="text-sm text-nowrap mr-auto">
                {playlistMeta.total} {isTrackCount ? 'canciones' : 'canción'}
              </span>
              <span className="text-sm text-nowrap">
                {duration.min} min {duration.stringSecs}s
              </span>
            </div>
          </div>
        </section>

        <div className="p-5 mb-2 text-sm bg-[#131313] text-[#adaaaa] flex items-center justify-between relative">
          <div className="md:gap-5 gap-3 flex items-center">
            <button
              onClick={() => {
                if (queueMeta.playlistId === playlistId) {
                  return togglePlay();
                }

                play(playlistSongs, 0, { ...playlistMeta, playlistId: playlistId! });
              }}
              disabled={!isPlay}
              className={`md:max-w-14 md:max-h-14 w-[10vw] h-[10vw] max-w-10 max-h-10 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black ${!isPlay ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82] cursor-pointer'}`}
              title="Reproducir lista"
            >
              {(isPlaying && isPlay && playlistId === queueMeta.playlistId) ?
                <PauseIcon
                  className="w-1/2 h-1/2 max-w-6 max-h-6 translate-x-0"
                  fill="currentColor"
                  stroke="none"
                /> :
                <PlayIcon
                  className="w-1/2 h-1/2 max-w-6 max-h-6 translate-x-px"
                  fill="currentColor"
                  stroke="none"
                />
              }
            </button>

            <div className="relative">
              <button
                onClick={() => setIsOpenAction(!isOpenAction)}
                className="flex items-center justify-center h-8 px-2 hover:text-white cursor-pointer"
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
                  onChangeVisibility={() => onChangeVisibility(playlistId!)}
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
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="font-semibold hover:text-white cursor-pointer h-8 flex items-center gap-2"
              type="button"
            >
              <span>Lista</span>
              <ListIcon className="inline-flex" size={20} />
            </button>

            {isOpen && <LayoutMenu onClose={() => setIsOpen(!isOpen)} />}
          </div>
        </div>

        {!isSearch && playlistSongs.length === 0 &&
          <div className="text-white ml-auto flex-1 flex">
            <button
              onClick={() => setIsSearch(true)}
              className="font-bold py-1 px-2 my-5 ml-auto mr-6 text-white text-xs rounded-full"
              type="button"
            >
              Buscar más
            </button>
          </div>
        }

        <section className={`${(playlistSongs.length > 0 && !isSearch) ? 'block' : 'hidden'} sm:px-5 p-1 animate-fade-in`}>
          <PlaylistSongs
            songs={playlistSongs}
            items={playlistItems}
            playlistMeta={{ ...playlistMeta, playlistId: playlistId! }}
            getItem={(item) => {
              setActiveItem(item);
              playlistMenuActions('open');
            }}
            loadMore={() => {
              if (page < playlistMeta.totalPages) {
                const nextPage = page + 1;
                getPlaylistTracks(playlistId!, { page: nextPage });
                setPage(nextPage);
              }
            }}
          />

          <div className="text-white ml-auto flex-1 flex">
            <button
              onClick={() => setIsSearch(true)}
              className="font-bold py-1 px-2 my-5 text-white text-xs rounded-full ml-auto"
              type="button"
            >
              Buscar más
            </button>
          </div>
        </section>

        <section
          className={`${isSearch ? 'block' : 'hidden'} bg-[#131313] min-h-[75vh] sm:p-6 px-3 pb-6 pt-0 space-y-6 relative`}
          style={{
            // background: `linear-gradient(to bottom, ${gradientColor} 0%, #131313 100%)`,
          }}
        >
          <div className="h-px bg-white/10" />

          <div className="mb-8 relative animate-fade-in">
            <label className="my-3 min-[460px]:text-[22px] text-[18px] font-bold block" htmlFor="query">
              {window.innerWidth >= 360 ? 'Encontremos algo para tu lista' : 'Busca algo'}
            </label>
            <div className="text-[#adaaaa] px-3 py-2.5 text-sm w-full min-[460px]:max-w-82 bg-[#262626] gap-2 flex items-center rounded">
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
                  onClick={() => {
                    setQuery('');
                    setSearchSongs([]);
                  }}
                  type="button"
                >
                  <XIcon className="min-w-5 w-5 h-5" />
                </button>
              }
            </div>

            <button
              onClick={() => setIsSearch(false)}
              className="text-[#adaaaa] bg-[#131313] absolute min-[460px]:top-1/2 top-0 right-0 min-[460px]:-translate-1/2"
              type="button"
            >
              <XIcon className="w-7 h-7 min-[460px]:w-8 min-[460px]:h-8" strokeWidth={1.5} />
            </button>
          </div>

          <SearchSongList
            songs={searchSongs}
            searchMeta={searchMeta}
            loadMore={() => { }}
            addSongToPlaylist={async (id) => {
              const data = await addSongToPlaylist({ playlistId: playlistId!, songId: id });
              setToasterTime(2500);
              if (data?.id) toast(
                <div className="flex items-center gap-2 p-2 pr-3 min-w-10 rounded bg-black">
                  <div className="bg-[#262626] min-w-8 w-8 h-8 rounded overflow-hidden relative">
                    <SmartImage
                      url={cover}
                      wrapClassName="w-full h-full"
                      icon={<MusicIcon size={16} />}
                    />
                  </div>
                  <span>
                    Añadido a {form.name}
                  </span>
                </div>
              );
            }}
          />
        </section>

        {isBackground &&
          <BackgroundColor
            bgColor={bgColor}
            gradientColor={gradientColor}
            isBackground={isBackground}
            setBgColor={setBgColor}
            setGradientColor={setGradientColor}
            onClose={() => setIsBackground(false)}
            onSave={async () => {
              const data = await onSavePlaylist(playlistId!, {
                ...form, bgColor, gradientColor
              });
              if (data?.id) setIsBackground(false);
            }}
          />
        }
      </div>

      {isPlaylistMenu &&
        <PlaylistMenu
          actions={playlistMenuActions}
          onClose={() => playlistMenuActions('close')}
        />
      }

      {isEdit &&
        <EditData
          form={form}
          isPublic={isPublic}
          coverImages={coverImages}
          coverInputRef={coverInputRef}
          setForm={setForm}
          onChangeVisibility={() => onChangeVisibility(playlistId!)}
          onSave={() => onSavePlaylist(playlistId!)}
          onClose={() => setIsEdit(false)}
        />
      }

      {isRemove &&
        <DeleteConfirm
          isOpen={isRemove}
          playlistName={form.name}
          onClose={() => setIsRemove(false)}
          onConfirm={() => onRemovePlaylist(playlistId!)}
        />
      }

      {isViewTrack &&
        <TrackModal
          onUpdateSong={async () => { }}
          activeTrack={activeItem?.song || null}
          onClose={() => setIsViewTrack(false)}
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
    </div>
  )
}

export default PlaylistPage;