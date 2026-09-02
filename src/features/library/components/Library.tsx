import { useEffect, useRef, useState } from 'react';
import { PlusIcon, SearchIcon, ListIcon, XIcon, PanelTopCloseIcon, PanelTopOpenIcon, LayoutGridIcon, TextAlignJustify, Minimize2Icon, GlobeIcon, LockIcon, GlobeLockIcon } from 'lucide-react';
import type { PlaylistFilters } from '../../playlist/playlist.types';
import { PlaylistLayout, PlaylistOrderBy, PlaylistVisibility, type LayoutKind } from '../library.types';
import CustomMenu from './CustomMenu';
import useAuth from '../../auth/hooks/useAuth';
import MenuItem from '../../../shared/components/MenuItem';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import { getDeviceType } from '../../../shared/utils/getDeviceType';
import { STYLES } from '../../../shared/utils/styles';
import useLibrary from '../hooks/useLibrary';
import Playlists from './Playlists';
import { hasScroll } from '../../../shared/utils/scroll';
import { OrderKind } from '../../../shared/types/common.types';

export type Grid = {
  li: {
    s: string;
    sm: string;
    md: string;
    lg: string;
  };
  ul: {
    s: string;
    md: string;
    lg: string;
    '2xl': string;
  };
}

interface LibraryProps {
  isPage?: boolean;
  isCollapsed?: boolean;
  isExpanded?: boolean;
}

