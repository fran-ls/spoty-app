import { XIcon } from "lucide-react";
import type { PaginationMeta } from "../../types/download.types";

interface DownloadFiltersProps {
  meta: PaginationMeta & { items: number };
  filters: any;
  onQueryChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStartDate: (value: string) => void;
  onEndDate: (value: string) => void;
  onClearFilters: () => void;
}

const DownloadFilters = (props: DownloadFiltersProps) => {
  const {
    meta, filters, onQueryChange, onFormatChange,
    onStatusChange, onClearFilters, onStartDate, onEndDate
  } = props;

  return (
    <div className="filters">
      <div className="filter-group">
        <span className="filter-label">Buscar</span>
        <input
          value={filters.query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Título, URL o archivo…"
          className="filter-input"
          type="search"
          id="f-search"
        />
      </div>
      <div className="filter-group">
        <span className="filter-label">Formato</span>
        <select
          value={filters.format}
          onChange={(e) => onFormatChange(e.target.value)}
          className="filter-select"
          id="f-format"
        >
          <option value="">Todos</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
      </div>
      <div className="filter-group">
        <span className="filter-label">Estado</span>
        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
          id="f-status"
        >
          <option value="">Todos</option>
          <option value="success">Exitoso</option>
          <option value="error">Error</option>
        </select>
      </div>
      <div className="filter-group">
        <span className="filter-label">Desde</span>
        <input
          value={filters.startDate}
          onChange={(e) => onStartDate(e.target.value)}
          className="filter-input filter-date"
          type="date"
          id="f-from"
        />
      </div>
      <div className="filter-sep">→</div>
      <div className="filter-group">
        <span className="filter-label">Hasta</span>
        <input
          value={filters.endDate}
          onChange={(e) => onEndDate(e.target.value)}
          className="filter-input filter-date"
          type="date"
          id="f-to"
        />
      </div>
      <button
        onClick={onClearFilters}
        className="btn-filter-clear btn-filter-clear-1"
        type="button"
        title="Limpiar filtros"
      >
        <XIcon size={20} />
      </button>
      <div className="filter-spacer" />
      <div
        style={{
          textAlign: 'right',
          display: 'flex'
        }}
        className="filter-group div-filter-group"
      >
        <button
          onClick={onClearFilters}
          className="btn-filter-clear btn-filter-clear-1"
          type="button"
          title="Limpiar filtros"
        >
          <XIcon size={20} />
        </button>

        <div className="result-group">
          <span className="filter-label block">
            Resultados
          </span>
          <span
            style={{
              fontSize: 16,
              width: '100%',
              padding: '9px 0',
            }}
            className="results-count block" id="results-count"
          >
            {meta.items} / {meta.total}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DownloadFilters;