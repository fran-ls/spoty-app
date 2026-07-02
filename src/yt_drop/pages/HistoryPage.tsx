import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, XIcon } from "lucide-react";
import type { HistoryItem, PaginationMeta } from "../types/history.type";
import Select from "../components/shared/Select";
import { AppIcon, TrashIcon } from "../components/shared/Icons";
import Toast from "../components/shared/Toast";
import ConfirmToast from "../components/shared/ConfirmToast";
import { apiService } from "../api/api.service";
import HistoryList from "../components/history/HistoryList";
import useToast from "../hooks/useToast";
import { routes } from "../../shared/utils/routes";

const HistoryPage = () => {
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

  const [history, setHistory] = useState<HistoryItem[]>([]);
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

  async function clearHistory() {
    setIsActiveConfirmToast(false);

    const data = await apiService.clearHistory();

    if (data.error) return showToast({
      title: 'Error',
      message: 'Ocurrió un error inesperado',
      type: 'error',
      icon: <XIcon className="toast-icon" />
    });

    getDownloadHistory();

    showToast({
      title: 'Historial eliminado',
      message: 'Tu historial está limpio',
      type: 'success',
      icon: <CheckIcon className="toast-icon" />
    });
  }

  async function getDownloadHistory(filters: Record<string, string | number> = {}, isPaginated = false) {
    const { data } = await apiService.getHistory(filters);
    if (data.meta) setMeta(data.meta);

    if (isPaginated) {
      setHistory((prev) => [...prev, ...data.items]);
    }
    else {
      setHistory(data.items);
    }
  }

  useEffect(() => { getDownloadHistory() }, []);
  useEffect(() => { getDownloadHistory(filters) }, [filters]);

  return (
    <div className="yt-drop-wrap">
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
            Historial de descargas &nbsp; {meta.totalPages > 1 && <span id="count">
              {`( ${history.length} - ${meta.total} )`}
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

          {history.length > 0 &&
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

        <HistoryList
          meta={meta}
          items={history}
          loadMore={() => {
            if (meta.page < meta.totalPages) {
              const nextPage = meta.page + 1;
              getDownloadHistory({ ...filters, page: nextPage }, true);
            }
          }}
        />

        {history.length <= 0 &&
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
        onConfirm={clearHistory}
      />
    </div>
  )
}

export default HistoryPage;