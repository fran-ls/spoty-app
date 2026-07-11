import { useMemo, useRef, useState } from "react";
import { ListIcon, MusicIcon, RotateCcwIcon, SearchIcon, UserIcon, XIcon } from "lucide-react";
import type { Artist, Playlist } from "../../types/upload.types";
import type { Playlist as SongfyPlaylist } from "../../../features/playlist/playlist.types";
import { useAppCtx } from "../../../shared/context/AppContext";
import { config } from "../../../shared/data/config.data";
import useArtist from "../../../features/artist/hooks/useArtist";
import SmartImage from "../../../shared/components/SmartImage";
import artistService from "../../../features/artist/services/artist.service";
import SearchWidget from "./SearchWidget";
import playlistService from "../../../features/playlist/services/playlist.service";
import type { SearchMeta } from "../../../shared/types/common.types";

interface UploadSidebarProps {
  artist: Artist;
  playlist: Playlist;
  setArtist: React.Dispatch<React.SetStateAction<Artist>>;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist>>;
  onSave: () => void;
}

const UploadSidebar = ({ artist, playlist, setArtist, setPlaylist, onSave }: UploadSidebarProps) => {
  const { artists, artistMeta, searchArtists } = useArtist();
  const [playlistMeta, setPlaylistMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [playlists, setPlaylists] = useState<SongfyPlaylist[]>([]);

  const [isArtistSearch, setIsArtistSearch] = useState(false);
  const [isPlaylistSearch, setIsPlaylistSearch] = useState(false);

  const artistInputRef = useRef<HTMLInputElement>(null);
  const playlistInputRef = useRef<HTMLInputElement>(null);
  const color1InputRef = useRef<HTMLInputElement>(null);
  const color2InputRef = useRef<HTMLInputElement>(null);

  const { isSettingsModal, setIsSettingsModal } = useAppCtx();

  const colors = {
    bg: '#3b3b3b',
    gradient: '#111111'
  }

  const stops = useMemo(() => ([
    { color: playlist.bgColor, pos: 50 },
    { color: playlist.gradientColor, pos: 100 }
  ]), [playlist]);
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const gradientDirection = 'to bottom';
  const gradientStops = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");

  function loadImage(file: File | null | undefined, cb: (url: string) => void) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      cb(url || '');
    }
    reader.readAsDataURL(file);
  }

  const closeModal = () => {
    setIsSettingsModal(false)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = `${scrollbarWidth}`;
  }

  async function searchPlaylists(filters?: Record<string, any>) {
    const q = {
      limit: 10,
      page: 0,
      ...filters
    }

    const { data } = await playlistService.searchPlaylists(q);

    if (!data) return;

    setPlaylistMeta(data.meta);

    if (q.page > 1) {
      setPlaylists((prev) => [...prev, ...data.items]);
      return;
    }

    setPlaylists(data.items);
  }

  const loadMoreArtists = async (query: string, page: number) => {
    await searchArtists({
      name: query,
      limit: 10,
      page
    });
  }

  const loadMorePlaylists = async (query: string, page: number) => {
    await searchPlaylists({
      name: query,
      limit: 10,
      page
    });
  }

  return (
    <>
      <div
        onClick={() => setIsSettingsModal(false)}
        className={`${isSettingsModal ? 'open' : ''} modal-overlay`}
        id="modal-overlay"
      />

      <aside
        style={{
          overflow: 'hidden'
        }}
        className={`${isSettingsModal ? 'open' : ''} config-panel`}
        id="config-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Configurar subida"
      >
        <div className="cp-header">
          <div>
            <div className="cp-title">Configurar subida</div>
            <div className="cp-subtitle">Información para {config.APP_NAME}</div>
          </div>
          <button
            onClick={closeModal}
            className="btn-close"
            title="Cerrar"
          >
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="cp-body">
          <div className="cp-section">
            <div className="cp-section-header">
              <div className="cp-section-dot artist"></div>
              <span className="cp-section-label">Artista</span>
              <button
                onClick={() => setArtist({
                  name: '',
                  bio: '',
                  image: '',
                  file: null,
                  imageUrl: ''
                })}
                style={{
                  padding: '2px',
                  color: 'var(--muted)',
                  marginLeft: 'auto'
                }}
                className="cursor-pointer"
                type="button"
              >
                <RotateCcwIcon size={16} />
              </button>
            </div>
            <div className="cp-fields">
              <div className="artist-group">
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '100%'
                  }}
                  className="img-drop field-group"
                  id="artist-drop"
                  title="Seleccionar imagen"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="hidden">Imagen</span>
                  <input
                    onChange={(e) => {
                      loadImage(e.target.files?.[0], (image) => {
                        setArtist({
                          ...artist,
                          file: e.target.files?.[0] || null,
                          image
                        })
                      })
                    }}
                    ref={artistInputRef}
                    accept="image/*"
                    type="file"
                  />

                  {artist.image &&
                    <img
                      onClick={() => artistInputRef.current?.click()}
                      style={{
                        borderRadius: 0,
                        display: artist.image ? 'block' : 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        border: 0
                      }}
                      className="img-preview"
                      crossOrigin="anonymous"
                      src={artist.image}
                      id="artist-preview"
                      alt="Vista previa artista"
                    />
                  }

                  {artist.image &&
                    <button
                      onClick={() => setArtist({ ...artist, file: null, image: '' })}
                      className="btn-img-clear"
                      type="button"
                    >
                      <span>
                        <XIcon fill="currentColor" />
                      </span>
                    </button>
                  }
                </div>

                <div className="field-group artist-name">
                  <div className="flex items-center justify-between gap-2">
                    <label className="field-label">Nombre</label>
                    <button
                      onClick={() => setIsArtistSearch(true)}
                      style={{
                        color: 'var(--muted)'
                      }}
                      className="cursor-pointer text-[9px] p-0.5"
                      title="Buscar artista"
                      type="button"
                    >
                      <SearchIcon size={14} />
                    </button>
                  </div>

                  <input
                    onChange={(e) => setArtist({ ...artist, name: e.target.value })}
                    value={artist.name}
                    placeholder="Nombre del artista"
                    className="field-input"
                    id="artist-name"
                    type="text"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Portada URL</label>
                <input
                  onChange={(e) => setArtist({ ...artist, imageUrl: e.target.value })}
                  value={artist.imageUrl}
                  placeholder="https://cover.jpg"
                  className="field-input"
                  id="image-url"
                  type="text"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Biografía</label>
                <textarea
                  onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
                  value={artist.bio}
                  placeholder="Breve descripción del artista…"
                  className="field-textarea"
                  id="artist-bio"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="cp-section">
            <div className="cp-section-header">
              <div className="cp-section-dot playlist"></div>
              <span className="cp-section-label">Playlist</span>
              <button
                onClick={() => setPlaylist({
                  name: '',
                  cover: '',
                  bgColor: '#3b3b3b',
                  gradientColor: '#111111',
                  file: null,
                  coverUrl: ''
                })}
                style={{
                  padding: '2px',
                  color: 'var(--muted)',
                  marginLeft: 'auto'
                }}
                className="cursor-pointer"
                type="button"
              >
                <RotateCcwIcon size={16} />
              </button>
            </div>
            <div className="cp-fields">
              <div className="playlist-group">
                <div
                  className="img-drop field-group"
                  id="playlist-drop"
                  title="Seleccionar imagen"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="hidden">Portada</span>
                  <input
                    onChange={(e) => {
                      loadImage(e.target.files?.[0], (image) => {
                        setPlaylist({
                          ...playlist,
                          file: e.target.files?.[0] || null,
                          cover: image
                        })
                      })
                    }}
                    ref={playlistInputRef}
                    accept="image/*"
                    type="file"
                  />

                  {playlist.cover &&
                    <img
                      onClick={() => playlistInputRef.current?.click()}
                      style={{
                        border: 0,
                        display: playlist.cover ? 'block' : 'none'
                      }}
                      className="img-preview"
                      crossOrigin="anonymous"
                      src={playlist.cover}
                      id="playlist-preview"
                      alt="Portada"
                    />
                  }

                  {playlist.cover &&
                    <button
                      onClick={() => setPlaylist({ ...playlist, file: null, cover: '' })}
                      className="btn-img-clear"
                      type="button"
                    >
                      <span>
                        <XIcon fill="currentColor" />
                      </span>
                    </button>
                  }
                </div>

                <div className="field-group playlist-name">
                  <div className="flex items-center justify-between gap-2">
                    <label className="field-label">Nombre</label>
                    <button
                      onClick={() => setIsPlaylistSearch(true)}
                      style={{
                        color: 'var(--muted)'
                      }}
                      className="cursor-pointer text-[9px] p-0.5"
                      title="Buscar playlist"
                      type="button"
                    >
                      <SearchIcon size={14} />
                    </button>
                  </div>
                  <input
                    onChange={(e) => setPlaylist({ ...playlist, name: e.target.value })}
                    value={playlist.name}
                    placeholder="Nombre de la playlist"
                    className="field-input"
                    id="pl-name"
                    type="text"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">URL Portada</label>
                <input
                  onChange={(e) => setPlaylist({ ...playlist, coverUrl: e.target.value })}
                  value={playlist.coverUrl}
                  placeholder="https://cover.jpg"
                  className="field-input"
                  id="cover-url"
                  type="text"
                />
              </div>

              <div className="field-group">
                <div className="flex items-center justify-between gap-2">
                  <label className="field-label">Color de Fondo</label>
                  <button
                    onClick={() => setPlaylist({
                      ...playlist,
                      bgColor: colors.bg,
                      gradientColor: colors.gradient
                    })}
                    style={{
                      padding: '2px',
                      color: 'var(--muted)'
                    }}
                    className="cursor-pointer"
                    type="button"
                  >
                    <RotateCcwIcon size={16} />
                  </button>
                </div>
                <div className="color-row">
                  <div className="color-group">
                    <div
                      onClick={() => color1InputRef.current?.click()}
                      className="color-pick-wrap"
                    >
                      <div
                        style={{ background: playlist.bgColor }}
                        className="color-swatch"
                        id="swatch1"
                      />
                      <span className="color-val" id="cv1">
                        {playlist.bgColor}
                      </span>
                      <input
                        onChange={(e) => setPlaylist({
                          ...playlist,
                          bgColor: e.target.value
                        })}
                        value={playlist.bgColor}
                        ref={color1InputRef}
                        id="cp1"
                        type="color"
                      />
                    </div>
                  </div>

                  <div className="color-group">
                    <div
                      onClick={() => color2InputRef.current?.click()}
                      className="color-pick-wrap"
                    >
                      <div
                        className="color-swatch"
                        id="swatch2"
                        style={{ background: playlist.gradientColor }}
                      />
                      <span className="color-val" id="cv2">
                        {playlist.gradientColor}
                      </span>
                      <input
                        onChange={(e) => setPlaylist({
                          ...playlist,
                          gradientColor: e.target.value
                        })}
                        value={playlist.gradientColor}
                        ref={color2InputRef}
                        type="color"
                        id="cp2"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="gradient-preview"
                  style={{
                    background: `linear-gradient(${gradientDirection}, ${gradientStops})`,
                    marginTop: '10px'
                  }}
                  id="gradient-preview"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="cp-footer">
          <button
            onClick={closeModal}
            className="btn-cancel"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="btn-save"
            type="button"
          >
            Guardar
          </button>
        </div>

        <SearchWidget
          keys={{
            label: 'name',
            value: 'id',
            sub: 'id'
          }}
          bgColor="#111119"
          label="Buscar artista"
          open={isArtistSearch}
          items={artists}
          meta={artistMeta}
          isLoadMore={artistMeta.hasNextPage}
          loadMore={loadMoreArtists}
          onClose={() => setIsArtistSearch(false)}
          payload={({ label, item }) => {
            const image = artistService.artistImage(item?.id, item?.image);
            setArtist({
              ...artist,
              name: label,
              imageUrl: image,
              bio: item?.bio,
              image
            });
          }}
          loadIcon={({ id, image }) => (
            <SmartImage
              wrapClassName="bg-white/5 text-gray-400 w-9 h-9 rounded-full border border-white/5 overflow-hidden shrink-0"
              url={artistService.artistImage(id, image)}
              icon={<UserIcon size={16} />}
            />
          )}
        />

        <SearchWidget
          keys={{
            label: 'name',
            value: 'id',
            sub: 'user.username'
          }}
          bgColor="#111119"
          label="Buscar lista"
          open={isPlaylistSearch}
          items={playlists}
          meta={playlistMeta}
          isLoadMore={playlistMeta.hasNextPage}
          loadMore={loadMorePlaylists}
          onClose={() => setIsPlaylistSearch(false)}
          payload={({ label, item }) => {
            const cover = playlistService.playlistCover(item?.id, item?.cover);
            setPlaylist({
              ...playlist,
              name: label,
              coverUrl: cover,
              bgColor: item?.bgColor,
              gradientColor: item?.gradientColor,
              cover
            });
          }}
          loadIcon={({ id, cover }) => (
            <SmartImage
              wrapClassName="bg-white/5 text-gray-400 w-9 h-9 rounded-md border border-white/5 overflow-hidden shrink-0"
              url={playlistService.playlistCover(id, cover)}
              icon={<MusicIcon size={16} />}
            />
          )}
        />
      </aside>
    </>
  )
}

export default UploadSidebar;