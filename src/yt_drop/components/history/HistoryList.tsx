import { useEffect, useRef, useState } from "react";
import { InfoIcon, XIcon } from "lucide-react";
import type { HistoryItem, PaginationMeta } from "../../types/history.type";
import { truncateTitleAll, setAllItems } from "../../helpers/truncateText";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { fmtDate, fmtDuration } from "../../helpers/formats";
import { QUALITIES } from "../../data/qualities.data";
import { apiService } from "../../api/api.service";
import { DownloadIcon } from "../shared/Icons";

interface HistoryListProps {
  items: HistoryItem[];
  meta?: PaginationMeta;
  loadMore?: () => void;
}

const HistoryList = ({ items, meta, loadMore }: HistoryListProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [infoPayload, setInfoPayload] = useState<any>(null);

  const { loaderRef } = useInfiniteScroll(() => {
    loadMore && loadMore();
  });

  async function getInfo(item: HistoryItem) {
    if (infoPayload) return setIsOpen(true);
    const r = await apiService.info(item.url);
    setInfoPayload(r.data);
    setIsOpen(true);
  }

  function getMeta(item: HistoryItem) {
    const q = item.quality;
    const fmt = item.format;
    const quality = (QUALITIES as any)[fmt]?.[q];
    const qlity = quality ? `${item.quality} ${quality}` : 'No calidad';
    const meta = `${fmtDate(item.createdAt)} · ${fmtDuration
      (item.duration)} ${quality ? ` · ${qlity}` : ''}`;
    return meta;
  }

  const handleTruncate = () => truncateTitleAll(wrapRef.current!);

  useEffect(() => {
    setTimeout(() => {
      setAllItems(wrapRef.current!);
      handleTruncate();
    }, 1000)
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleTruncate);
    return () => window.removeEventListener('resize', handleTruncate);
  }, []);

  return (
    <div
      className={`history-grid ${items.length > 0 ? '' : 'hidden'}`}
      id="history-grid"
      ref={wrapRef}
    >
      {items.map((item, i) => {
        const meta = getMeta(item);
        const title = item.title || 'Sin título';

        return (
          <div
            className="hist-item"
            key={`idx-${i}`}
          >
            {item.thumbnail ?
              <img
                className="hist-thumb"
                src={item.thumbnail}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              :
              <div className="hist-thumb"></div>
            }

            <div className="hist-body">
              <div className="hist-title">
                <h4
                  className="h-title truncate"
                  title={title}
                >
                  {title}
                </h4>

                <div className="hist-badge">
                  <span className={`badge ${item.format === 'audio' ? 'badge-audio' : 'badge-video'}`}>
                    {item.format || 'video'}
                  </span>
                  <span className={`badge ${item.status === 'success' ? 'badge-ok' : 'badge-error'}`}>
                    {item.status === 'success' ? 'OK' : 'Error'}
                  </span>
                </div>

                <button
                  onClick={() => getInfo(item)}
                  className="btn-info"
                  disabled
                  type="button"
                >
                  <InfoIcon size={20} />
                </button>
              </div>
              <div
                className="hist-url"
                title={item.url}
              >
                {item.url}
              </div>
              <div
                className="hist-meta truncate"
                title={meta}
              >
                {meta}
              </div>
              <button
                onClick={() => apiService.download(item)}
                className="dl-btn"
              >
                <DownloadIcon />
              </button>
            </div>
          </div>
        )
      })}

      <div style={{ display: meta && meta.page < meta.totalPages ? 'block' : 'none' }}>
        <div ref={loaderRef} />
        <div className="spinner" />
      </div>

      {isOpen && (
        <>
          <div className="info-modal" />

          <div className="info-modal-content">
            <pre>{JSON.stringify(infoPayload, null, 2)}</pre>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="btn-close"
            type="button"
          >
            <XIcon />
          </button>
        </>
      )}
    </div>
  )
}

export default HistoryList;