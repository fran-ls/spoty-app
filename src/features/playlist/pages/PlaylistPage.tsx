import { useEffect, useRef } from 'react';
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

const PlaylistPage: React.FC = () => {
  const { playlistId } = useParams();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { isPlaying, togglePlay } = usePlayer();
  const {
    isPlay, isPublic, currentCover, playlistSongs, searchMeta, gradientColor, bgColor,
    form, isBackground, isRemove, isHover, isOpen, isEdit, isOpenAction, query, isSearch,
    searchSongs, setGradientColor, setBgColor, setForm, setIsBackground, setIsRemove, setIsOpen,
    setIsHover, setIsEdit, setIsOpenAction, setQuery, setIsSearch, setSearchSongs, onFileChange,
    getPlaylist, onSavePlaylist, onRemovePlaylist, getPlaylistSongs, findSongs, addSongToPlaylist,
    onChangeVisibility
  } = usePlaylist(playlistId);

  useEffect(() => {
    getPlaylist();
    getPlaylistSongs();
  }, [playlistId]);

  useEffect(() => { if (query) setTimeout(() => findSongs(), 300) }, [query]);

  return (
    <div className="min-h-full text-white select-none">
      <div className="animate-fade-in">
        <div
          style={{
            background: `linear-gradient(to bottom, ${bgColor} 0%, ${gradientColor} 100%)`,
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
                  Fran Lemus
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 text-sm bg-[#131313] text-[#adaaaa] flex items-center justify-between relative">
          <div className="flex items-center gap-5">
            <button
              onClick={togglePlay}
              disabled={!isPlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black cursor-pointer ${!isPlay ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82]'
                }`}
              title="Reproducir lista"
            >
              {(isPlaying && isPlay) ?
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

        <div className={`${(playlistSongs.length > 0 && !isSearch) ? 'block' : 'hidden'}  px-6`}>
          <PlaylistSongs
            songs={playlistSongs}
            searchMeta={searchMeta}
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
        </div>

        <div
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
              if (data?.id) toast(
                <div className="flex items-center gap-2 p-2 pr-3 min-w-10 rounded bg-black">
                  <div className="bg-[#262626] min-w-8 w-8 h-8 rounded overflow-hidden relative">
                    {form.cover ?
                      <img
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                        className="object-cover w-full h-full"
                        src={form.cover}
                        alt=""
                      /> :
                      <MusicIcon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-1/2" />
                    }
                  </div>
                  <span>
                    Añadido a {form.name}
                  </span>
                </div>
              );
            }}
          />
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
      </div>

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

      <SonnerToaster
        duration={2500}
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