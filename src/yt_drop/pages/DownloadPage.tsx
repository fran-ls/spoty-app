import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, XIcon } from "lucide-react";
import type { Download, PaginationMeta } from "../types/download.types";
import Select from "../components/shared/Select";
import { AppIcon, TrashIcon } from "../components/shared/Icons";
import Toast from "../components/shared/Toast";
import ConfirmToast from "../components/shared/ConfirmToast";
import downloadService from "../services/download.service";
import DownloadList from "../components/download/DownloadList";
import useToast from "../hooks/useToast";
import { routes } from "../../shared/utils/routes";

const DownloadPage = () => {
  const {
    toast,
    isActiveToast, setIsActiveToast,
    isFirstLoadToast,
    showToast,
    confirmToast,
    isActiveConfirmToast, setIsActiveConfirmToast,
    isFirstLoadConfirmToast,
    showConfirmToast
  } = useToast();

  const [downloads, setDownloads] = useState<Download[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [filters, setFilters] = useState({
    format: '',
    status: 'success',
    page: 0
  });

  async function clearDownloads() {
    setIsActiveConfirmToast(false);

    const data = await downloadService.clearDownloads();

    if (data.error) return showToast({
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

  async function getDownloads(filters: Record<string, string | number> = {}, isPaginated = false) {
    const { data } = await downloadService.getDownloads(filters);
    if (!data) return;

    setMeta(data.meta);

    if (isPaginated) {
      setDownloads((prev) => [...prev, ...data.items]);
    }
    else {
      setDownloads(data.items);
    }
  }

  useEffect(() => { getDownloads() }, []);
  useEffect(() => { getDownloads(filters) }, [filters]);

  return (
    <div className="yt-drop-wrap">
      <div className="download-wrap">
        <header>
          <Link to={routes.YTDrop.download}>
            <div className="logo">
              <AppIcon />
              <span>YTDrop</span>
            </div>
          </Link>
          <p className="tagline">Historial</p>
        </header>

        <main className="history-section">
          <div className="history-header">
            <h2 className="history-title">
              Descargas &nbsp; {meta.totalPages > 1 && <span id="count">
                {`( ${downloads.length} - ${meta.total} )`}
              </span>}
            </h2>

            <Select
              option={(o) => setFilters({ ...filters, format: o.value })}
              activeIndex={0}
              label="Tipo"
              className="media-type"
              wrapId="media-type"
              items={[
                {
                  label: "Tipo",
                  value: "",
                },
                {
                  label: "Video",
                  value: "video",
                },
                {
                  label: "Audio",
                  value: "audio",
                }
              ]}
            />

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

          <DownloadList
            meta={meta}
            items={downloads}
            loadMore={() => {
              if (meta.page < meta.totalPages) {
                const nextPage = meta.page + 1;
                getDownloads({ ...filters, page: nextPage }, true);
              }
            }}
          />

          {downloads.length <= 0 &&
            <div className="empty-state" id="empty-state">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 6v4l3 3" />
              </svg>
              <p>Aún no hay descargas registradas</p>
            </div>
          }
        </main>

        <footer>
          &copy; 2026 YTDrop
        </footer>

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
      </div>
    </div>
  )
}

export default DownloadPage;