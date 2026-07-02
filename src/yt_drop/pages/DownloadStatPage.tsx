import { useEffect, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import "../assets/css/download_stats.css";
import type { Download, DownloadStat, PaginationMeta } from "../types/download.types";
import DownloadStats from "../components/download/DownloadStats";
import DownloadFilters from "../components/download/DownloadFilters";
import DownloadTable from "../components/download/DownloadTable";
import downloadService from "../services/download.service";
import useToast from "../hooks/useToast";
import Toast from "../components/shared/Toast";
import ConfirmToast from "../components/shared/ConfirmToast";
import { TrashIcon } from "../components/shared/Icons";

const DownloadStatPage = () => {
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
  const [items, setItems] = useState<Download[]>([]);
  const [stats, setStats] = useState<DownloadStat>({
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
    getDownloads(1);
  }

  const onQueryChange = (value: string) => {
    setQuery(value);
    setTimeout(() => { getDownloads(1) }, 300);
  }

  async function clearDownloads() {
    setIsActiveConfirmToast(false);

    const data = await downloadService.clearDownloads();

    if (data.error) return showToast({
      title: 'Error',
      message: 'Ocurrió un error inesperado',
      type: 'error',
      icon: <XIcon className="toast-icon" />
    });

    getDownloads(1);

    showToast({
      title: 'Historial eliminado',
      message: 'Tu historial está limpio',
      type: 'success',
      icon: <CheckIcon className="toast-icon" />
    });
  }

  async function getStats() {
    const r = await downloadService.getDownloadStats();
    if (r.data) setStats(r.data);
  }

  async function getDownloads(page: number, isPaginated = false) {
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
    const { error, data } = await downloadService.getDownloads(params);
    setIsLoading(false);

    if (error) {
      setError(true);
    }

    if (!data) return;

    setMeta(data.meta);

    if (isPaginated) {
      setItems((prev) => [...prev, ...data.items]);
    }
    else {
      setItems(data.items);
    }
  }

  useEffect(() => { getStats() }, []);

  useEffect(() => { getDownloads(1) }, [
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

      <DownloadStats stats={stats} />

      <DownloadFilters
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

      <DownloadTable
        meta={meta}
        items={items}
        loadMore={() => {
          if (meta.page < meta.totalPages) {
            const nextPage = meta.page + 1;
            getDownloads(nextPage, true);
          }
        }}
        onDelete={async (id: string) => {
          const r = await downloadService.deleteDownload(id);
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
        onConfirm={clearDownloads}
      />
    </div>
  )
}

export default DownloadStatPage;