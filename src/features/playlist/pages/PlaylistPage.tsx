import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircleMinusIcon, EllipsisIcon, GlobeIcon, HeartIcon, ListIcon, ListPlusIcon, LockIcon, Music2Icon, MusicIcon, PaletteIcon, PauseIcon, PenIcon, PlayIcon, PlusIcon, SearchIcon, Share2Icon, ShareIcon, XIcon } from 'lucide-react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import type { PlaylistSong } from '../playlist.types';
import LayoutMenu from '../components/LayoutMenu';
import ActionMenu from '../../../shared/components/ActionMenu';
import EditData from '../components/EditData';
import BackgroundColor from '../components/BackgroundColor';
import DeleteConfirm from '../components/DeleteConfirm';
import SearchSongList from '../../song/components/SearchSongList';
import PlaylistSongs from '../components/PlaylistSongs';
import usePlayer from '../../player/hooks/usePlayer';
import usePlaylist from '../hooks/usePlaylist';
import SmartImage from '../../../shared/components/SmartImage';
import TrackModal from '../../song/components/TrackModal';
import useLibrary from '../../library/hooks/useLibrary';
import useAuth from '../../auth/hooks/useAuth';
import PlaylistCoverImgs from '../components/PlaylistCoverImgs';
import { convertColor } from '../utils/convertColor';

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const { libraryStatus, removePlaylist } = useLibrary();
  const { currentPlaylist, isPlaying, isQueue, isPlayer, play, togglePlay, onPlaylistChange } = usePlayer();
  const {
    isPlay, isPublic, playlistSongs, searchMeta, playlist, isBackground, isRemove, isLayoutMenu,
    isOpenAction, loadingPlaylistSongs, searchSongs, playlistMeta, playlistItems,
    trackMeta, form, songSearchQuery, isSongSearch, bgColor, gradientColor, isCoverHover,
    isEdit, isPlaylistMenu, setForm, setSongSearchQuery, setIsSongSearch, setBgColor,
    setGradientColor, setIsCoverHover, setIsEdit, setIsPlaylistMenu, setIsOpenAction,
    onFileChange, getPlaylist, updatePlaylist, getPlaylistTracks, searchTracks,
    addSongToPlaylist, onChangeVisibility, setIsLayoutMenu, setIsRemove, setIsBackground,
    removeSongFromPlaylist, setSearchSongs
  } = usePlaylist();

  const [page, setPage] = useState(0);
  const [toasterTime, setToasterTime] = useState(2500);
  const [isViewTrack, setIsViewTrack] = useState(false);
  const [activeItem, setActiveItem] = useState<PlaylistSong | null>(null);

  const playlistWrapRef = useRef<HTMLDivElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const cover = form.fileUrl || form.cover;
  const username = playlist?.user?.username || 'Username';
  const isCoverImgs = playlist && playlist.coverImages && playlist.coverImages.length > 3;
  const { trackCountText, duration } = trackMeta;

  const [coverSize, setCoverSize] = useState<Record<string, string | number>>({});
  const [titleSize, setTitleSize] = useState('16px');

  const isPlaylistOwner = useMemo(() => (user && user.id === playlist?.user?.id), [user, playlist]);

  const onRemoveSongFromPlaylist = async (id: string) => {
    if (!id) return;

    const ok = await removeSongFromPlaylist(id);
    if (!ok) return;

    setActiveItem(null);
    setToasterTime(3500);

    toast(
      <div className="flex items-center gap-2 p-2 pr-3 min-w-10 rounded-lg bg-black">
        <div className="bg-[#333333] min-w-10 w-10 h-10 rounded overflow-hidden relative">
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
    setIsPlaylistMenu(false);

    if (playlistId) {
      getPlaylist(playlistId);
      getPlaylistTracks(playlistId);
    }
  }, [playlistId]);

  useEffect(() => {
    if (songSearchQuery) setTimeout(() => searchTracks({
      page: 0,
      orderBy: 'createdAt',
      order: 'desc'
    }), 300)
  }, [songSearchQuery]);

  const handleResize = () => {
    const wrap = playlistWrapRef.current;
    if (!wrap) return;

    const imgSize = `${wrap.offsetWidth * 0.25}px`;
    const imgMaxSize = '232px';

    const fontSize = window.innerWidth >= 1280 ? 96 : wrap.offsetWidth * (
      window.innerWidth >= 640 ? 0.10 : 0.08
    );

    setCoverSize({
      width: imgSize,
      height: imgSize,
      minWidth: imgSize,
      minHeight: imgSize,
      maxWidth: imgMaxSize,
      maxHeight: imgMaxSize,
      ...(window.innerWidth >= 1280 && {
        minWidth: imgMaxSize,
        minHeight: imgMaxSize
      })
    });

    setTitleSize(`${fontSize}px`);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { handleResize() }, [libraryStatus.collapsed, isQueue]);

  const colors = useMemo(() => ({
    bg: bgColor, // #0070E0FF, #0009, #535353
    base: gradientColor, // #00218FFF, #131313
    base70: convertColor(gradientColor, 'hsl', 70) // rgba(0, 33, 143, 0.7)
  }), [bgColor, gradientColor, playlist]);

  return (
    <div className="min-h-full text-white select-none relative">
      <div className="animate-fade-in relative">
        <section
          style={{
            background: `linear-gradient(in oklch to bottom, ${colors.bg} 0%, ${colors.base} 100%)`
          }}
          className="min-[500px]:flex-row min-[500px]:pb-6 pb-3 p-6 flex-col flex items-center gap-x-6 overflow-auto hide-scrollbar max-[500px]:relative"
          ref={playlistWrapRef}
        >
          <div
            onPointerEnter={() => isPlaylistOwner && setIsCoverHover(true)}
            onMouseLeave={() => isPlaylistOwner && setIsCoverHover(false)}
            style={{
              ...(window.innerWidth >= 500 && coverSize),
              maxWidth: '232px',
              maxHeight: '232px'
            }}
            className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-w-40 min-h-40 w-[25vw] h-[25vw] min-[500px]:rounded bg-[#262626] overflow-hidden relative transition-all duration-100 shadow-[0_4px_60px_#00000080]"
          >
            <SmartImage
              wrapClassName="w-full h-full"
              icon={<MusicIcon className="w-1/4 h-1/4" />}
              url={cover}
            />

            {(!playlist?.cover && isCoverImgs) && (
              <PlaylistCoverImgs images={playlist.coverImages || []} />
            )}

            {isCoverHover &&
              <>
                <button
                  onClick={() => {
                    if (!isPlaylistOwner) return;
                    coverInputRef.current?.click();
                    setIsEdit(true);
                  }}
                  className={`${(cover || isCoverImgs) ? 'bg-black/50' : 'bg-[#262626]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
                  type="button"
                >
                  <PenIcon className="w-1/4 h-1/4 sm:max-w-11 sm:max-h-11" />
                  <span className="">
                    Elegir foto
                  </span>
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
                  className="hover:text-white bg-black max-w-7 max-h-7 w-[18%] h-[18%] rounded-full flex flex-col items-center gap-1 justify-center absolute top-3 right-3"
                  type="button"
                >
                  <EllipsisIcon className="w-[75%] h-[75%]" />
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

          <div className="overflow-hidden mt-auto w-full">
            <span className="min-[500px]:block hidden text-sm font-medium">
              Lista {isPublic ? 'pública' : 'privada'}
            </span>
            <h1
              style={{
                fontSize: titleSize
              }}
              onClick={() => isPlaylistOwner && setIsEdit(true)}
              className={`min-[500px]:mb-0 max-[500px]:mt-2 font-black truncate ${isPlaylistOwner ? 'cursor-pointer' : ''} ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font' : 'playlist-title-font'}`}
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

              {(playlist?.trackCount && playlist?.trackCount > 0) ? (
                <>
                  <span className="min-[500px]:inline-flex hidden text-sm ml-2 font-bold">
                    •
                  </span>
                  <span className="min-[500px]:inline-flex hidden text-sm ml-2 text-nowrap">
                    {playlist?.trackCount} {trackCountText} {duration}
                  </span>
                </>
              ) : <></>}

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
              </div>
            </div>

            <span className="min-[500px]:hidden block mt-5 text-sm text-nowrap mr-auto">
              {playlist?.trackCount ? `${playlist?.trackCount} ${trackCountText} ${duration}` : '0'}
            </span>
          </div>
        </section>

        {/* MOBILE */}
        <div
          style={{
            background: `linear-gradient(to bottom, ${colors.base} 0%, #131313 100%)`
          }}
          className="min-[500px]:hidden w-full px-6 pb-5"
        >
          <div className="text-[#adaaaa] flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button
                className="flex items-center justify-center h-8 cursor-pointer"
                type="button"
              >
                <HeartIcon className="w-6 h-6" />
              </button>
              <button
                className="flex items-center justify-center h-8 cursor-pointer"
                type="button"
              >
                <Share2Icon className="w-5.5 h-5.5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsPlaylistMenu(true)}
                  className="flex items-center justify-center h-8 cursor-pointer"
                  type="button"
                >
                  <EllipsisIcon className="w-6 h-6 rotate-90" />
                </button>

                {(isPlaylistMenu && isPlaylistOwner) &&
                  <div
                    onMouseLeave={() => setIsPlaylistMenu(false)}
                    className="z-10 absolute top-0 left-0"
                  >
                    <ActionMenu
                      onClose={() => setIsPlaylistMenu(false)}
                      styles={{
                        wrap: "min-w-[160px]"
                      }}
                      items={[{
                        label: 'Fondo',
                        icon: (
                          <PaletteIcon size={18} />
                        ),
                        onAction: () => setIsBackground(!isBackground)
                      }, {
                        label: 'Editar datos',
                        icon: (
                          <PenIcon size={18} />
                        ),
                        onAction: () => {
                          setIsEdit(true);
                          setIsPlaylistMenu(false);
                          setIsBackground(false);
                          setIsRemove(false);
                        }
                      }, {
                        label: 'Eliminar',
                        icon: (
                          <CircleMinusIcon size={18} />
                        ),
                        onAction: () => {
                          setIsEdit(false);
                          setIsPlaylistMenu(false);
                          setIsBackground(false);
                          setIsRemove(true);
                        }
                      }, {
                        label: `Hacer ${isPublic ? 'privada' : 'pública'}`,
                        icon: (
                          !isPublic
                            ? <GlobeIcon size={18} />
                            : <LockIcon size={18} />
                        ),
                        onAction: () => onChangeVisibility(playlistId!)
                      }]}
                    />
                  </div>
                }
              </div>
            </div>

            <button
              onClick={() => {
                if (currentPlaylist?.id === playlistId) {
                  return togglePlay();
                }

                onPlaylistChange(playlist);
                play(playlistSongs, 0, playlistMeta);
              }}
              disabled={!isPlay}
              className={`max-w-14 max-h-14 w-[14vw] h-[14vw] rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black ${!isPlay ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82] cursor-pointer'}`}
              title={isPlaying ? "Pausar lista" : "Reproducir lista"}
            >
              {(isPlaying && isPlay && playlistId === currentPlaylist?.id) ?
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
          </div>
        </div>

        {/* DESKTOP */}
        <div
          style={{
            backgroundImage: `linear-gradient(in oklch to bottom, ${colors.base70}, transparent), none`
            // backgroundImage: `linear-gradient(in oklch to bottom, color-mix(in srgb, ${bgColor} 70%, transparent), transparent), none`
          }}
          className="min-[500px]:block hidden absolute left-0 h-43.25 w-full"
        />

        <div className="min-[500px]:flex hidden py-5 px-6 mb-2 text-sm text-[#adaaaa] items-center justify-between relative">
          <div className="md:gap-5 gap-3 flex items-center">
            <button
              onClick={() => {
                if (currentPlaylist?.id === playlistId) {
                  return togglePlay();
                }

                onPlaylistChange(playlist);
                play(playlistSongs, 0, playlistMeta);
              }}
              disabled={!isPlay}
              className={`min-[500px]:max-w-14 min-[500px]:max-h-14 w-[10vw] h-[10vw] max-w-10 max-h-10 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black ${!isPlay ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82] cursor-pointer'}`}
              title={isPlaying ? "Pausar lista" : "Reproducir lista"}
            >
              {(isPlaying && isPlay && playlistId === currentPlaylist?.id) ?
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
                onClick={() => isPlaylistOwner && setIsPlaylistMenu(true)}
                className="flex items-center justify-center h-8 px-2 hover:text-white cursor-pointer"
                type="button"
              >
                <EllipsisIcon className="w-8 h-8" />
              </button>

              {(isPlaylistMenu && isPlaylistOwner) &&
                <div
                  onMouseLeave={() => setIsPlaylistMenu(false)}
                  className="p-3 z-10 absolute -top-3 -left-3"
                >
                  <ActionMenu
                    onClose={() => setIsPlaylistMenu(false)}
                    styles={{
                      wrap: "min-w-[160px]"
                    }}
                    items={[{
                      label: 'Fondo',
                      icon: (
                        <PaletteIcon size={18} />
                      ),
                      onAction: () => setIsBackground(!isBackground)
                    }, {
                      label: 'Editar datos',
                      icon: (
                        <PenIcon size={18} />
                      ),
                      onAction: () => {
                        setIsEdit(true);
                        setIsPlaylistMenu(false);
                        setIsBackground(false);
                        setIsRemove(false);
                      }
                    }, {
                      label: 'Eliminar',
                      icon: (
                        <CircleMinusIcon size={18} />
                      ),
                      onAction: () => {
                        setIsEdit(false);
                        setIsPlaylistMenu(false);
                        setIsBackground(false);
                        setIsRemove(true);
                      }
                    }, {
                      label: `Hacer ${isPublic ? 'privada' : 'pública'}`,
                      icon: (
                        !isPublic
                          ? <GlobeIcon size={18} />
                          : <LockIcon size={18} />
                      ),
                      onAction: () => onChangeVisibility(playlistId!)
                    }]}
                  />
                </div>
              }
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsLayoutMenu(!isLayoutMenu)}
              className="font-semibold hover:text-white cursor-pointer h-8 flex items-center gap-2"
              type="button"
            >
              <span>Lista</span>
              <ListIcon className="inline-flex" size={20} />
            </button>

            {isLayoutMenu && <LayoutMenu onClose={() => setIsLayoutMenu(!isLayoutMenu)} />}
          </div>
        </div>

        {(!isSongSearch && !playlistSongs.length && isPlaylistOwner) && (
          <div className="text-white ml-auto flex-1 flex">
            <button
              onClick={() => setIsSongSearch(true)}
              className="z-2 font-bold py-1 px-2 my-5 ml-auto mr-6 text-white text-xs rounded-full"
              type="button"
              disabled={false}
            >
              Buscar más
            </button>
          </div>
        )}

        {(playlistSongs.length > 0 && !isSongSearch) && (
          <section className="sm:px-5 p-1 animate-fade-in z-50">
            <PlaylistSongs
              items={playlistItems}
              playlistMeta={playlistMeta}
              onPlay={(index) => {
                onPlaylistChange(playlist);
                play(playlistSongs, index, playlistMeta);
              }}
              getItem={(item) => {
                setActiveItem(item);
                setIsOpenAction(true);
              }}
              loadMore={() => {
                if (page > playlistMeta.totalPages || loadingPlaylistSongs) return;
                const nextPage = page + 1;
                getPlaylistTracks(playlistId!, { page: nextPage });
                setPage(nextPage);
              }}
            />

            {isPlaylistOwner && (
              <div className="text-white ml-auto flex-1 flex">
                <button
                  onClick={() => setIsSongSearch(true)}
                  className="font-bold py-1 px-2 my-5 text-white text-xs rounded-full ml-auto"
                  type="button"
                >
                  Buscar más
                </button>
              </div>
            )}
          </section>
        )}

        {(isSongSearch && isPlaylistOwner) && (
          <section className="min-h-[75vh] sm:p-6 px-3 pb-6 pt-0 space-y-6 relative">
            <div className="h-px bg-white/10" />

            <div className="mb-8 relative animate-fade-in">
              <label className="my-3 min-[460px]:text-[22px] text-[18px] font-bold block" htmlFor="query">
                {window.innerWidth >= 360 ? 'Encontremos algo para tu lista' : 'Busca algo'}
              </label>
              <div className="text-[#adaaaa] px-3 py-2.5 text-sm w-full min-[460px]:max-w-82 bg-[#262626] gap-2 flex items-center rounded">
                <SearchIcon className="min-w-5 w-5 h-5" />
                <input
                  value={songSearchQuery}
                  onChange={(e) => setSongSearchQuery(e.target.value)}
                  className="w-full min-h-full"
                  placeholder="Buscar canciones"
                  name="query"
                  type="text"
                />
                {songSearchQuery &&
                  <button
                    onClick={() => {
                      setSongSearchQuery('');
                      setSearchSongs([]);
                    }}
                    type="button"
                  >
                    <XIcon className="min-w-5 w-5 h-5" />
                  </button>
                }
              </div>

              <button
                onClick={() => setIsSongSearch(false)}
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
                const { status } = await addSongToPlaylist({ playlistId: playlistId!, songId: id });
                setToasterTime(2500);
                if (status === 201) toast(
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
        )}
      </div>

      {isBackground && (
        <BackgroundColor
          bgColor={bgColor}
          gradientColor={gradientColor}
          isBackground={isBackground}
          setBgColor={setBgColor}
          setGradientColor={setGradientColor}
          onClose={() => setIsBackground(false)}
          onSave={async () => {
            const data = await updatePlaylist(playlistId!, {
              ...form, bgColor, gradientColor
            });
            if (data?.id) setIsBackground(false);
          }}
        />
      )}

      {isOpenAction &&
        <div
          onMouseLeave={() => setIsOpenAction(false)}
          className={`${!isPlayer ? 'md:right-15 right-2' : 'md:right-76 right-2'} w-45 z-100 bg-[#282828] rounded fixed bottom-22`}
        >
          <ActionMenu
            onClose={() => setIsOpenAction(false)}
            styles={{
              wrap: "min-w-[160px]"
            }}
            items={[{
              label: 'Añadir a lista',
              icon: (
                <PlusIcon size={18} />
              )
            },
            ...(!isPlaylistOwner ? [] : [{
              label: 'Quitar de la lista',
              icon: (
                <CircleMinusIcon size={18} />
              ),
              onAction: () => onRemoveSongFromPlaylist(activeItem?.id!)
            }]),
            ...[{
              label: 'Añadir a la cola',
              icon: (
                <ListPlusIcon size={18} />
              )
            }, {
              label: 'Ver pista',
              icon: (
                <Music2Icon size={18} />
              ),
              onAction: () => setIsViewTrack(true)
            }, {
              label: 'Compartir',
              icon: (
                <ShareIcon size={18} />
              )
            }]]}
          />
        </div>
      }

      {isEdit &&
        <EditData
          form={form}
          isPublic={isPublic}
          coverImages={playlist?.coverImages || []}
          coverInputRef={coverInputRef}
          setForm={setForm}
          onChangeVisibility={() => onChangeVisibility(playlistId!)}
          onSave={() => updatePlaylist(playlistId!, { ...form, bgColor, gradientColor })}
          onClose={() => setIsEdit(false)}
        />
      }

      {isRemove &&
        <DeleteConfirm
          isOpen={isRemove}
          playlistName={form.name}
          onClose={() => setIsRemove(false)}
          onConfirm={() => removePlaylist(playlistId!)}
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