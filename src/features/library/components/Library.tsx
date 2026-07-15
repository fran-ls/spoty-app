import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, SearchIcon, ListIcon, XIcon, PauseIcon, PlayIcon, PanelTopCloseIcon, PanelTopOpenIcon, LayoutGridIcon, TextAlignJustify, Minimize2Icon, GlobeIcon, LockIcon, GlobeLockIcon } from 'lucide-react';
import type { PlaylistFilters } from '../../playlist/playlist.types';
import { PlaylistLayout, PlaylistOrderBy, PlaylistVisibility } from '../library.types';
import { usePlayer } from '../../../shared/context/PlayerContext';
import { routes } from '../../../shared/utils/routes';
import CustomMenu from './CustomMenu';
import playlistService from '../../playlist/services/playlist.service';
import useAuth from '../../auth/hooks/useAuth';
import usePlaylist from '../../playlist/hooks/usePlaylist';
import SmartImage from '../../../shared/components/SmartImage';
import MenuItem from '../../../shared/components/MenuItem';
import PlaylistItem from './PlaylistItem';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import { getDeviceType } from '../../../shared/utils/getDeviceType';
import { STYLES } from '../../../shared/utils/styles';
import useUserLibrary from '../hooks/useUserLibrary';
import libraryService from '../services/library.service';

interface LibraryProps {
  isPage?: boolean;
  isCollapsed?: boolean;
  isExpanded?: boolean;
}

