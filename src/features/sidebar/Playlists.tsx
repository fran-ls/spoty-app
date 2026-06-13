import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MusicIcon, PlusIcon, SearchIcon, ListIcon, XIcon, PauseIcon, PlayIcon, PanelTopCloseIcon, PanelTopOpenIcon, ListMusicIcon } from 'lucide-react';
import type { Playlist } from '../playlist/playlist.types';
import { usePlayer } from '../../shared/context/PlayerContext';
import { routes } from '../../shared/utils/routes';
import CustomMenu from './CustomMenu';
import apiService from '../../shared/services/api.service';
import { showMusicIcon } from '../../shared/utils/showMusicIcon';

export const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState('');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { currentView, setView, isPlaying } = usePlayer();
  const navigate = useNavigate();

  const userId = '34ff1011-a38f-4238-b462-02516f959ac9';

  const onSavePlaylist = async () => {
    const { data } = await apiService.newPlaylist({
      name: '',
      description: '',
      cover: '',
      isPublic: false,
      gradientColor: '',
      bgColor: '',
      userId,
      file: null
    }, true);

    if (data?.id) {
      navigate(`${routes.playlists}/${data.id}`);
    }
  }

  useEffect(() => {
    apiService.getUserPlaylists(userId).then(({ data }) => {
      setPlaylists(data || []);
    })
  }, []);

  return (
    <aside
      onClick={() => !query && setIsSearch(false)}
      className={`${isCollapsed ? 'w-18' : 'w-72'} rounded-lg hidden md:flex h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 transition-all duration-300 ease-in-out relative`}
      id="spotify-sidebar"
    >
      <div className="rounded-lg min-h-[calc(100vh-64px-88px)] max-h-[calc(100vh-64px-88px)]">
        <header className="p-4 text-[#adaaaa] relative">
          <div className={`${isCollapsed ? 'flex-col gap-4' : 'flex-row'} flex items-center justify-between`}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#adaaaa] hover:text-white cursor-pointer bg-white/5"
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

            {!isCollapsed &&
              <Link to={routes.library}>
                <h3 className="text-white font-black text-nowrap">
                  Tu biblioteca
                </h3>
              </Link>
            }

            <button
              onClick={onSavePlaylist}
              className={`${isCollapsed ? 'p-2' : 'p-2'} cursor-pointer bg-[#1f1f1f] text-sm font-medium rounded-full gap-2 flex items-center`}
              title="Crea una lista"
              type="button"
            >
              <PlusIcon className="w-5 h-5" />

              {!isCollapsed &&
                <span className="text-white hidden">
                  Lista
                </span>
              }
            </button>
          </div>

          {!isCollapsed &&
            <div className="mt-4 text-[#adaaaa] flex items-center justify-between gap-5 relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearch(true);
                }}
                className={`${isSearch ? 'w-full bg-[#1f1f1f] rounded' : 'w-8 h-8 rounded-full'} z-5 transition-all duration-100 hover:bg-[#1f1f1f] px-2 py-1.5 text-sm cursor-pointer flex items-center`}
              >
                <SearchIcon className="min-w-4 w-4 h-4" />

                {isSearch &&
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full ml-2"
                    placeholder="Buscar"
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
                {!isSearch &&
                  <span className="font-semibold">
                    Recientes
                  </span>
                }
                <ListIcon className="w-5 h-5" />
              </button>

              {isOpen &&
                <CustomMenu onClose={() => setIsOpen(false)} />
              }
            </div>
          }
        </header>

        <nav
          className={`${isCollapsed ? 'h-[calc(100vh-64px-88px-100px)]' : 'h-[calc(100vh-64px-88px-116px)]'} overflow-y-auto overflow-x-hidden relative`}
        >
          <ul className={`${isCollapsed ? 'pl-0 pb-4' : 'pl-2 pb-2'} w-full absolute top-0 left-0`}>
            <li className={`cursor-pointer p-2 text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center`}>
              <button
                onClick={() => {
                  setView('songs');
                  navigate(routes.songs);
                }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
                  } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${currentView === 'songs'
                    ? 'text-white active:scale-95'
                    : 'text-[#adaaaa] hover:text-white active:scale-95'
                  }`}
                title={isCollapsed ? "Canciones" : undefined}
              >
                <ListMusicIcon
                  className={currentView === 'songs' ? 'text-primary' : ''}
                  size={22}
                />
                {!isCollapsed && <span>Canciones</span>}
              </button>
            </li>

            {playlists.map((playlist, i) => (
              <li
                onClick={() => navigate(`${routes.playlists}/${playlist.id}`)}
                className={`${isCollapsed ? 'justify-center' : 'justify-start'} p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center playlist-item`}
                onPointerEnter={() => setHoverIndex(i)}
                onPointerLeave={() => setHoverIndex(null)}
                key={playlist.id}
              >
                <div className="min-w-12 w-12 h-12 bg-[#262626] rounded relative overflow-hidden hover:badge:bg-blue-500">
                  <MusicIcon className={`${!playlist.cover ? '' : 'hidden opacity-0'} absolute top-1/2 left-1/2 -translate-1/2`} />

                  {playlist.cover && (
                    <img
                      onError={(e) => showMusicIcon(e.currentTarget, '.playlist-item')}
                      src={apiService.playlistCover(playlist.id)}
                      className="object-cover w-full h-full"
                      alt=""
                    />
                  )}

                  {hoverIndex !== null && hoverIndex === i &&
                    <div className="text-white badge w-full h-full absolute top-0 left-0 bg-black/50 flex items-center justify-center">
                      {!isPlaying ?
                        <PlayIcon
                          className="min-w-5.5 w-5.5 h-5.5"
                          fill="currentColor"
                          stroke="0"
                        /> :
                        <PauseIcon
                          className="min-w-5 w-5 h-5"
                          fill="currentColor"
                          stroke="0"
                        />
                      }
                    </div>
                  }
                </div>

                {!isCollapsed &&
                  <div>
                    <h4
                      className="line-clamp-1 w-full mt-1 text-white text-[15px] font-semibold"
                      title={playlist.name}
                    >
                      {playlist.name}
                    </h4>
                    <div className="text-[13px] font-semibold flex items-center gap-1">
                      <span>Lista</span>
                      <span>•</span>
                      <span
                        className="line-clamp-1 max-w-full"
                      // title={playlist.name}
                      >
                        Fran Lemus
                      </span>
                    </div>
                  </div>
                }
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
