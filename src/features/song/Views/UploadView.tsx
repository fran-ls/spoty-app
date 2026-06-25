import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircleIcon, XIcon, MusicIcon, FolderHeartIcon, SearchIcon, ChevronLeftIcon } from 'lucide-react';
import type { Artist } from '../../artist/artist.types';
import type { PaginationMeta } from '../../../shared/types/common.types';
import useAuth from '../../auth/hooks/useAuth';
import ArtistForm from '../../artist/components/ArtistForm';
import TrackForm from '../components/TrackForm';
import PlaylistForm from '../../playlist/PlaylistForm';
import AlbumForm from '../../artist/components/AlbumForm';
import ArtistProfile from '../../artist/components/ArtistProfile';
import AlbumDetail from '../../artist/components/AlbumDetail';
import artistService from '../../artist/services/artist.service';
import SearchPanel from '../components/SearchPanel';

export const UploadView: React.FC = () => {
  const { dispatch } = useAuth();

  const [page, setPage] = useState(0);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistMeta, setArtistMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const isLoadMoreArtist = page < artistMeta.totalPages;

  const [activeFormTab, setActiveFormTab] = useState<'track' | 'playlist' | 'search'>('track');

  // Panel 2 control states
  const [isPanel2Open, setIsPanel2Open] = useState(false);
  const [panel2Mode, setPanel2Mode] = useState<'create-artist' | 'create-album' | 'view-artist' | 'view-album'>('create-artist');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const triggerCreateArtist = () => {
    setPanel2Mode('create-artist');
    setIsPanel2Open(true);
  }

  const triggerCreateAlbum = () => {
    setPanel2Mode('create-album');
    setIsPanel2Open(true);
  }

  const triggerViewAlbum = (id: string) => {
    setSelectedAlbumId(id);
    setPanel2Mode('view-album');
    setIsPanel2Open(true);
  }

  const triggerViewArtist = () => {
    setPanel2Mode('view-artist');
    setIsPanel2Open(true);
  }

  const getArtists = async (page = 1) => {
    const { data } = await artistService.getArtists({ page, limit: 5 });
    if (!data) return;

    setArtistMeta(data.meta);

    if (page > 1) {
      setArtists((prev) => [...prev, ...data.items]);
    }
    else {
      setArtists(data.items);
    }

    if (page < artistMeta.totalPages) {
      getArtists(page + 1);
      setPage(page + 1);
    }
  }

  useEffect(() => { getArtists() }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden" id="upload-panel-root">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => dispatch({
          type: 'upload',
          payload: { isActive: false }
        })}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        id="upload-backdrop"
      />

      {/* Side-by-side Dual Panel Wrapper */}
      <div className="relative h-full flex items-stretch pointer-events-none z-10 max-w-full">
        {/* PANEL 1: MAIN CREATOR DASHBOARD */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="w-screen sm:w-115 h-full bg-[#121212] border-l border-white/5 flex flex-col shadow-2xl pointer-events-auto relative z-10"
          id="creator-panel-1"
        >
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#151515]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-primary">
                <PlusCircleIcon size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white tracking-tight">
                  Creador de Contenido
                </h2>
                <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                  Sube tus canciones y edita biblioteca
                </p>
              </div>
            </div>

            <button
              onClick={() => dispatch({
                type: 'upload',
                payload: { isActive: false }
              })}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Cerrar creador"
            >
              <XIcon size={16} />
            </button>
          </div>

          {/* Panel Selector (Tabs) */}
          <div className="px-4 py-3 bg-[#161616] border-b border-white/5 flex gap-1 shrink-0">
            <button
              onClick={() => {
                setActiveFormTab('track');
                setIsPanel2Open(false);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${activeFormTab === 'track'
                ? 'bg-primary text-black font-black shadow-md shadow-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <MusicIcon size={12} />
              <span>Tema</span>
            </button>
            <button
              onClick={() => {
                setActiveFormTab('playlist');
                setIsPanel2Open(false);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${activeFormTab === 'playlist'
                ? 'bg-primary text-black font-black shadow-md shadow-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <FolderHeartIcon size={12} />
              <span>Playlist</span>
            </button>
            <button
              onClick={() => {
                setActiveFormTab('search');
                setIsPanel2Open(false);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${activeFormTab === 'search'
                ? 'bg-primary text-black font-black shadow-md shadow-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <SearchIcon size={12} />
              <span>Buscar</span>
            </button>
          </div>

          {/* Panel Form / Scroll Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 primary-panel-content">
            {activeFormTab === 'track' && (
              <TrackForm
                artists={artists}
                isLoadMore={isLoadMoreArtist}
                setArtists={setArtists}
                loadMoreArtist={getArtists}
                triggerCreateArtist={triggerCreateArtist}
                triggerCreateAlbum={triggerCreateAlbum}
              />
            )}

            {activeFormTab === 'playlist' && (
              <PlaylistForm />
            )}

            {activeFormTab === 'search' && (
              <SearchPanel
                setArtist={setArtist}
                triggerViewArtist={triggerViewArtist}
                triggerViewAlbum={triggerViewAlbum}
              />
            )}

          </div>
        </motion.div>

        {/* PANEL 2: AUXILIARY FORM & DETAIL PANELS (SLIDES IN TO THE RIGHT OF PANEL 1) */}
        <AnimatePresence>
          {isPanel2Open && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-screen sm:w-115 h-full bg-[#181818] border-l border-white/10 flex flex-col shadow-2xl pointer-events-auto relative z-20"
              id="creator-panel-2"
            >
              <div className="relative p-5 border-b border-white/5 flex items-center justify-between bg-[#1b1b1b]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPanel2Open(false)}
                    className="text-gray-400 hover:text-white hover:bg-white/5 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer"
                    title="Volver"
                  >
                    <ChevronLeftIcon size={20} />
                  </button>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs uppercase font-mono font-bold text-gray-400">
                    {panel2Mode === 'create-artist' && 'Nuevo Artista'}
                    {panel2Mode === 'create-album' && 'Nuevo Álbum'}
                    {panel2Mode === 'view-artist' && 'Detalles Artista'}
                    {panel2Mode === 'view-album' && 'Detalles Álbum'}
                  </span>
                </div>
                <button
                  onClick={() => setIsPanel2Open(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <XIcon size={16} />
                </button>
              </div>

              {/* PANEL 2 CONTENT BODY */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 secondary-panel-content">
                {panel2Mode === 'create-artist' && (
                  <ArtistForm
                    setArtists={setArtists}
                    setIsPanel2Open={setIsPanel2Open}
                  />
                )}

                {panel2Mode === 'create-album' && (
                  <AlbumForm
                    artists={artists}
                    isLoadMore={isLoadMoreArtist}
                    loadMoreArtist={getArtists}
                    setArtists={setArtists}
                    setIsPanel2Open={setIsPanel2Open}
                  />
                )}

                {panel2Mode === 'view-artist' && (
                  <ArtistProfile
                    artist={artist}
                    triggerViewAlbum={triggerViewAlbum}
                    onRemove={async () => {
                      if (!artist?.id) return;
                      const { data } = await artistService.deleteArtist(artist.id);
                      if (data && data.id) setArtists((prev) => prev.filter((a) => a.id !== artist.id));
                    }}
                  />
                )}

                {panel2Mode === 'view-album' &&
                  <AlbumDetail selectedAlbumId={selectedAlbumId || ''} />
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}