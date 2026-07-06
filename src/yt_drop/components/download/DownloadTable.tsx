import { useState } from "react";
import type { Download, PaginationMeta } from "../../types/download.types";
import { DownloadIcon, EllipsisVerticalIcon, TrashIcon } from "lucide-react";
import { fmtDuration, fmtSize } from "../../helpers/formats";
import downloadService from "../../services/download.service";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { getFmtDate } from "../../../shared/utils/getFormatDate";

interface DownloadTableProps {
  items: Download[];
  isLoading: boolean;
  meta: PaginationMeta;
  error: any;
  loadMore: () => void;
  onDelete: (id: string) => Promise<void>;
}

const DownloadTable = ({ items, meta, isLoading, error, loadMore, onDelete }: DownloadTableProps) => {
  const [activeId, setActiveId] = useState('');

  const { loaderRef } = useInfiniteScroll(() => {
    loadMore && loadMore();
  });

  return (
    <div className="results-section">
      <div className="table-wrap">
        <table id="hist-table">
          <thead>
            <tr>
              <th className="td-thumb"></th>
              <th>
                Título <span className="sort-arrow" id="arr-title">↕</span>
              </th>
              <th className="td-fmt">
                Formato <span className="sort-arrow" id="arr-format">↕</span>
              </th>
              <th className="td-quality">
                Calidad <span className="sort-arrow" id="arr-quality">↕</span>
              </th>
              <th className="td-size">
                Tamaño <span className="sort-arrow" id="arr-size_bytes">↕</span>
              </th>
              <th className="td-duration">
                Duración <span className="sort-arrow" id="arr-duration">↕</span>
              </th>
              <th className="td-user">
                Propietario <span className="sort-arrow" id="arr-username">↕</span>
              </th>
              <th className="td-date sorted">
                Fecha <span className="sort-arrow" id="arr-created_at">↓</span>
              </th>
              <th className="td-status">Estado</th>
              <th className="td-actions"></th>
            </tr>
          </thead>
          <tbody id="hist-tbody">
            {items.length > 0 ? (items.map((item) => {
              const isOk = item.status === "success";
              const isMp3 = item.format === "audio";
              const canDl = isOk && item.filename;
              const [date, time] = getFmtDate(item.createdAt, '').split(' ')
              const dateTime = `${date} ${time.replace('/', ' ')}`;

              return (
                <tr key={item.id}>
                  <td className="td-thumb aspect-video min-w-25" style={{
                    minWidth: 100
                  }}>
                    {
                      item.thumbnail
                        ?
                        <img
                          className="thumb-img"
                          src={item.thumbnail}
                          onError={({ currentTarget }) => {
                            currentTarget.style.visibility = 'hidden';
                          }}
                          loading="lazy"
                        />
                        : <div className="thumb-img" />
                    }
                  </td>
                  <td className="td-title">
                    <div className="title-text" title={item.title || ""}>
                      <div>{item.title || "Sin título"}</div>
                    </div>
                    <div className="url-text" title={item.url || ""}>
                      <div>{item.url || ""}</div>
                    </div>
                  </td>
                  <td className="td-fmt">
                    <span className={`badge ${isMp3 ? "badge-audio" : "badge-video"}`}>
                      {item.format || "video"}
                    </span>
                  </td>
                  <td className="td-quality">
                    {item.quality ? (isMp3 ? item.quality + " kbps" : item.quality + "p") : "—"}
                  </td>
                  <td className="td-size">
                    {fmtSize(item.sizeBytes) || "—"}
                  </td>
                  <td className="td-duration">
                    {fmtDuration(item.duration) || "—"}
                  </td>
                  <td className="td-user" title={item.uploader}>
                    <div>{item.uploader || '-'}</div>
                  </td>
                  <td className="td-date" title={dateTime}>
                    {dateTime}
                  </td>
                  <td className="td-status">
                    <span className={`badge ${isOk ? "badge-ok" : "badge-error"}`}>
                      {isOk ? "OK" : "Error"}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button
                      onClick={() => setActiveId(activeId ? '' : item.id)}
                      className="act-btn transparent"
                      type="button"
                    >
                      <EllipsisVerticalIcon />
                    </button>

                    {activeId === item.id &&
                      <div className="history-stat-table-menu">
                        <button
                          onClick={() => canDl && downloadService.download(item)}
                          className="act-btn transparent"
                          type="button"
                        >
                          <DownloadIcon />
                          Guardar
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="act-btn delete transparent"
                          type="button"
                        >
                          <TrashIcon />
                          Borrar
                        </button>

                      </div>
                    }
                  </td>
                </tr>
              )
            })) : (!error && !isLoading &&
              <tr>
                <td
                  colSpan={10}
                  style={{
                    padding: '60px',
                    textAlign: 'center',
                    color: 'var(--muted)',
                  }}
                >
                  <svg viewBox="0 0 24 24"
                    style={{
                      width: '36px',
                      height: '36px',
                      fill: 'var(--muted)',
                      opacity: 0.3,
                      display: 'block',
                      margin: '0 auto 12px'
                    }}>
                    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 6v4l3 3" />
                  </svg>
                  Sin resultados para estos filtros
                </td>
              </tr>
            )}

            <tr style={{
              display: meta && meta.page < meta.totalPages ? '' : 'none',
            }}>
              <td colSpan={10}>
                <div className="w-full h-full" ref={loaderRef}>
                  <div className="spinner" />
                </div>
              </td>
            </tr>

            {isLoading &&
              <tr className="loading-row">
                <td colSpan={10}>
                  <span className="spinner-sm" /> Cargando…
                </td>
              </tr>
            }

            {error &&
              <tr className="loading-row">
                <td colSpan={10} style={{ color: 'var(--accent)' }}>
                  Error al cargar
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DownloadTable;