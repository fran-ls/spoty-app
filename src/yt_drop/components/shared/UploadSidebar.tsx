import { useRef } from "react";
import { XIcon } from "lucide-react";
import type { Artist, Playlist } from "../../types/upload.type";
import { useAppCtx } from "../../../shared/context/AppContext";
import { config } from "../../../shared/data/config.data";

interface UploadSidebarProps {
  artist: Artist;
  playlist: Playlist;
  setArtist: React.Dispatch<React.SetStateAction<Artist>>;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist>>;
  onSave: () => void;
}

const UploadSidebar = ({ artist, playlist, setArtist, setPlaylist, onSave }: UploadSidebarProps) => {
  const artistInputRef = useRef<HTMLInputElement>(null);
  const playlistInputRef = useRef<HTMLInputElement>(null);
  const color1InputRef = useRef<HTMLInputElement>(null);
  const color2InputRef = useRef<HTMLInputElement>(null);

  const { isSettingsModal, setIsSettingsModal } = useAppCtx();

  const stops = [
    { color: playlist.bgColor, pos: 0 },
    { color: playlist.gradientColor, pos: 50 },
    { color: '#131313', pos: 100 }
  ]

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

  return (
    <>
      <div
        onClick={() => setIsSettingsModal(false)}
        className={`${isSettingsModal ? 'open' : ''} modal-overlay`}
        id="modal-overlay"
      />

      <aside
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
            </div>
            <div className="cp-fields">
              <div className="artist-group">
                <div
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
                        display: artist.image ? 'block' : 'none'
                      }}
                      className="img-preview"
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
                  <label className="field-label">Nombre</label>
                  <input
                    onChange={(e) => setArtist({ ...artist, name: e.target.value })}
                    placeholder="Nombre del artista"
                    className="field-input"
                    id="artist-name"
                    type="text"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">URL Imagen</label>
                <input
                  onChange={(e) => setArtist({ ...artist, imageUrl: e.target.value })}
                  placeholder="https://image.jpg"
                  className="field-input"
                  id="image-url"
                  type="text"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Biografía</label>
                <textarea
                  onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
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
                        display: playlist.cover ? 'block' : 'none'
                      }}
                      className="img-preview"
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
                  <label className="field-label">Nombre</label>
                  <input
                    onChange={(e) => setPlaylist({ ...playlist, name: e.target.value })}
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
                  placeholder="https://cover.jpg"
                  className="field-input"
                  id="cover-url"
                  type="text"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Colores del gradiente</label>
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
                        onChange={(e) => setPlaylist({ ...playlist, bgColor: e.target.value })}
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
                        onChange={(e) => setPlaylist({ ...playlist, gradientColor: e.target.value })}
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
      </aside>
    </>
  )
}

export default UploadSidebar;