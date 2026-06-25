import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Disc, PlusCircleIcon, Search, ChevronRight,
  XIcon, MusicIcon, FolderHeartIcon, SearchIcon,
  ChevronLeftIcon,
} from 'lucide-react';
import type { Artist, ArtistDTO } from '../../artist/artist.types';
import type { PlaylistDTO } from '../../playlist/playlist.types';
import type { PaginationMeta } from '../../../shared/types/common.types';
import useAuth from '../../auth/hooks/useAuth';
import ArtistForm from '../../artist/components/ArtistForm';
import TrackForm from '../components/TrackForm';
import PlaylistForm from '../../playlist/PlaylistForm';
import AlbumForm from '../../artist/components/AlbumForm';
import ArtistProfile from '../../artist/components/ArtistProfile';
import AlbumDetail from '../../artist/components/AlbumDetail';
import artistService from '../../artist/services/artist.service';
import { mockAlbums, mockArtists } from '../../home/data/music.data';

export const UploadView: React.FC = () => {
  const { dispatch } = useAuth();

  const [artistForm, setArtistForm] = useState<ArtistDTO>({ name: '' });
  const [albumForm, setAlbumForm] = useState<any>({});
  const [playlistForm, setPlaylistForm] = useState<PlaylistDTO>({
    name: '',
    description: '',
    cover: '',
    isPublic: false,
    gradientColor: '',
    bgColor: '',
    userId: '',
    file: null
  });

  const [page, setPage] = useState(0);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistMeta, setArtistMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });


  const [activeFormTab, setActiveFormTab] = useState<'track' | 'playlist' | 'search'>('track');

  // Panel 2 control states
  const [isPanel2Open, setIsPanel2Open] = useState(false);
  const [panel2Mode, setPanel2Mode] = useState<'create-artist' | 'create-album' | 'view-artist' | 'view-album'>('create-artist');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Panel 1: Local Search query for artists/albums
  const [panelSearchQuery, setPanelSearchQuery] = useState('');
  const [searchFilterType, setSearchFilterType] = useState<'all' | 'artists' | 'albums'>('all');

  const triggerCreateArtist = () => {
    setPanel2Mode('create-artist');
    setIsPanel2Open(true);
  }

  const triggerCreateAlbum = () => {
    setPanel2Mode('create-album');
    setIsPanel2Open(true);
  }

  const triggerViewArtist = (id: string) => {
    setSelectedArtistId(id);
    setPanel2Mode('view-artist');
    setIsPanel2Open(true);
  }

  const triggerViewAlbum = (id: string) => {
    setSelectedAlbumId(id);
    setPanel2Mode('view-album');
    setIsPanel2Open(true);
  }

  // Search filter lists
  const filteredArtists = mockArtists.filter(a =>
    a.name.toLowerCase().includes(panelSearchQuery.toLowerCase())
  );

  const filteredAlbums = mockAlbums.filter(al =>
    al.title.toLowerCase().includes(panelSearchQuery.toLowerCase()) ||
    al.artist.toLowerCase().includes(panelSearchQuery.toLowerCase())
  );

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
                setArtists={setArtists}
                triggerCreateArtist={triggerCreateArtist}
                triggerCreateAlbum={triggerCreateAlbum}
                isLoadMore={page < artistMeta.totalPages}
                loadMoreArtist={() => {
                  if (page < artistMeta.totalPages) {
                    getArtists(page + 1);
                    setPage(page + 1);
                  }
                }}
              />
            )}

            {activeFormTab === 'playlist' && (
              <PlaylistForm
                form={playlistForm}
                setForm={setPlaylistForm}
              />
            )}

            {activeFormTab === 'search' && (
              <div className="space-y-5 animate-fade-in">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    value={panelSearchQuery}
                    onChange={(e) => setPanelSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, artista, álbum..."
                    className="w-full bg-[#181818] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-500 outline-none transition-all"
                  />
                </div>

                <div className="flex gap-1.5 shrink-0">
                  {(['all', 'artists', 'albums'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSearchFilterType(f)}
                      className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold transition-all outline-none ${searchFilterType === f
                        ? 'bg-white text-black font-black'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      {f === 'all' ? 'Todo' : f === 'artists' ? 'Artistas' : 'Álbumes'}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {(searchFilterType === 'all' || searchFilterType === 'artists') && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
                        <User size={11} />
                        <span>Artistas Registrados ({filteredArtists.length})</span>
                      </h4>
                      {filteredArtists.length === 0 ? (
                        <p className="text-[10px] text-gray-600 italic px-1">Ningún artista coincide.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-1.5">
                          {filteredArtists.map(artist => (
                            <div
                              key={artist.id}
                              onClick={() => triggerViewArtist(artist.id)}
                              className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0">
                                  <img src={artist.imageUrl} className="w-full h-full object-cover" alt={artist.name} referrerPolicy="no-referrer" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{artist.name}</p>
                                  <span className="text-[9px] text-gray-400 font-mono">ID: {artist.id}</span>
                                </div>
                              </div>
                              <ChevronRight className="text-gray-600 group-hover:text-primary transition-colors" size={14} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section Albums */}
                  {(searchFilterType === 'all' || searchFilterType === 'albums') && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
                        <Disc size={11} />
                        <span>Álbumes Registrados ({filteredAlbums.length})</span>
                      </h4>
                      {filteredAlbums.length === 0 ? (
                        <p className="text-[10px] text-gray-600 italic px-1">Ningún álbum coincide.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-1.5">
                          {filteredAlbums.map(album => (
                            <div
                              key={album.id}
                              onClick={() => triggerViewAlbum(album.id)}
                              className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                                  <img src={album.coverUrl} className="w-full h-full object-cover" alt={album.title} referrerPolicy="no-referrer" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{album.title}</p>
                                  <span className="text-[9px] text-gray-400 truncate leading-none mt-0.5 block">{album.artist}</span>
                                </div>
                              </div>
                              <ChevronRight className="text-gray-600 group-hover:text-primary transition-colors" size={14} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
                    form={artistForm}
                    iPanel2Open={isPanel2Open}
                    setForm={setArtistForm}
                    setIsPanel2Open={setIsPanel2Open}
                  />
                )}

                {panel2Mode === 'create-album' && (
                  <AlbumForm
                    form={albumForm}
                    setForm={setAlbumForm}
                    setIsPanel2Open={setIsPanel2Open}
                  />
                )}

                {panel2Mode === 'view-artist' && (
                  <ArtistProfile
                    selectedArtistId={selectedArtistId || ''}
                    triggerViewAlbum={triggerViewAlbum}
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