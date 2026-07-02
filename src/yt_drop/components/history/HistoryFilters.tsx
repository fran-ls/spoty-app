import { XIcon } from "lucide-react";
import type { PaginationMeta } from "../../types/history.type";

interface HistoryFiltersProps {
  meta: PaginationMeta & { items: number };
  filters: any;
  onQueryChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStartDate: (value: string) => void;
  onEndDate: (value: string) => void;
  onClearFilters: () => void;
}

const HistoryFilters = (props: HistoryFiltersProps) => {
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
        // oninput="debounceLoad()"
        />
      </div>
      <div className="filter-group">
        <span className="filter-label">Formato</span>
        <select
          value={filters.format}
          onChange={(e) => onFormatChange(e.target.value)}
          className="filter-select"
          id="f-format"
        // onchange="loadPage(1)"
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
        // onchange="loadPage(1)"
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
        // onchange="loadPage(1)"
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
        // onchange="loadPage(1)"
        />
      </div>
      <button
        onClick={onClearFilters}
        className="btn-filter-clear"
        type="button"
        title="Limpiar filtros"
      >
        <XIcon size={20} />
      </button>
      <div className="filter-spacer" />
      <div
        style={{ textAlign: 'right' }}
        className="filter-group"
      >
        <span className="filter-label">
          Resultados
        </span>
        <span
          style={{
            fontSize: 16,
            width: '100%',
            padding: '9px 0',
          }}
          className="results-count" id="results-count"
        >
          {meta.items} - {meta.total}
        </span>
      </div>
    </div>
  )
}

export default HistoryFilters;