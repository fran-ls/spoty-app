import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, SearchIcon, ListIcon, XIcon, PauseIcon, PlayIcon, PanelTopCloseIcon, PanelTopOpenIcon, LayoutGridIcon, TextAlignJustify, Minimize2Icon, GlobeIcon, LockIcon, GlobeLockIcon } from 'lucide-react';
import type { PlaylistFilters, PlaylistLayout, PlaylistVisibility } from '../../playlist/playlist.types';
import { usePlayer } from '../../../shared/context/PlayerContext';
import { routes } from '../../../shared/utils/routes';
import CustomMenu, { type OrderItem } from './CustomMenu';
import playlistService from '../../playlist/services/playlist.service';
import useAuth from '../../auth/hooks/useAuth';
import usePlaylist from '../../playlist/hooks/usePlaylist';
import SmartImage from '../../../shared/components/SmartImage';
import PlaylistSongItem from './PlaylistSongItem';
import MenuItem from '../../../shared/components/MenuItem';
import PlaylistItem from './PlaylistItem';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';

interface LibraryProps {
  isPage?: boolean;
  isCollapsed?: boolean;
  isExpanded?: boolean;
}

export const Library = (props: LibraryProps) => {
  const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed ?? false);
  const [isExpanded, setIsExpanded] = useState(props.isExpanded ?? false);

  const [isVisibilityMenu, setIsVisibilityMenu] = useState(false);
  const [visibility, setVisibility] = useState<PlaylistVisibility | ''>('');

  const [page, setPage] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<OrderItem>({
    label: 'Recientes',
    value: 'recent'
  });
  const [layout, setLayout] = useState<PlaylistLayout>('list');

  const { isAdmin, user } = useAuth();
  const { playlists, playlistMeta, getUserPlaylists } = usePlaylist();
  const { isPlaying, queueMeta, togglePlay } = usePlayer();

  const filters: PlaylistFilters = {
    page: 0,
    name: query.trim(),
    orderBy: order.value === 'recent' ? 'createdAt' : order.value,
    order: order.value === 'recent' ? 'desc' : 'asc',
    ...(visibility && { isPublic: visibility === 'public' })
  }

  const { loaderRef } = useInfiniteScroll(async () => {
    if (playlistMeta.hasNextPage) {
      await getUserPlaylists(user!.id, { ...filters, page: page + 1 }, { user: false });
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
    setTimeout(() => getUserPlaylists(user!.id, { ...filters, page: 0 }, { user: false }), 300);
    setPage(0);
  }, [query, order, visibility]);

  const grid = {
    sm: 'sm:grid-cols-[minmax(200px,2fr)_100px]',
    md: 'md:grid-cols-[minmax(200px,2fr)_100px_180px]',
    lg: 'lg:grid-cols-[minmax(200px,2fr)_100px_180px_160px]'
  }

  const responsive = {
    headerMin: 'min-[520px]',
    headerMax: 'max-[520px]',
  }

  return (
    <aside
      onClick={() => !query && setIsSearch(false)}
      className={`${isCollapsed ? 'w-18' : isExpanded ? 'w-full' : 'w-72'} ${isExpanded ? 'flex' : 'sm:flex hidden'} rounded-lg h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 transition-all duration-300 ease-in-out relative`}
      id="spotify-sidebar"
    >
      <div className="rounded-lg min-h-[calc(100vh-64px-88px)] max-h-[calc(100vh-64px-88px)]">
        <header className="p-4 text-[#adaaaa] relative">
          <div className={`${isCollapsed ? 'flex-col gap-4' : 'flex-row'} flex items-center justify-between`}>
            {!isExpanded && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
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
                onClick={() => setIsExpanded(true)}
                type="button"
              >
                <h3 className="cursor-pointer text-white font-black text-nowrap">
                  Tu biblioteca
                </h3>
              </button>
            }

            <div className="flex items-center gap-2">
              <button
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
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-full text-[#adaaaa] hover:bg-white/10 hover:text-white cursor-pointer transition-colors duration-100"
                  title="Contraer Tu biblioteca"
                >
                  <Minimize2Icon size={20} />
                </button>
              )}
            </div>
          </div>

          {!isCollapsed &&
            <div className={`${isExpanded ? 'flex-col' : 'flex-row'} ${responsive.headerMin}:flex-row mt-4 text-[#adaaaa] flex items-center justify-between gap-5 relative`}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearch(true);
                }}
                className={`${(isSearch || isExpanded) ? 'w-full bg-[#1f1f1f] rounded' : 'w-8 h-8 rounded-full'} md:max-w-100 z-5 transition-all duration-100 hover:bg-[#1f1f1f] px-2 py-1.5 text-sm cursor-pointer flex items-center`}
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

              <div className={`${isExpanded ? `${responsive.headerMin}:w-fit w-full` : ''} flex items-center justify-between gap-5`}>
                {isExpanded && (
                  <div className={`${responsive.headerMin}:ml-auto relative`}>
                    <button
                      onClick={() => setIsVisibilityMenu(!isVisibilityMenu)}
                      className="z-5 cursor-pointer hover:text-white text-sm flex items-center gap-2"
                      type="button"
                    >
                      {(!isSearch || isExpanded) &&
                        <span className="font-semibold">
                          {visibility === '' && 'Visibilidad'}
                          {visibility === 'public' && 'Pública'}
                          {visibility === 'private' && 'Privada'}
                        </span>
                      }

                      {visibility === 'public' && <GlobeIcon size={18} />}
                      {visibility === 'private' && <LockIcon size={18} />}
                      {visibility === '' && <GlobeLockIcon size={18} />}
                    </button>

                    <MenuItem
                      isBtn={false}
                      open={isVisibilityMenu}
                      onClose={() => setIsVisibilityMenu(false)}
                      styles={{
                        backdrop: 'z-14 bg-transparent',
                        wrap: `${responsive.headerMin}:right-0 ${responsive.headerMax}:left-0 w-32 z-14 absolute top-full mt-3.5 min-w-0`,
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
                          onAction: () => setVisibility('private')
                        },
                        {
                          label: 'Pública',
                          action: 'close',
                          icon: <GlobeIcon size={20} />,
                          onAction: () => setVisibility('public')
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
                      {order.label}
                    </span>
                  }

                  {layout === 'list' && <ListIcon className="w-5 h-5" />}
                  {layout === 'compact-list' && <TextAlignJustify className="w-5 h-5" />}
                  {layout === 'grid' && <LayoutGridIcon className="w-5 h-5" />}
                </button>

                {isOpen &&
                  <CustomMenu
                    order={order}
                    layout={layout}
                    onSort={(value) => setOrder(value)}
                    onLayout={(value) => setLayout(value)}
                    onClose={() => setIsOpen(false)}
                  />
                }
              </div>
            </div>
          }
        </header>

        <nav className={`${isCollapsed ? 'h-[calc(100vh-64px-88px-100px)]' : isExpanded ? `${responsive.headerMin}:h-[calc(100vh-64px-88px-116px)] h-[calc(100vh-64px-88px-156px)]` : 'h-[calc(100vh-64px-88px-116px)]'} overflow-y-auto overflow-x-hidden relative`}>
          {(isExpanded && layout !== 'grid') && (
            <ul className={`sm:grid hidden ${grid.sm} ${grid.md} ${grid.lg} gap-3 bg-[#131313] text-[13px] text-[#adaaaa] border-b border-white/10 px-4 sticky top-0 z-10`}>
              <li className="py-2 line-clamp-1 font-semibold">
                Título
              </li>
              <li className="sm:block hidden py-2 line-clamp-1 font-semibold">
                Visibilidad
              </li>
              <li
                className="md:block hidden py-2 line-clamp-1 font-semibold text-nowrap"
                title="Fecha en la que se añadió"
              >
                Fecha en la que se añadió
              </li>
              <li className="lg:block hidden py-2 line-clamp-1 font-semibold">
                Canciones
              </li>
            </ul>
          )}

          <ul className={`${isCollapsed ? 'pl-0 pb-5' : 'pl-2 pb-2'} w-full absolute top-0 left-0 ${(layout === 'grid' && !isCollapsed) ? 'grid' : ''} ${!isExpanded ? 'grid-cols-2' : 'grid-cols-[repeat(auto-fit,136px)]'} ${(isExpanded && layout !== 'grid') ? 'sm:mt-10' : ''}`}>
            {isAdmin && (
              <li
                onClick={() => {
                  setIsExpanded(false);
                  navigate(routes.songs);
                }}
                className={`${isCollapsed ? 'justify-center' : isExpanded ? `justify-start ${grid.sm} ${grid.md} ${grid.lg} gap-3` : ''} grid p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md`}
              >
                {isCollapsed && (
                  <SmartImage
                    wrapClassName="min-w-12 rounded"
                    iconClassName="text-primary"
                    url={null}
                  />
                )}

                {!isCollapsed && (
                  <PlaylistSongItem
                    isExpanded={isExpanded}
                    isCollapsed={isCollapsed}
                    layout={layout}
                    queueMeta={queueMeta}
                    user={user!}
                  />
                )}
              </li>
            )}

            {playlists.map((playlist, i) => {
              const cover = playlistService.playlistCover(playlist.id, playlist.cover);

              return (
                <li
                  onClick={() => {
                    setIsExpanded(false);
                    navigate(`${routes.playlists}/${playlist.id}`);
                  }}
                  className={`${isCollapsed ? 'justify-center' : isExpanded ? `justify-start ${grid.sm} ${grid.md} ${grid.lg} gap-3` : ''} grid p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md`}
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
