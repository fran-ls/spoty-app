import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircleIcon, XIcon, MusicIcon, SearchIcon, ChevronLeftIcon, ListVideoIcon } from 'lucide-react';
import type { Artist } from '../../artist/artist.types';
import type { Album } from '../../artist/album.types';
import type { Playlist } from '../../playlist/playlist.types';
import useAuth from '../../auth/hooks/useAuth';
import ArtistForm from '../../artist/components/ArtistForm';
import TrackForm from './TrackForm';
import PlaylistForm from '../../playlist/components/PanelPlaylistForm';
import PlaylistDetail from '../../playlist/components/PanelPlaylistDetail';
import AlbumForm from '../../artist/components/AlbumForm';
import ArtistProfile from '../../artist/components/ArtistProfile';
import AlbumDetail from '../../artist/components/AlbumDetail';
import artistService from '../../artist/services/artist.service';
import SearchPanel from '../../search/SearchPanel';
import useArtist from '../../artist/hooks/useArtist';
import useAlbum from '../../artist/hooks/useAlbum';
import albumService from '../../artist/services/album.service';

export type PanelMode = 'create-artist' | 'create-album' | 'view-artist' | 'view-album' | 'view-playlist';

export const UploadPanel: React.FC = () => {
  const { dispatch } = useAuth();
  const { setArtists } = useArtist();
  const { albums, albumMeta, searchAlbums, setAlbums } = useAlbum();

  const [activeTab, setActiveTab] = useState<'track' | 'playlist' | 'search'>('track');
  const [panel2Mode, setPanel2Mode] = useState<PanelMode>('create-artist');
  const [isPanel2Open, setIsPanel2Open] = useState(false);

  const [activeArtist, setActiveArtist] = useState<Artist | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  const [albumSearchQuery, setAlbumSearchQuery] = useState('');
  const [albumPage, setAlbumPage] = useState(0);
  const albumFilters = {
    title: albumSearchQuery.trim(),
    limit: 10,
    page: 0
  }

  function loadMoreAlbums() {
    if (!albumMeta.hasNextPage) return;
    searchAlbums({ ...albumFilters, page: albumPage + 1 });
    setAlbumPage(albumPage + 1);
  }

  const triggerCreateArtist = () => {
    setPanel2Mode('create-artist');
    setIsPanel2Open(true);
  }

  const triggerCreateAlbum = () => {
    setPanel2Mode('create-album');
    setIsPanel2Open(true);
  }

  const triggerViewAlbum = (album: Album) => {
    if (!album) {
      setIsPanel2Open(false);
      return;
    }

    setPanel2Mode('view-album');
    setActiveAlbum(album);
    setIsPanel2Open(true);
  }

  const triggerViewArtist = (artist: Artist) => {
    if (!artist) {
      setIsPanel2Open(false);
      return;
    }

    setPanel2Mode('view-artist');
    setActiveArtist(artist);
    setIsPanel2Open(true);
  }

  const triggerViewPlaylist = (playlist: Playlist) => {
    if (!playlist) {
      setIsPanel2Open(false);
      return;
    }

    setPanel2Mode('view-playlist');
    setActivePlaylist(playlist);
    setIsPanel2Open(true);
  }

  const onClosePanel2 = () => setIsPanel2Open(false);

  async function onRemoveArtist(id?: string, isRemoveFiles?: boolean) {
    const artistId = id ?? activeArtist?.id;
    if (!activeArtist || !artistId) return false;

    const { data, error } = await artistService.deleteArtist(artistId, isRemoveFiles);

    if (error || !data || !data.id) {
      return false;
    }

    setActiveArtist(null);
    setIsPanel2Open(false);
    setArtists((prev) => prev.filter((a) => a.id !== artistId));
    return true;
  }

  async function onRemoveAlbum() {
    const albumId = activeAlbum?.id;
    if (!activeAlbum || !albumId) return false;

    const { data, error } = await albumService.deleteAlbum(albumId);

    if (error || !data || !data.id) {
      return false;
    }

    setActiveAlbum(null);
    setIsPanel2Open(false);
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
    return true;
  }

  useEffect(() => { setTimeout(() => searchAlbums(albumFilters), 300) }, [albumSearchQuery]);

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
                setActiveTab('track');
                setIsPanel2Open(false);
              }}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${activeTab === 'track'
                ? 'bg-primary text-black font-black shadow-md shadow-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <MusicIcon size={12} />
              <span>Tema</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('playlist');
                setIsPanel2Open(false);
              }}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${activeTab === 'playlist'
                ? 'bg-primary text-black font-black shadow-md shadow-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <ListVideoIcon size={13} />
              <span>Playlist</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('search');
                setIsPanel2Open(false);
              }}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${activeTab === 'search'
                ? 'bg-primary text-black font-black shadow-md shadow-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <SearchIcon size={12} />
              <span>Buscar</span>
            </button>
          </div>

          {/* Panel Form / Scroll Body */}
          <div className="flex-1 overflow-y-auto primary-panel-content relative upload-panel-main-wrap">
            {activeTab === 'track' && (
              <TrackForm
                albums={albums}
                isLoadMoreAlbums={albumMeta.hasNextPage}
                albumSearchQuery={albumSearchQuery}
                loadMoreAlbums={loadMoreAlbums}
                setAlbumSearchQuery={setAlbumSearchQuery}
                triggerCreateArtist={triggerCreateArtist}
                triggerCreateAlbum={triggerCreateAlbum}
              />
            )}

            {activeTab === 'playlist' && (
              <PlaylistForm />
            )}

            {activeTab === 'search' && (
              <SearchPanel
                setActiveAlbum={setActiveAlbum}
                triggerViewAlbum={triggerViewAlbum}
                triggerViewArtist={triggerViewArtist}
                triggerViewPlaylist={triggerViewPlaylist}
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
              <div className="relative p-5 border-b border-white/5 flex items-center justify-between bg-[#1b1b1b] max-w-115">
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
                    {panel2Mode === 'view-playlist' && 'Playlist'}
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
              <div className="max-w-115 flex-1 secondary-panel-content relative upload-panel-wrap">
                {panel2Mode === 'create-artist' && (
                  <ArtistForm
                    setArtists={setArtists}
                    setIsPanel2Open={setIsPanel2Open}
                  />
                )}

                {panel2Mode === 'create-album' && (
                  <AlbumForm
                    setAlbums={setAlbums}
                    setIsPanel2Open={setIsPanel2Open}
                  />
                )}

                {panel2Mode === 'view-artist' && (
                  <ArtistProfile
                    artist={activeArtist}
                    onRemove={onRemoveArtist}
                    triggerViewAlbum={triggerViewAlbum}
                  />
                )}

                {panel2Mode === 'view-album' &&
                  <AlbumDetail
                    activeAlbum={activeAlbum}
                    onRemove={onRemoveAlbum}
                  />
                }

                {panel2Mode === 'view-playlist' &&
                  <PlaylistDetail
                    activePlaylist={activePlaylist}
                    onClose={onClosePanel2}
                  />
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}