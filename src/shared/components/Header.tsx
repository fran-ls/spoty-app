import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, Users, User, Search, Sparkles, XIcon, GlobeIcon, CircleUserRoundIcon, SettingsIcon, LaptopMinimalIcon, LogOutIcon, UploadIcon, MusicIcon, DownloadIcon, LibraryIcon } from 'lucide-react';
import useAuth from '../../features/auth/hooks/useAuth';
import { routes } from '../utils/routes';

interface HeaderProps {
  onExplorePremiumClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExplorePremiumClick }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const { user, isAdmin, dispatch, showProfile, logout } = useAuth();
  const navigate = useNavigate();

  const onCloseDropdown = () => {
    setShowUserDropdown(false);
    setIsActive(false);
  }

  return (
    <header
      className="flex justify-between items-center px-4 py-2 w-full h-16 bg-black transition-all duration-300"
      id="spotify-header"
    >
      <div className="flex items-center gap-4 max-w-140 md:w-[60%] w-[80%]">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(routes.home)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-[#adaaaa] hover:text-white hover:bg-black/60 transition-all cursor-pointer"
            title="Inicio"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="sm:flex hidden w-8 h-8 items-center justify-center rounded-full bg-black/40 text-[#adaaaa] opacity-50 cursor-not-allowed"
            disabled
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="relative group sm:ml-4 animate-fade-in w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#adaaaa] group-focus-within:text-white">
            <Search size={18} />
          </div>

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#262626] border-none rounded-full py-3 pl-12 pr-22 w-full text-sm font-medium focus:ring-2 focus:ring-white/20 text-white placeholder:text-[#adaaaa] transition-all outline-none"
            placeholder="¿Qué quieres escuchar?"
            type="text"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="cursor-pointer absolute right-14 top-1/2 -translate-y-1/2 text-[10px] text-[#adaaaa] hover:text-white rounded"
            >
              <XIcon />
            </button>
          )}

          <div className="w-px h-6 rounded-[1px] bg-[#adaaaa] absolute right-12 top-1/2 -translate-y-1/2" />

          <button
            onClick={() => navigate(routes.search)}
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#adaaaa] hover:text-white rounded"
          >
            <GlobeIcon size={22} />
          </button>
        </div>
      </div>

      {/* RIGHT: User Actions & CTA */}
      <div className="flex items-center gap-6 font-headline font-semibold">
        <button
          onClick={onExplorePremiumClick}
          className="bg-white text-black font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all hidden items-center gap-1.5 shadow-md cursor-pointer select-none"
        >
          <Sparkles size={14} className="text-[#1cb853]" />
          Explore Premium
        </button>

        <div className="flex items-center gap-3">
          <button className="hidden text-[#adaaaa] hover:text-white hover:bg-[#262626] rounded-full p-2 transition-all cursor-pointer">
            <Bell size={20} />
          </button>
          <button className="hidden text-[#adaaaa] hover:text-white hover:bg-[#262626] rounded-full p-2 transition-all cursor-pointer">
            <Users size={20} />
          </button>

          <div className="relative select-none">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="text-[#adaaaa] hover:text-white hover:bg-[#181717] rounded-full p-1.5 transition-all flex items-center justify-center cursor-pointer border border-[#adaaaa]/10 bg-black/20"
            >
              <User size={20} className="text-white" />
            </button>

            {showUserDropdown && (
              <>
                <div
                  className="z-50 min-h-screen min-w-full top-0 left-0 fixed inset-0"
                  onClick={onCloseDropdown}
                />

                <div className="z-50 absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-[#282828] border border-[#3e3e3e] py-1 text-sm text-on-surface-variant font-medium animate-scale-up">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3e3e3e] text-xs text-[#adaaaa]">
                    <div className="w-7 h-7 min-w-7 bg-primary rounded-full relative">
                      <span className="text-black font-semibold absolute top-1/2 left-1/2 -translate-1/2 block">
                        {user?.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-white text-[13px]">
                        {user?.username}
                      </span>
                      <span className="text-xs text-[#bababa] block truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showProfile();
                      onCloseDropdown();
                    }}
                    className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <CircleUserRoundIcon size={20} />
                    <span>Perfil</span>
                  </button>
                  <Link
                    to={routes.library}
                    onClick={onCloseDropdown}
                    className="md:hidden flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <LibraryIcon size={20} />
                    <span>Tu biblioteca</span>
                  </Link>
                  <button
                    onClick={onCloseDropdown}
                    className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <SettingsIcon size={20} />
                    <span>Configuración</span>
                  </button>

                  <div className="border-t border-[#3e3e3e]" />

                  <button
                    onClick={logout}
                    className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <LogOutIcon size={20} />
                    <span>Cerrar sesión</span>
                  </button>

                  {isAdmin && (
                    <>
                      <div className="border-t border-[#3e3e3e]" />

                      <Link
                        onClick={onCloseDropdown}
                        to={routes.songs}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <MusicIcon size={20} />
                        <span>Canciones</span>
                      </Link>

                      <button
                        onClick={() => {
                          dispatch({
                            type: 'upload',
                            payload: { isActive: true }
                          });
                          onCloseDropdown();
                        }}
                        className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <UploadIcon size={20} />
                        <span>Subir</span>
                      </button>

                      <Link
                        to={routes.YTDrop.download}
                        onClick={() => {
                          onCloseDropdown();
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <DownloadIcon size={20} />
                        <span>Descargar</span>
                      </Link>
                    </>
                  )}

                  <div className="relative hidden border-t border-[#3e3e3e]">
                    <button
                      onClick={() => setIsActive(!isActive)}
                      onMouseEnter={() => setIsActive(true)}
                      className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                      type="button"
                    >
                      <span>Más</span>
                      <ChevronRight size={20} />
                    </button>

                    {isActive && (
                      <div
                        onMouseLeave={() => setIsActive(false)}
                        className="bg-[#282828] border border-[#3e3e3e] absolute top-0 right-full w-full p-1 rounded-md"
                      >
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => {
                                dispatch({
                                  type: 'upload',
                                  payload: { isActive: true }
                                });
                                onCloseDropdown();
                              }}
                              className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <UploadIcon size={20} />
                              <span>Subir</span>
                            </button>

                            <Link
                              to={routes.YTDrop.download}
                              onClick={() => {
                                onCloseDropdown();
                              }}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <DownloadIcon size={20} />
                              <span>Descargar</span>
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => {
                            onCloseDropdown();
                            alert('Spotify Clone Web Player - Created in React + TS');
                          }}
                          className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-[#adaaaa] hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <LaptopMinimalIcon size={20} />
                          <span>Sobre el sistema</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
