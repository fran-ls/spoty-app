import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../shared/context/PlayerContext';
import { Home, Search, Library, Plus, Heart, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import type { NavItemProps } from './NavItem';
import NavItem from './NavItem';
import { routes } from '../../shared/utils/routes';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const { currentView, setView, openPlaylist, allPlaylists } = usePlayer();
  const navigate = useNavigate();

  const navItems: NavItemProps[] = [
    {
      isCollapsed,
      redirectTo: () => navigate(routes.playlists),
      icon: <Music size={14} className="text-[#adaaaa]/80" />,
      content: (
        <>
          <Music size={13} className="text-[#adaaaa]/50 group-hover:text-primary transition-colors shrink-0" />
          <span className="truncate">Post-Rock Essentials</span>
        </>
      ),
    },
    {
      isCollapsed,
      redirectTo: () => navigate(routes.playlists),
      icon: <Music size={14} className="text-[#adaaaa]/80" />,
      content: (
        <>
          <Music size={13} className="text-[#adaaaa]/50 group-hover:text-primary transition-colors shrink-0" />
          <span className="truncate">Study Beats 2024</span>
        </>
      ),
    },
  ];

  return (
    <aside
      className={`hidden md:flex h-full max-h-[calc(100vh-64px-88px)] overflow-y-auto overflow-x-hidden flex-col bg-[#131313] border-none pt-6 select-none shrink-0 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-19' : 'w-72'
        }`}
      id="spotify-sidebar"
    >
      {/* Brand Logo & Expand/Collapse Toggle Button */}
      <div
        className={`flex items-center justify-between mb-6 px-4 transition-all duration-300 ${isCollapsed ? 'flex-col gap-4' : 'flex-row'
          }`}
      >
        {!isCollapsed ? (
          <div
            className="text-white text-2xl font-black font-headline tracking-tighter cursor-pointer hover:opacity-95"
            onClick={() => {
              setView('home');
              navigate(routes.home);
            }}
          >
            Songfy
          </div>
        ) : (
          <div
            className="text-primary text-base font-black font-headline select-none w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer border border-primary/20 hover:bg-white/10"
            onClick={() => {
              setView('home');
              navigate(routes.home);
            }}
            title="S"
          >
            S
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-[#adaaaa] hover:text-white transition-all cursor-pointer bg-white/5"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Main Navigation links matches context navigation */}
      <nav className="flex flex-col gap-1 px-2">
        <button
          onClick={() => {
            setView('home');
            navigate(routes.home);
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
            } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${currentView === 'home'
              ? 'text-white bg-white/5 active:scale-95'
              : 'text-[#adaaaa] hover:text-white hover:bg-white/5 active:scale-95'
            }`}
          title={isCollapsed ? "Home" : undefined}
        >
          <Home size={22} className={currentView === 'home' ? 'text-primary' : ''} />
          {!isCollapsed && <span>Home</span>}
        </button>

        <button
          onClick={() => {
            setView('search');
            navigate(routes.search);
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
            } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${currentView === 'search'
              ? 'text-white bg-white/5 active:scale-95'
              : 'text-[#adaaaa] hover:text-white hover:bg-white/5 active:scale-95'
            }`}
          title={isCollapsed ? "Search" : undefined}
        >
          <Search size={22} className={currentView === 'search' ? 'text-primary' : ''} />
          {!isCollapsed && <span>Search</span>}
        </button>

        <button
          onClick={() => {
            setView('library');
            navigate(routes.library);
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
            } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${currentView === 'library'
              ? 'text-white bg-white/5 active:scale-95'
              : 'text-[#adaaaa] hover:text-white hover:bg-white/5 active:scale-95'
            }`}
          title={isCollapsed ? "Your Library" : undefined}
        >
          <Library size={22} className={currentView === 'library' ? 'text-primary' : ''} />
          {!isCollapsed && <span>Your Library</span>}
        </button>
        <button
          onClick={() => {
            setView('songs');
            navigate(routes.songs);
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
            } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${currentView === 'songs'
              ? 'text-white bg-white/5 active:scale-95'
              : 'text-[#adaaaa] hover:text-white hover:bg-white/5 active:scale-95'
            }`}
          title={isCollapsed ? "Canciones" : undefined}
        >
          <Library size={22} className={currentView === 'songs' ? 'text-primary' : ''} />
          {!isCollapsed && <span>Canciones</span>}
        </button>
      </nav>

      {/* Helper Actions Section */}
      <div className="mt-6 flex flex-col gap-1 px-2 border-t border-white/5 pt-6">
        <button
          onClick={() => {
            setView('create-playlist');
            navigate(routes.newPlaylist);
          }}
          className={`w-full text-[#adaaaa] hover:text-white flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
            } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-300 active:scale-95`}
          title={isCollapsed ? "Create Playlist" : undefined}
        >
          <div className="bg-[#adaaaa]/25 hover:bg-[#adaaaa]/30 text-white p-1 rounded-sm flex items-center justify-center shrink-0">
            <Plus size={16} />
          </div>
          {!isCollapsed && <span>Create Playlist</span>}
        </button>

        <button
          onClick={() => {
            setView('library');
            navigate(routes.library);
          }}
          className={`w-full text-[#adaaaa] hover:text-white flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
            } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-300 active:scale-95`}
          title={isCollapsed ? "Liked Songs" : undefined}
        >
          <div className="bg-linear-to-br from-indigo-700 to-blue-300 p-1 rounded-sm flex items-center justify-center shrink-0">
            <Heart size={16} fill="white" className="text-white" />
          </div>
          {!isCollapsed && <span>Liked Songs</span>}
        </button>
      </div>

      {/* Custom Sidebar Section: Recent Playlists */}
      <div className="mt-6 px-4 border-t border-white/5 pt-6 flex-1 select-none">
        {!isCollapsed && (
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#adaaaa] font-bold mb-4 px-2">
            Your Playlists
          </p>
        )}
        <ul className={`flex flex-col ${isCollapsed ? 'items-center gap-4' : 'gap-3 px-2'} font-medium text-sm text-[#adaaaa]`}>
          {allPlaylists.map(playlist => (
            <li
              key={playlist.id}
              onClick={() => {
                setView('playlist');
                openPlaylist(playlist.id);
                navigate(routes.playlists);
              }}
              className="hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-2 group truncate w-full"
              title={isCollapsed ? playlist.name : undefined}
            >
              {isCollapsed ? (
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 overflow-hidden border border-transparent group-hover:border-primary/40 transition-all shadow-md">
                  {playlist.coverUrl ? (
                    <img src={playlist.coverUrl} className="w-full h-full object-cover" alt={playlist.name} referrerPolicy="no-referrer" />
                  ) : (
                    <Music size={14} className="text-primary" />
                  )}
                </div>
              ) : (
                <>
                  <Music size={13} className="text-[#adaaaa]/50 group-hover:text-primary transition-colors shrink-0" />
                  <span className="truncate">{playlist.name}</span>
                </>
              )}
            </li>
          ))}

          {
            navItems.map((item, i) => (<NavItem {...item} key={`idx-${i + 1}`} />))
          }
        </ul>
      </div>

      {/* Cookies footer */}
      {!isCollapsed && (
        <div className="mt-auto p-6 text-[11px] text-[#adaaaa]/50 hover:text-[#adaaaa] font-semibold transition-all cursor-default select-none whitespace-nowrap">
          Cookies • Privacy • Terms
        </div>
      )}
    </aside>
  )
}
