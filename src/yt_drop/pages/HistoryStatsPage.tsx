import { useEffect, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import "../assets/css/history_stats.css";
import type { HistoryItem, HistoryStat, PaginationMeta } from "../types/history.type";
import HistoryStats from "../components/history/HistoryStats";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryTable from "../components/history/HistoryTable";
import { apiService } from "../api/api.service";
import useToast from "../hooks/useToast";
import Toast from "../components/shared/Toast";
import ConfirmToast from "../components/shared/ConfirmToast";
import { TrashIcon } from "../components/shared/Icons";

const HistoryStatsPage = () => {
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

  const pageSize = 10;

  const [meta, setMeta] = useState<PaginationMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStat>({
    audios: 0,
    videos: 0,
    total: 0,
    totalSize: 0,
    success: 0,
    errors: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [query, setQuery] = useState('');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');

  function onClearFilters() {
    setQuery('');
    setFormat('');
    setStatus('');
    setEndDate('');
    setStartDate('');
    getHistory(1);
  }

  const onQueryChange = (value: string) => {
    setQuery(value);
    setTimeout(() => { getHistory(1) }, 300);
  }

  async function clearHistory() {
    setIsActiveConfirmToast(false);

    const data = await apiService.clearHistory();

    if (data.error) return showToast({
      title: 'Error',
      message: 'Ocurrió un error inesperado',
      type: 'error',
      icon: <XIcon className="toast-icon" />
    });

    getHistory(1);

    showToast({
      title: 'Historial eliminado',
      message: 'Tu historial está limpio',
      type: 'success',
      icon: <CheckIcon className="toast-icon" />
    });
  }

  async function getStats() {
    const r = await apiService.getHistoryStats();
    if (r.status === 200) setStats(r.data);
  }

  async function getHistory(page: number, isPaginated = false) {
    const skip = (page - 1) * pageSize;

    const params = {
      page,
      limit: pageSize.toString(),
      skip: skip.toString(),
      ...(query && { title: query.trim() }),
      ...(query && { search: query.trim() }),
      ...(format && { format: format.trim() }),
      ...(status && { status: status.trim() }),
      ...(startDate && { date_from: startDate }),
      ...(endDate && { date_to: endDate }),
    }

    setIsLoading(true);

    const r = await apiService.getHistory(params);

    if (r.data) {
      setMeta(r.data.meta);

      if (isPaginated) {
        setItems((prev) => [...prev, ...r.data.items]);
      }
      else {
        setItems(r.data.items);
      }
    }

    if (r.error) {
      setError(true);
    }

    setIsLoading(false);
  }

  useEffect(() => { getStats() }, []);

  useEffect(() => { getHistory(1) }, [
    format,
    status,
    endDate,
    startDate
  ]);

  return (
    <div className="history-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historial de <span>descargas</span></h1>
        </div>
        <div className="actions-bar">
          <button
            onClick={() => showConfirmToast({
              title: 'Borrar historial',
              message: '¿Quieres limpiar todo el historial?',
              type: 'del',
              icon: <TrashIcon />
            })}
            className="btn btn-danger"
            type="button"
          >
            <TrashIcon fill="currentColor" />
            Limpiar todo
          </button>
        </div>
      </div>

      <HistoryStats stats={stats} />

      <HistoryFilters
        filters={{
          query,
          format,
          status,
          endDate,
          startDate,
        }}
        meta={{ ...meta, items: items.length }}
        onEndDate={(value) => setEndDate(value)}
        onStartDate={(value) => setStartDate(value)}
        onStatusChange={(value) => setStatus(value)}
        onFormatChange={(value) => setFormat(value)}
        onQueryChange={onQueryChange}
        onClearFilters={onClearFilters}
      />

      <HistoryTable
        meta={meta}
        items={items}
        loadMore={() => {
          if (meta.page < meta.totalPages) {
            const nextPage = meta.page + 1;
            getHistory(nextPage, true);
          }
        }}
        onDeleteItem={async (id: string) => {
          const r = await apiService.deleteOneHistory(id);
          if (r.status === 200) setItems(
            (prev) => prev.filter((item) => item.id !== id)
          );
        }}
        isLoading={isLoading}
        error={error}
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
        onConfirm={clearHistory}
      />
    </div>
  )
}

export default HistoryStatsPage;