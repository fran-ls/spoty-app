import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EllipsisIcon, ListIcon, MusicIcon, PauseIcon, PenIcon, PlayIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import LayoutMenu from '../components/LayoutMenu';
import ActionMenu from '../components/ActionMenu';
import EditData from '../components/EditData';
import BackgroundColor from '../components/BackgroundColor';
import DeleteConfirm from '../components/DeleteConfirm';
import SearchSongList from '../../song/components/SearchSongList';
import PlaylistSongs from '../components/PlaylistSongs';
import { usePlayer } from '../../../shared/context/PlayerContext';
import usePlaylist from '../hooks/usePlaylist';
import PlaylistMenu from '../components/PlaylistMenu';
import useAuth from '../../auth/hooks/useAuth';

const PlaylistPage: React.FC = () => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [toasterTime, setToasterTime] = useState(2500);

  const { playlistId } = useParams();
  const { user } = useAuth();
  const { isPlaying, queueMeta, play, togglePlay } = usePlayer();
  const {
    isPlay, isPublic, currentCover, playlistSongs, searchMeta, gradientColor, bgColor,
    form, isBackground, isRemove, isHover, isOpen, isEdit, isOpenAction, query, isSearch,
    searchSongs, duration, playlistMeta, playlistItems, activeItem, coverImages, setGradientColor,
    setBgColor, setForm, setIsHover, setIsEdit, setIsOpenAction, setQuery, setIsSearch, setSearchSongs,
    onFileChange, getPlaylist, onSavePlaylist, onRemovePlaylist, getPlaylistSongs, findSongs,
    addSongToPlaylist, onChangeVisibility, setIsOpen, setIsRemove, setIsBackground,
    removeSongFromPlaylist, setActiveItem, getPlaylistCover
  } = usePlaylist(playlistId);

  useEffect(() => {
    getPlaylist();
    getPlaylistSongs();
  }, [playlistId]);

  const onRemoveSong = async (id: string) => {
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
            className="line-clamp-1"
            title={activeItem?.song?.title}
          >
            {activeItem?.song?.title}
          </span>
          <span className="text-sm block text-red-500 font-medium">
            Se quitó de la lista
          </span>
        </div>
      </div>
    );
  }

  useEffect(() => { getPlaylistCover() }, [playlistSongs]);
  useEffect(() => { if (query) setTimeout(() => findSongs(), 300) }, [query]);

  return (
    <div className="min-h-full text-white select-none relative">
      <div className="animate-fade-in">
        <section
          style={{
            background: `linear-gradient(to bottom, ${bgColor} 0%, ${gradientColor} 100%)`,
          }}
          className="p-6 flex items-center gap-6 overflow-auto hide-scrollbar"
        >
          <div
            onPointerEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-[925px]:min-w-58 min-[925px]:min-h-58 w-[25vw] h-[25vw] min-w-[25vw] min-h-[25vw] rounded bg-[#262626] overflow-hidden relative"
          >
            {form.cover ? (
              <img
                className="object-cover w-full h-full"
                crossOrigin="use-credentials"
                src={form.cover}
                alt=""
              />
            ) : (
              coverImages.length > 3 ? (
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
              ) : (
                <MusicIcon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-1/2" />
              ))}

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
              {form.name || 'Mi lista'}
            </h1>

            {form.description &&
              <div className="text-sm text-slate-400">
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

              <a href="#">
                <span className="text-sm ml-2 font-bold">
                  {user?.username}
                </span>
              </a>
              <span className="text-sm ml-2 font-bold">
                •
              </span>
              <span className="text-sm ml-2 text-nowrap">
                {playlistMeta.total} canciones, {duration.min} min {duration.stringSecs}s
              </span>
            </div>
          </div>
        </section>

        <div className="p-6 text-sm bg-[#131313] text-[#adaaaa] flex items-center justify-between relative">
          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                if (queueMeta.playlistId === playlistId) {
                  return togglePlay();
                }

                play(playlistSongs, 0, { ...playlistMeta, playlistId: playlistId! });
              }}
              disabled={!isPlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black ${!isPlay ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82] cursor-pointer'
                }`}
              title="Reproducir lista"
            >
              {(isPlaying && isPlay && playlistId === queueMeta.playlistId) ?
                <PauseIcon
                  size={24}
                  fill="currentColor"
                  stroke="none"
                  className="translate-x-0"
                /> :
                <PlayIcon
                  size={24}
                  fill="currentColor"
                  stroke="none"
                  className="translate-x-px"
                />
              }
            </button>

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
                  onChangeVisibility={onChangeVisibility}
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
              className="font-semibold hover:text-white cursor-pointer h-8 px-2 flex items-center gap-2"
              type="button"
            >
              <span>Lista</span>
              <ListIcon className="inline-flex w-5 h-5" />
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

        <section className={`${(playlistSongs.length > 0 && !isSearch) ? 'block' : 'hidden'}  px-8`}>
          <PlaylistSongs
            songs={playlistSongs}
            items={playlistItems}
            playlistMeta={{ ...playlistMeta, playlistId: playlistId! }}
            setActiveItem={setActiveItem}
            loadMore={() => { }}
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
          className={`${isSearch ? 'block' : 'hidden'} bg-[#131313] min-h-[75vh] p-6 pt-0 space-y-6 relative`}
          style={{
            // background: `linear-gradient(to bottom, ${gradientColor} 0%, #131313 100%)`,
          }}
        >
          <div className="h-px bg-white/10" />

          <div className="mb-8 relative animate-fade-in">
            <label className="my-3 text-[22px] font-bold block" htmlFor="query">
              Encontremos algo para tu lista
            </label>
            <div className="text-[#adaaaa] px-3 py-2.5 text-sm w-full max-w-82 bg-[#262626] gap-2 flex items-center rounded">
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
              className="text-[#adaaaa] absolute top-1/2 right-0 -translate-1/2"
              type="button"
            >
              <XIcon strokeWidth={1.5} size={32} />
            </button>
          </div>

          <SearchSongList
            songs={searchSongs}
            searchMeta={searchMeta}
            loadMore={() => { }}
            addSongToPlaylist={async (id) => {
              const data = await addSongToPlaylist(id);
              setToasterTime(2500);
              if (data?.id) toast(
                <div className="flex items-center gap-2 p-2 pr-3 min-w-10 rounded bg-black">
                  <div className="bg-[#262626] min-w-8 w-8 h-8 rounded overflow-hidden relative">
                    {form.cover ?
                      <img
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                        className="object-cover w-full h-full"
                        crossOrigin="anonymous"
                        src={form.cover}
                        alt=""
                      /> :
                      <MusicIcon
                        className="absolute top-1/2 left-1/2 -translate-1/2"
                        size={16}
                      />
                    }
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
              const data = await onSavePlaylist({ ...form, bgColor, gradientColor });
              if (data?.id) setIsBackground(false);
            }}
          />
        }
      </div>

      {activeItem &&
        <PlaylistMenu
          onOpen={(action) => {
            switch (action) {
              case 'add-to-queue':

                return;
              case 'remove':
                onRemoveSong(activeItem?.id!);
                return;
              default:
                return;
            }
          }}
          onClose={() => setActiveItem(null)}
        />
      }

      {isEdit &&
        <EditData
          form={form}
          isPublic={isPublic}
          currentCover={currentCover}
          coverImages={coverImages}
          setForm={setForm}
          onChangeVisibility={onChangeVisibility}
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