export const Library = (props: LibraryProps) => {
  const { isAdmin, user } = useAuth();
  const { playlists, playlistMeta, getUserPlaylists } = usePlaylist();
  const { isPlaying, queueMeta, togglePlay } = usePlayer();
  const {
    library, layout, orderBy, systemPlaylists, getUserLibrary,
    onLayoutChange, onSortBy, onSizeChange, getSystemPlaylists
  } = useUserLibrary();

  const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed ?? false);
  const [isExpanded, setIsExpanded] = useState(props.isExpanded ?? false);
  const [isVisibilityMenu, setIsVisibilityMenu] = useState(false);
  const [visibility, setVisibility] = useState<PlaylistVisibility | ''>('');

  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const orderKind = orderBy.value === PlaylistOrderBy.RECENT ? 'desc' : 'asc';

  const filters: PlaylistFilters = {
    page: 0,
    name: query.trim(),
    orderBy: orderBy.k,
    order: orderKind,
    ...(visibility && { isPublic: visibility === PlaylistVisibility.PUBLIC })
  }

  const { loaderRef } = useInfiniteScroll(async () => {
    if (playlistMeta.hasNextPage && user?.id) {
      await getUserPlaylists(
        user.id,
        { ...filters, page: page + 1 },
        undefined
      );
      setPage(page + 1);
    }
  });

  const navigate = useNavigate();

  const onSavePlaylist = async () => {
    const { data } = await playlistService.newPlaylist({
      name: '',
      description: '',
      cover: '',
      isPublic: false,
      gradientColor: '',
      bgColor: '',
      userId: user?.id!,
      file: null
    }, true);

    if (data?.id) {
      navigate(`${routes.playlists}/${data.id}`);
    }
  }

  useEffect(() => {
    user?.id && getUserLibrary(user.id).then((data) => {
      if (!data || props.isPage) return;
      setIsCollapsed(data.isCollapsed);
      setIsExpanded(data.isExpanded);
    })
  }, [user]);

  useEffect(() => {
    setPage(0);

    setTimeout(() => {
      user?.id && getUserPlaylists(
        user.id,
        { ...filters, page: 0 },
        undefined
      )

      isAdmin && getSystemPlaylists(filters);
    }, 300);
  }, [query, orderBy, visibility]);

  const grid = {
    s: 'min-[420px]:grid-cols-[minmax(200px,2fr)_70px]',
    sm: 'sm:grid-cols-[minmax(200px,2fr)_1fr]',
    md: 'md:grid-cols-[minmax(200px,2fr)_1fr_1fr]',
    lg: 'lg:grid-cols-[minmax(200px,2fr)_1fr_1fr_minmax(180px,1fr)]'
  }

  const device = getDeviceType();
  const isDesktop = device === 'desktop';

  return (
    <aside
      onClick={() => !query && setIsSearch(false)}
      className={`${isCollapsed ? 'w-18' : isExpanded ? 'w-full' : 'w-72'} ${isExpanded ? 'flex' : 'md:flex hidden'} rounded-lg h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 transition-all duration-300 ease-in-out relative`}
      id="spotify-sidebar"
    >
      <div className={`rounded-lg ${STYLES.minHeightMain} ${STYLES.maxHeightMain}`}>
        <header className="p-4 text-[#adaaaa] relative">
          <div className={`${isCollapsed ? 'flex-col gap-4' : 'flex-row'} flex items-center justify-between`}>
            {!isExpanded && (
              <button
                onClick={() => {
                  const collapsed = !isCollapsed;
                  setIsCollapsed(collapsed);
                  onSizeChange(library.id, collapsed, false);
                }}
                className="p-2 rounded-lg text-[#adaaaa] hover:text-white cursor-pointer transition-colors duration-100"
                title={isCollapsed ? "Abre Tu biblioteca" : "Contraer Tu biblioteca"}
              >
                {isCollapsed ?
                  <PanelTopOpenIcon
                    className="-rotate-90"
                    size={20}
                  /> :
                  <PanelTopCloseIcon
                    className="-rotate-90"
                    size={20}
                  />
                }
              </button>
            )}

            {!isCollapsed &&
              <button
                onClick={() => {
                  const expanded = true;
                  setIsExpanded(true);
                  onSizeChange(library.id, false, expanded);
                }}
                className={`${!isExpanded ? 'cursor-pointer' : ''}`}
                type="button"
              >
                <h3 className="text-white font-black text-nowrap">
                  Tu biblioteca
                </h3>
              </button>
            }

            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => {
                  libraryService.newUserLibrary({ userId: user!.id })
                }}
                onClick={onSavePlaylist}
                className={`${isExpanded ? 'p-2 px-4' : 'p-2'} hover:bg-white/10 cursor-pointer bg-[#1f1f1f] text-sm font-medium rounded-full gap-2 flex items-center transition-colors duration-100`}
                title="Crea una lista"
                type="button"
              >
                <PlusIcon className="w-5 h-5" />

                {(!isCollapsed && isExpanded) &&
                  <span className="text-white">
                    Lista
                  </span>
                }
              </button>

              {(isExpanded && !props.isPage) && (
                <button
                  onClick={() => {
                    const expanded = false;
                    setIsExpanded(expanded);
                    onSizeChange(library.id, isCollapsed, expanded);
                  }}
                  className="p-2 rounded-full text-[#adaaaa] hover:bg-white/10 hover:text-white cursor-pointer transition-colors duration-100"
                  title="Contraer Tu biblioteca"
                >
                  <Minimize2Icon size={20} />
                </button>
              )}
            </div>
          </div>

          {!isCollapsed &&
            <div className={`min-[520px]:flex-row flex-col mt-4 text-[#adaaaa] flex items-center justify-between gap-5 relative`}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearch(true);
                }}
                className={`${(isSearch || isExpanded) ? 'w-full bg-[#1f1f1f] rounded' : 'w-8 h-8 rounded-full'} sm:max-w-100 z-5 transition-all duration-100 hover:bg-[#1f1f1f] px-2 py-1.5 text-sm cursor-pointer flex items-center`}
              >
                <SearchIcon className="min-w-4 w-4 h-4" />

                {(isSearch || isExpanded) &&
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full ml-2"
                    placeholder={!isExpanded ? "Buscar" : "Buscar en Tu biblioteca"}
                    type="text"
                  />
                }

                {isSearch && query &&
                  <XIcon
                    className="min-w-4 w-5 h-5"
                    onClick={() => setQuery('')}
                  />
                }
              </div>

              <div className="min-[520px]:w-fit w-full flex items-center justify-between gap-5">
                {isExpanded && (
                  <div className="min-[520px]:ml-auto relative">
                    <button
                      onClick={() => setIsVisibilityMenu(!isVisibilityMenu)}
                      className="z-5 cursor-pointer hover:text-white text-sm flex items-center gap-2"
                      type="button"
                    >
                      {(!isSearch || isExpanded) &&
                        <span className="font-semibold">
                          {visibility === '' && 'Visibilidad'}
                          {visibility === PlaylistVisibility.PUBLIC && 'Pública'}
                          {visibility === PlaylistVisibility.PRIVATE && 'Privada'}
                        </span>
                      }

                      {visibility === PlaylistVisibility.PUBLIC && <GlobeIcon size={18} />}
                      {visibility === PlaylistVisibility.PRIVATE && <LockIcon size={18} />}
                      {visibility === '' && <GlobeLockIcon size={18} />}
                    </button>

                    <MenuItem
                      isBtn={false}
                      open={isVisibilityMenu}
                      onClose={() => setIsVisibilityMenu(false)}
                      styles={{
                        backdrop: 'z-14 bg-transparent',
                        wrap: `min-[520px]:right-0 max-[520px]:left-0 w-32 z-14 absolute top-full mt-3.5 min-w-0`,
                        menu: 'w-full'
                      }}
                      items={[
                        {
                          label: 'Todo',
                          action: 'close',
                          icon: <GlobeLockIcon size={20} />,
                          onAction: () => setVisibility('')
                        },
                        {
                          label: 'Privada',
                          action: 'close',
                          icon: <LockIcon size={20} />,
                          onAction: () => setVisibility(PlaylistVisibility.PRIVATE)
                        },
                        {
                          label: 'Pública',
                          action: 'close',
                          icon: <GlobeIcon size={20} />,
                          onAction: () => setVisibility(PlaylistVisibility.PUBLIC)
                        }
                      ]}
                    />
                  </div>
                )}

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="z-5 cursor-pointer hover:text-white text-sm flex items-center gap-2"
                  type="button"
                >
                  {(!isSearch || isExpanded) &&
                    <span className="font-semibold text-nowrap">
                      {orderBy.label}
                    </span>
                  }

                  {layout === PlaylistLayout.LIST && <ListIcon className="w-5 h-5" />}
                  {layout === PlaylistLayout.COMPACT_LIST && <TextAlignJustify className="w-5 h-5" />}
                  {layout === PlaylistLayout.GRID && <LayoutGridIcon className="w-5 h-5" />}
                </button>

                {isOpen &&
                  <CustomMenu
                    order={orderBy}
                    layout={layout}
                    onSort={(value) => onSortBy(library.id, value, orderKind)}
                    onLayout={(value) => onLayoutChange(library.id, value)}
                    onClose={() => setIsOpen(false)}
                  />
                }
              </div>
            </div>
          }
        </header>

        <nav
          style={{
            height: !isDesktop ? `calc(100dvh - 64px - 52px - 62px - ${window.innerWidth >= 520 ? 116 : 156}px)` : ''
          }}
          className={`${isCollapsed ? 'h-[calc(100dvh-64px-88px-100px)]' : isExpanded ? `min-[520px]:h-[calc(100dvh-64px-88px-116px)] h-[calc(100dvh-64px-88px-156px)]` : 'h-[calc(100dvh-64px-88px-116px)]'} overflow-y-auto overflow-x-hidden relative ${!isDesktop ? 'hide-scrollbar' : ''}`}
        >
          {(isExpanded && layout !== PlaylistLayout.GRID) && (
            <ul className={`sm:grid hidden ${grid.sm} ${grid.md} ${grid.lg} gap-3 bg-[#131313] text-[13px] text-[#adaaaa] border-b border-white/10 px-4 sticky top-0 z-10`}>
              <li className="py-2 line-clamp-1 font-semibold">
                Título
              </li>
              <li className="sm:block hidden py-2 line-clamp-1 font-semibold">
                Visibilidad
              </li>
              <li className="md:block hidden py-2 line-clamp-1 font-semibold">
                Canciones
              </li>
              <li
                className="lg:block hidden py-2 line-clamp-1 font-semibold text-nowrap"
                title="Fecha en la que se añadió"
              >
                Fecha en la que se añadió
              </li>
            </ul>
          )}

          <ul className={`${isCollapsed ? 'pl-0 pb-5' : 'pl-2 pb-2'} w-full absolute top-0 left-0 ${(layout === PlaylistLayout.GRID && !isCollapsed) ? 'grid' : ''} ${!isExpanded ? 'grid-cols-2' : 'grid-cols-[repeat(auto-fit,136px)]'} ${(isExpanded && layout !== PlaylistLayout.GRID) ? 'sm:mt-10' : ''}`}>
            {isAdmin && (
              systemPlaylists.map((playlist, i) => (
                <li
                  onClick={() => {
                    setIsExpanded(false);
                    onSizeChange(library.id, isCollapsed, false);
                    navigate(routes.songs);
                  }}
                  className={`${isCollapsed ? 'justify-center' : isExpanded ? `justify-start ${grid.sm} ${grid.md} ${grid.lg} gap-3` : ''} grid p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md`}
                  key={playlist.id}
                >
                  {isCollapsed && (
                    <SmartImage
                      wrapClassName="min-w-12 rounded"
                      iconClassName="text-primary"
                      url={null}
                    />
                  )}


                  {!isCollapsed && (
                    <PlaylistItem
                      isPlaying={isPlaying && queueMeta.playlistId === playlist.id}
                      isHover={hoverIndex !== null && hoverIndex === i}
                      playlist={playlist}
                      isExpanded={isExpanded}
                      queueMeta={queueMeta}
                      layout={layout}
                      user={user!}
                      togglePlay={togglePlay}
                    />
                  )}
                </li>
              )))}

            {playlists.map((playlist, i) => {
              const cover = playlistService.playlistCover(playlist.id, playlist.cover);

              return (
                <li
                  onClick={() => {
                    setIsExpanded(false);
                    onSizeChange(library.id, isCollapsed, false);
                    navigate(`${routes.playlists}/${playlist.id}`);
                  }}
                  className={`${isCollapsed ? 'justify-center' : isExpanded ? `justify-start ${grid.s} ${grid.sm} ${grid.md} ${grid.lg} gap-3` : ''} grid p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md ${layout === PlaylistLayout.COMPACT_LIST ? 'sm:grid-cols-1 grid-cols-[minmax(200px,2fr)_1fr]' : 'grid'}`}
                  onPointerEnter={() => setHoverIndex(i)}
                  onPointerLeave={() => setHoverIndex(null)}
                  key={playlist.id}
                >
                  {isCollapsed && (
                    <div className="min-w-12 w-12 h-12 bg-[#262626] rounded relative overflow-hidden hover:badge:bg-blue-500">
                      <SmartImage url={cover} />

                      {hoverIndex !== null && hoverIndex === i &&
                        <button
                          onClick={() => {
                            if (queueMeta.playlistId === playlist.id) togglePlay();
                          }}
                          className="text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center"
                          type="button"
                        >
                          {(isPlaying && queueMeta.playlistId === playlist.id) ?
                            <PauseIcon
                              className="min-w-5 w-5 h-5"
                              fill="currentColor"
                              stroke="0"
                            /> :
                            <PlayIcon
                              className="min-w-5.5 w-5.5 h-5.5"
                              fill="currentColor"
                              stroke="0"
                            />
                          }
                        </button>
                      }
                    </div>
                  )}

                  {!isCollapsed &&
                    <PlaylistItem
                      isPlaying={isPlaying && queueMeta.playlistId === playlist.id}
                      isHover={hoverIndex !== null && hoverIndex === i}
                      playlist={{ ...playlist, cover }}
                      isExpanded={isExpanded}
                      queueMeta={queueMeta}
                      layout={layout}
                      user={user!}
                      togglePlay={togglePlay}
                    />
                  }
                </li>
              )
            })}

            {playlistMeta.hasNextPage &&
              <li
                className="flex items-center justify-center overflow-hidden py-1"
                ref={loaderRef}
              >
                <Loader
                  className="border-transparent border-t-slate-200"
                  size={20}
                  stroke={2}
                />
              </li>
            }
          </ul>
        </nav>
      </div>
    </aside>
  )
}
