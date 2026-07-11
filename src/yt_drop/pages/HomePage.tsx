import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, XIcon } from "lucide-react";
import "../assets/css/select.css";
import "../assets/css/home.css";
import "../assets/css/toast.css";
import "../assets/css/upload_sidebar.css";
import type { Download } from "../types/download.types";
import type { FormatType } from "../types/common.types";
import type { Artist, Playlist } from "../types/upload.types";
import { AppIcon, AudioIcon, DownloadIcon, DropdownArrowIcon, PasteIcon, TrashIcon, VideoIcon } from "../components/shared/Icons";
import SimpleToast from "../components/shared/SimpleToast";
import ConfirmToast from "../components/shared/ConfirmToast";
import Toast from "../components/shared/Toast";
import Select from "../components/shared/Select";
import downloadService from "../services/download.service";
import DownloadList from "../components/download/DownloadList";
import { normalizeYouTubeUrl } from "../helpers/normalizeYouTubeUrl";
import { fmtSize } from "../helpers/formats";
import { truncateText } from "../helpers/truncateText";
import { getIsUploadToSpotify } from "../helpers/getIsUpload";
import useToast from "../hooks/useToast";
import UploadSidebar from "../components/shared/UploadSidebar";

function progressLabel(s: string) {
  return {
    queued: 'En cola…',
    running: 'Descargando…',
    done: 'Completado',
    partial: 'Parcialmente completado',
    error: 'Error'
  }[s] || s;
}