export const Library = (props: LibraryProps) => {
  const { user } = useAuth();
  const {
    library, layout, orderBy, libraryStatus, playlists, playlistMeta, isLoading,
    playlistVerticalScroll, playlistScrollTop, newPlaylist, onLayoutChange, onSortBy, onSizeChange,
    setLibraryStatus, getPlaylists, getLibrary, setPlaylistVerticalScroll, setPlaylistScrollTop
  } = useLibrary();

  const { collapsed: isCollapsed, expanded: isExpanded } = libraryStatus;

  const [isVisibilityMenu, setIsVisibilityMenu] = useState(false);
  const [visibility, setVisibility] = useState<PlaylistVisibility | ''>('');

  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverId, setHoverId] = useState('');

  const ulRef = useRef<HTMLUListElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const [gridImgSize, setGridImgSize] = useState(0);

  const orderKind = orderBy.value === PlaylistOrderBy.RECENT ? OrderKind.DESC : OrderKind.ASC;

  const filters: PlaylistFilters = {
    page: 0,
    name: query.trim(),
    orderBy: orderBy.k,
    order: orderKind,
    ...(visibility && {
      isPublic: visibility === PlaylistVisibility.PUBLIC
    })
  }

  const { loaderRef } = useInfiniteScroll(async () => {
    if (playlistMeta.hasNextPage) {
      await getPlaylists({
        ...filters,
        page: page + 1
      },
        undefined
      );
      setPage(page + 1);
    }
  });

  const layoutKind: LayoutKind = {
    list: layout === PlaylistLayout.LIST,
    grid: layout === PlaylistLayout.GRID,
    compactList: layout === PlaylistLayout.COMPACT_LIST
  }

  const device = getDeviceType();
  const isDesktop = device === 'desktop';

  function getGridImgSize(isFirstLoad = false) {
    const ul = ulRef.current;
    if (!ul) return;

    const screenWidth = window.innerWidth - 8 - (8 * 2);
    const wrapWidth = isFirstLoad ? screenWidth : ul.offsetWidth - 8;
    const initGridWidth = window.innerWidth >= 1024 ? 160 : 136;
    const cols = Math.floor(wrapWidth / initGridWidth);
    const gridWidth = wrapWidth / cols;
    const size = gridWidth - 12 * 2;
    setGridImgSize(size);
  }

  useEffect(() => {
    if (user && user.id) {
      getLibrary(user.id).then((lib) => {
        (!props.isPage && lib) && setLibraryStatus({
          collapsed: lib.isCollapsed,
          expanded: lib.isExpanded
        });
      });
    }
    if (props.isPage) setLibraryStatus({
      collapsed: false,
      expanded: props.isExpanded ?? true
    });
  }, [user]);

  useEffect(() => {
    setPage(0);

    setTimeout(() => getPlaylists(
      { ...filters, page: 0 },
      undefined
    ), 300);
  }, [query, orderBy, visibility]);

  useEffect(() => {
    const handleResize = () => getGridImgSize();

    if (layout === PlaylistLayout.GRID && libraryStatus.expanded) {
      getGridImgSize(true);
      window.addEventListener('resize', handleResize);
    }
    else {
      window.removeEventListener('resize', handleResize);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [layout, libraryStatus]);

  useEffect(() => {
    if (navRef.current) {
      const verticalScroll = hasScroll(navRef.current).vertical;
      setPlaylistVerticalScroll(verticalScroll);
    }
  }, [playlists]);

  const grid: Grid = {
    li: {
      s: 'min-[420px]:grid-cols-[minmax(200px,2fr)_70px]',
      sm: 'sm:grid-cols-[minmax(200px,2fr)_70px]',
      md: 'md:grid-cols-[minmax(200px,2fr)_1fr_1fr]',
      lg: 'lg:grid-cols-[minmax(200px,2fr)_1fr_1fr_minmax(180px,1fr)]',
    },
    ul: {
      s: 'grid-cols-[repeat(auto-fill,minmax(136px,1fr))]',
      md: 'md:grid-cols-[repeat(auto-fill,minmax(136px,1fr))]',
      lg: 'lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]',
      '2xl': '2xl:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]'
    }
  }

  return (
    <aside
      onClick={() => !query && setIsSearch(false)}
      className={`${isCollapsed ? 'w-18' : isExpanded ? 'w-full' : 'w-72'} ${props.isPage ? 'flex' : 'md:flex hidden'} rounded-lg h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 transition-all duration-300 ease-in-out relative`}
      id="spotify-sidebar"
    >
      <div className={`rounded-lg ${STYLES.minHeightMain} ${STYLES.maxHeightMain}`}>
        <header
          style={{
            ...((!isExpanded && playlistScrollTop) && {
              boxShadow: '0 6px 10px #0009'
            })
          }}
          className="p-4 text-[#adaaaa] relative transition-shadow duration-75"
        >
          <div className={`${isCollapsed ? 'flex-col gap-4' : 'flex-row'} flex items-center justify-between`}>
            {!isExpanded && (
              <button
                onClick={() => onSizeChange(library.id, {
                  collapsed: !isCollapsed,
                  expanded: false
                })}
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
                onClick={() => onSizeChange(library.id, {
                  collapsed: false,
                  expanded: true
                })}
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
                onClick={newPlaylist}
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
                  onClick={() => onSizeChange(library.id, { expanded: false })}
                  className="p-2 rounded-full text-[#adaaaa] hover:bg-white/10 hover:text-white cursor-pointer transition-colors duration-100"
                  title="Contraer Tu biblioteca"
                >
                  <Minimize2Icon size={20} />
                </button>
              )}
            </div>
          </div>

          {!isCollapsed &&
            <div className="min-[520px]:flex-row flex-col mt-4 text-[#adaaaa] flex items-center justify-between gap-5 relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearch(true);
                }}
                className={`${(isSearch || isExpanded) ? 'w-full bg-[#2a2a2a] rounded' : 'w-8 h-8 rounded-full cursor-pointer'} h-8 min-[520px]:max-w-48 z-5 hover:bg-[#2a2a2a] transition-all duration-100 px-2 py-1.5 text-sm flex items-center`}
              >
                <SearchIcon className="min-w-4 w-4 h-4" />

                {(isSearch || isExpanded) &&
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="placeholder-[#adaaaa] text-white text-[13px] w-full ml-2"
                    placeholder="Buscar en Tu biblioteca"
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

                  {layoutKind.list && <ListIcon className="w-5 h-5" />}
                  {layoutKind.compactList && <TextAlignJustify className="w-5 h-5" />}
                  {layoutKind.grid && <LayoutGridIcon className="w-5 h-5" />}
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
          onScroll={(e) => setPlaylistScrollTop(e.currentTarget.scrollTop)}
          ref={navRef}
        >
          {(isExpanded && !layoutKind.grid) && (
            <ul className={`sm:grid hidden ${grid.li.s} ${grid.li.sm} ${grid.li.md} ${grid.li.lg} gap-3 bg-[#131313] text-[13px] text-[#adaaaa] border-b border-white/10 px-4 sticky top-0 z-10`}>
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

          <ul
            style={{
              ...((!playlistVerticalScroll && !isCollapsed) && {
                paddingRight: '8px'
              })
            }}
            className={`${isCollapsed ? 'pl-0 pb-5' : 'pl-2 pb-2'} w-full absolute top-0 left-0 ${(layoutKind.grid && !isCollapsed) ? 'grid' : ''} ${!isExpanded ? 'grid-cols-2' : `${grid.ul.s} ${grid.ul.md} ${grid.ul.lg} ${grid.ul['2xl']}`} ${(isExpanded && !layoutKind.grid) ? 'sm:mt-10' : ''}`}
            ref={ulRef}
          >
            {/* {isAdmin && (
              <Playlists
                grid={grid}
                layoutKind={layoutKind}
                gridImgSize={gridImgSize}
                playlists={systemPlaylists}
                hoverId={hoverId}
                setHoverId={setHoverId}
              />
            )} */}

            <Playlists
              grid={grid}
              layoutKind={layoutKind}
              gridImgSize={gridImgSize}
              playlists={playlists}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />

            {(!isLoading && playlistMeta.hasNextPage) && (
              <li className="flex items-center justify-center overflow-hidden py-1">
                <div
                  className="flex-1 flex items-center justify-center"
                  ref={loaderRef}
                >
                  <Loader
                    className="border-transparent border-t-slate-200"
                    size={20}
                    stroke={2}
                  />
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
