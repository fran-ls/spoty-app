import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, SearchIcon, ListIcon, XIcon, PauseIcon, PlayIcon, PanelTopCloseIcon, PanelTopOpenIcon, LayoutGridIcon, TextAlignJustify, Minimize2Icon } from 'lucide-react';
import type { PlaylistLayout } from '../playlist/playlist.types';
import { usePlayer } from '../../shared/context/PlayerContext';
import { routes } from '../../shared/utils/routes';
import CustomMenu, { type OrderItem } from './CustomMenu';
import playlistService from '../playlist/services/playlist.service';
import useAuth from '../auth/hooks/useAuth';
import usePlaylist from '../playlist/hooks/usePlaylist';
import SmartImage from '../../shared/components/SmartImage';
import PlaylistItem from '../playlist/components/PlaylistItem';
import PlaylistSongItem from '../playlist/components/PlaylistSongItem';

export const Library: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<OrderItem>({
    label: 'Recientes',
    value: 'recent'
  });
  const [layout, setLayout] = useState<PlaylistLayout>('list');

  const { isAdmin, user } = useAuth();
  const { playlists, getUserPlaylists } = usePlaylist();
  const { isPlaying, queueMeta, togglePlay } = usePlayer();

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
    setTimeout(() => getUserPlaylists(user!.id, {
      name: query.trim(),
      orderBy: order.value === 'recent' ? 'createdAt' : order,
      order: order.value === 'recent' ? 'desc' : 'asc',
    }), 300);
  }, [query, order]);

  return (
    <aside
      onClick={() => !query && setIsSearch(false)}
      className={`${isCollapsed ? 'w-18' : isExpanded ? 'w-full' : 'w-72'} rounded-lg hidden md:flex h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 transition-all duration-300 ease-in-out relative`}
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
                    Crear
                  </span>
                }
              </button>

              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-full text-[#adaaaa] hover:bg-white/10 hover:text-white cursor-pointer transition-colors duration-100"
                  title="Contraer Tu biblioteca"
                >
                  <Minimize2Icon
                    className=""
                    size={20}
                  />
                </button>
              )}
            </div>
          </div>

          {!isCollapsed &&
            <div className="mt-4 text-[#adaaaa] flex items-center justify-between gap-5 relative">
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

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="z-5 cursor-pointer hover:text-white text-sm flex items-center gap-2"
                type="button"
              >
                {(!isSearch || isExpanded) &&
                  <span className="font-semibold">
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
          }
        </header>


        <nav className={`${isCollapsed ? 'h-[calc(100vh-64px-88px-100px)]' : 'h-[calc(100vh-64px-88px-116px)]'} overflow-y-auto overflow-x-hidden relative`}>
          {(isExpanded && layout !== 'grid') && (
            <ul className={`bg-[#131313] text-sm text-[#adaaaa] border-b border-[#1f1f1f] px-4 flex sticky top-0 z-10`}>
              <li className="p-2 line-clamp-1 w-full font-semibold max-w-lg">
                Título
              </li>
              <li className="p-2 line-clamp-1 font-semibold">
                Fecha en que se añadió
              </li>
            </ul>
          )}

          <ul className={`${isCollapsed ? 'pl-0 pb-5' : 'pl-2 pb-2'} w-full absolute top-0 left-0 ${(layout === 'grid' && !isCollapsed) ? 'grid' : ''} ${!isExpanded ? 'grid-cols-2' : 'grid-cols-[repeat(auto-fit,136px)]'} ${(isExpanded && layout !== 'grid') ? 'mt-10' : ''}`}>
            {isAdmin && (
              <li
                onClick={() => {
                  setIsExpanded(false);
                  navigate(routes.songs);
                }}
                className={`${isCollapsed ? 'justify-center' : 'justify-start'} ${layout === 'grid' ? 'max-w-34' : ''} p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center playlist-item`}
              >
                {(layout === 'list' || isCollapsed) && (
                  <SmartImage
                    wrapClassName="rounded"
                    iconClassName="text-primary"
                    url={null}
                  />
                )}

                {!isCollapsed && (
                  <PlaylistSongItem
                    isExpanded={isExpanded}
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
                  className={`${isCollapsed ? 'justify-center' : 'justify-start'} ${layout === 'grid' ? 'max-w-34' : ''} p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center playlist-item`}
                  onPointerEnter={() => setHoverIndex(i)}
                  onPointerLeave={() => setHoverIndex(null)}
                  key={playlist.id}
                >
                  {(layout === 'list' || isCollapsed) && (
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
                      isExpanded={isExpanded}
                      layout={layout}
                      playlist={{ ...playlist, cover }}
                      queueMeta={queueMeta}
                      user={user!}
                    />
                  }
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