const DownloadPage = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const progressPanelRef = useRef<HTMLDivElement>(null);

  const {
    simpleToast,
    isSimpleToast,
    showSimpleToast,
    toast,
    isActiveToast, setIsActiveToast,
    isFirstLoadToast,
    showToast,
    confirmToast,
    isActiveConfirmToast, setIsActiveConfirmToast,
    isFirstLoadConfirmToast,
    showConfirmToast
  } = useToast();

  const [urls, setUrls] = useState('');
  const [format, setFormat] = useState<FormatType>('video');
  const [quality, setQuality] = useState<string>('');

  const [files, setFiles] = useState<Download[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState('Preparando descarga…');

  const [downloads, setDownloads] = useState<Download[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isHiddenDlAllBar, setIsHiddenDlAllBar] = useState(false);

  const [artist, setArtist] = useState<Artist>({
    name: '',
    bio: '',
    image: '',
    file: null,
    imageUrl: ''
  });
  const [playlist, setPlaylist] = useState<Playlist>({
    name: '',
    cover: '',
    bgColor: '#3b3b3b',
    gradientColor: '#111111',
    file: null,
    coverUrl: ''
  });

  async function clearDownloads() {
    setIsActiveConfirmToast(false);

    const r = await downloadService.clearDownloads();

    if (r.error) return showToast({
      title: 'Error',
      message: 'Ocurrió un error inesperado',
      type: 'error',
      icon: <XIcon className="toast-icon" />
    });

    getDownloads();

    showToast({
      title: 'Historial eliminado',
      message: 'Tu historial está limpio',
      type: 'success',
      icon: <CheckIcon className="toast-icon" />
    });
  }

  async function downloadZip() {
    if (isLoading || !files.length) return;

    const r = await downloadService.downloadZip(files);

    if (r.error) {
      showSimpleToast(r.error, 'error', true);
      return;
    }

    if (r.message) {
      showSimpleToast(r.message, 'success');
    }
  }

  async function initDownload() {
    setIsLoading(true);
    setErrors([]);

    const r: any = await downloadService.initDownload({
      urls,
      format,
      quality
    });

    if (r.validation) {
      setIsLoading(false);
      showSimpleToast(r.validation, 'error', true);
      return;
    }

    setIsHiddenDlAllBar(true);

    if (r.status === 500) {
      setIsLoading(false);
      showSimpleToast(r.error || r.message || 'Internal server error', 'del');
      return;
    }

    if (r.error) {
      setIsLoading(false);
      showSimpleToast(r.error || 'Error al iniciar la descarga', 'del', true);
      return;
    }

    if (r.message) {
      showSimpleToast(r.message, 'success');
    }

    const jobId = r.data?.job_id;

    if (jobId) {
      progressPanel();
      pollJob(jobId);
    }
  }

  function pollJob(jid: string) {
    const interval = setInterval(async () => {
      try {
        const { data } = await downloadService.getJob(jid) as any;
        setProgress(data.progress);
        setStatusLabel(progressLabel(data.status));

        if (data.status === 'done' || data.status === 'partial' || data.status === 'error') {
          clearInterval(interval);

          setFiles(data.files || []);
          setErrors(data.errors || []);
          setIsLoading(false);

          getDownloads();

          if (data.files.length > 1) {
            setIsHiddenDlAllBar(false);
          }

          if (data.status === 'done') {
            showSimpleToast('¡Descarga completada!', 'success');
          }
          else if (data.status === 'partial') {
            showSimpleToast('Descarga parcial — algunos errores', 'error');
          }
          else {
            showSimpleToast('Error en la descarga', 'error');
          }

          const isUpload = getIsUploadToSpotify();

          if ((data.status === 'done' || data.status === 'partial') && isUpload) {
            const r = await downloadService.uploadToSpotify(data.files, artist, playlist);

            if (r.error) {
              showSimpleToast(r.error || 'Falló la subida a Spotify clone', 'error');
              return;
            }

            showSimpleToast('Subida completada', 'success');
          }
        }
      } catch (e) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 800);
  }

  function progressPanel() {
    const panel = progressPanelRef.current;
    if (!panel) return;

    panel.style.display = 'block';
    panel.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });

    setFiles([]);
    setProgress(0);
    setStatusLabel('Iniciando…');
  }

  function urlFormat(clipText: string, replace = false) {
    const prefix = 'https://';
    const validUrl = 'www.youtube.com';
    const content = urls.trim();
    const text = clipText.split(prefix)
      .filter((url) => url.includes(validUrl))
      .map(normalizeYouTubeUrl).join('\n');

    if (content.length <= 0 || replace) {
      setUrls(text);
      return text;
    }

    setUrls(`${text}\n${content}`);
    return text;
  }

  function inputHeight(reset = false) {
    const urlInput = inputRef.current;

    if (urlInput) {
      urlInput.style.height = reset ? '0' : urlInput.scrollHeight + "px";
    }
  }

  async function getDownloads() {
    const { data } = await downloadService.getDownloads({ status: 'success' });
    if (data?.items) setDownloads(data.items);
  }

  useEffect(() => { getDownloads() }, []);
  useEffect(() => { inputHeight() }, [urls]);

  return (
    <>
      <div className="yt-drop-wrap">
        <div className="download-wrap">
          <header>
            <div className="logo">
              <div className="logo-link">
                <AppIcon />
              </div>
              <span>YTDrop</span>
            </div>
            <p className="tagline">Descarga videos y audios de YouTube con un solo clic</p>
          </header>

          <main className="card">
            <div className="card-before-wrap">
              <div className="card-before"></div>
            </div>

            <div className="section-title">
              <p>URLs de YouTube</p>
              <button
                onClick={() => navigator.clipboard.readText().then(urlFormat)}
                className="btn-paste"
                id="btn-paste" type="button"
                title="Pegar"
              >
                <PasteIcon />
              </button>
            </div>

            <div className="url-list" id="url-list">
              <div className="url-row">
                <textarea
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  onBlur={() => !urls && inputHeight(true)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const clipText = e.clipboardData.getData('text');
                    urlFormat(clipText);
                  }}
                  ref={inputRef}
                  className="url-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  autoComplete="off"
                  name="urls"
                  id="url-input"
                  rows={3}
                ></textarea>
                <button
                  onClick={() => {
                    setUrls('');
                    inputHeight(true);
                  }}
                  className="btn-clear"
                  id="btn-clear" type="button"
                  title="Limpiar"
                >
                  ⨉
                </button>
              </div>
            </div>

            <div id="preview-strip"></div>

            <div className="options">
              <Select
                option={(p) => setFormat(p.value as FormatType)}
                label="Formato"
                wrapId="format-wrap"
                className="select-format"
                activeIndex={format === 'video' ? 0 : 1}
                items={[
                  {
                    label: "Video (MP4)",
                    value: "video",
                    icon: <VideoIcon />
                  },
                  {
                    label: "Audio (MP3)",
                    value: "audio",
                    icon: <AudioIcon />
                  },
                ]}
              />

              {format === 'audio' ? (
                <Select
                  option={(p) => setQuality(p.value)}
                  activeIndex={1}
                  label="Bitrate"
                  wrapId="audio-quality-group"
                  className="select-audio"
                  deps={[format]}
                  items={[
                    {
                      label: "320 kbps — Max",
                      value: "320",
                    },
                    {
                      label: "192 kbps — Alta",
                      value: "192",
                    },
                    {
                      label: "128 kbps — Normal",
                      value: "128",
                    }
                  ]}
                />
              ) : (
                <Select
                  option={(p) => setQuality(p.value)}
                  activeIndex={2}
                  label="Calidad"
                  wrapId="video-quality-group"
                  className="select-video"
                  deps={[format]}
                  items={[
                    {
                      label: "1080p — Full HD",
                      value: "1080",
                    },
                    {
                      label: "720p — HD",
                      value: "720",
                    },
                    {
                      label: "480p — SD",
                      value: "480",
                    },
                    {
                      label: "360p — Low",
                      value: "360",
                    }
                  ]}
                />
              )}

              {!isLoading ? (
                <button
                  onClick={initDownload}
                  className="btn btn-primary"
                  disabled={isLoading}
                  id="download-btn"
                  title="Descargar"
                >
                  <DownloadIcon />
                  <span>Descargar</span>
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  id="spinner-btn"
                  title="Cargando..."
                >
                  <div className="spinner"></div>
                  <span>Cargando...</span>
                </button>
              )}
            </div>
          </main>

          <div
            ref={progressPanelRef}
            id="progress-panel"
          >
            <div className="progress-wrap">
              <div
                style={{ display: isHiddenDlAllBar ? 'none' : 'flex' }}
                id="dl-all-bar"
              >
                <span id="dl-all-label">
                  {files.length} archivos listos
                </span>
                <button
                  onClick={downloadZip}
                  disabled={!files.length}
                  className="btn btn-green"
                  id="dl-all-btn"
                >
                  <DownloadIcon />
                  Descargar todo (.zip)
                </button>
              </div>

              <div className="progress-header">
                <span className="progress-status" id="progress-status">
                  {statusLabel}
                </span>
                <span className="progress-pct" id="progress-pct">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="progress-bar-bg">
                <div
                  style={{ width: `${progress}%` }}
                  className="progress-bar-fill" id="progress-fill"
                />
              </div>

              <div className="files-list" id="files-list">
                {files.map((f) => (
                  <div className="file-item" key={crypto.randomUUID()}>
                    {f.thumbnail ? (
                      <img
                        className="file-thumb"
                        src={f.thumbnail}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="file-thumb"></div>
                    )}

                    <div className="file-info">
                      <div
                        className="file-title truncate"
                        onLoad={(e) => truncateText(e.currentTarget, '56px')}
                        title={f.title || f.filename}
                      >
                        {f.title || f.filename}
                      </div>
                      <div
                        className="file-meta truncate"
                        onLoad={(e) => truncateText(e.currentTarget, '56px')}
                        title={`${f.filename} · ${fmtSize(f.sizeBytes)}`}
                      >
                        {f.filename} · {fmtSize(f.sizeBytes)}
                      </div>
                    </div>

                    <button
                      className="dl-btn"
                      title="Descargar"
                      onClick={() => downloadService.download(f)}
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                ))}

                {errors.map((e) => (
                  <div className="file-info" key={crypto.randomUUID()}>
                    <div
                      className="file-title"
                      style={{ color: '#ff6464' }}>
                      Error
                    </div>
                    <div className="file-meta">{e.url}</div>
                    <div
                      className="file-meta"
                      style={{
                        color: '#ff6464',
                        marginTop: '4px'
                      }}
                    >
                      {e.error}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="history-section history-section-home">
            <div className="history-header">
              <Link
                to="/history"
                title="Historial completo"
              >
                <h2 className="download-title">
                  Descargas recientes
                  <DropdownArrowIcon />
                </h2>
              </Link>

              {downloads.length > 0 &&
                <button
                  onClick={() => showConfirmToast({
                    title: 'Borrar historial',
                    message: '¿Quieres limpiar todo el historial?',
                    type: 'del',
                    icon: <TrashIcon />
                  })}
                  className="btn-ghost" id="clear-history-btn"
                  type="button"
                >
                  <TrashIcon />
                  Limpiar
                </button>
              }
            </div>

            <DownloadList items={downloads} />

            {downloads.length <= 0 &&
              <div className="empty-state" id="empty-state">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 6v4l3 3" />
                </svg>
                <p>Aún no hay descargas registradas</p>
              </div>
            }
          </section>

          <footer>
            &copy; 2026 YTDrop
          </footer>
        </div>
      </div>

      <UploadSidebar
        artist={artist}
        playlist={playlist}
        setArtist={setArtist}
        setPlaylist={setPlaylist}
        onSave={() => { }}
      />

      <SimpleToast
        {...simpleToast}
        isActive={isSimpleToast}
      />

      <Toast
        {...toast}
        isActive={isActiveToast}
        isFirstLoad={isFirstLoadToast}
        onClose={() => setIsActiveToast(false)}
      />

      <ConfirmToast
        {...confirmToast}
        isActive={isActiveConfirmToast}
        isFirstLoad={isFirstLoadConfirmToast}
        onClose={() => setIsActiveConfirmToast(false)}
        onConfirm={clearDownloads}
      />
    </>
  )
}

export default DownloadPage;