import { useRef, useState } from "react";
import { InfoIcon, Link2Icon, XIcon } from "lucide-react";
import type { Download, PaginationMeta } from "../../types/download.types";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { fmtDuration, fmtSize } from "../../helpers/formats";
import downloadService from "../../services/download.service";
import { DownloadIcon } from "../shared/Icons";
import { getFmtDate } from "../../../shared/utils/getFormatDate";

interface DownloadListProps {
  items: Download[];
  meta?: PaginationMeta;
  loadMore?: () => void;
}

const DownloadList = ({ items, meta, loadMore }: DownloadListProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [infoPayload, setInfoPayload] = useState<any>(null);

  const { loaderRef } = useInfiniteScroll(() => {
    loadMore && loadMore();
  });

  async function getInfo(item: Download) {
    if (infoPayload) return setIsOpen(true);
    const r = await downloadService.info(item.url);
    setInfoPayload(r.data);
    setIsOpen(true);
  }

  function getMeta(item: Download) {
    const isAudio = item.format === 'audio';
    const size = fmtSize(item.sizeBytes);
    const date = getFmtDate(item.createdAt, 'dd MMM yyyy').replaceAll(' ', '/');
    const duration = fmtDuration(item.duration);
    const quality = `${item.quality}${isAudio ? 'kbps' : 'p'}`;
    const meta = `${size} • ${quality} • ${duration}`;
    return {
      isAudio,
      size,
      date,
      duration,
      quality,
      meta
    }
  }

  const screenSize = window.innerWidth <= 600;

  return (
    <div
      className={`history-grid ${items.length > 0 ? '' : 'hidden'}`}
      id="history-grid"
      ref={wrapRef}
    >
      {items.map((item, i) => {
        const { date, meta } = getMeta(item);
        const title = item.title || '';

        return (
          <article
            className="hist-item"
            key={`idx-${i}`}
          >
            <div className="flex items-center gap-3.5 w-full">
              <div>
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
              </div>

              <div className="hist-body">
                <div className="hist-title">
                  <h4
                    style={{
                      width: 'fit-content',
                      maxWidth: screenSize ? '100%' : '',
                      marginBottom: '4px'
                    }}
                    className="h-title"
                    title={title}
                  >
                    {title}
                  </h4>

                  <div
                    style={{
                      marginTop: '-4px'
                    }}
                    className="hist-badge hist-badge-t"
                  >
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

                  <button
                    className="dl-btn"
                    onClick={() => downloadService.download(item)}
                  >
                    <DownloadIcon />
                  </button>
                </div>

                <div
                  style={{
                    marginTop: '-5px'
                  }}
                  className="hist-meta truncate"
                  title={meta}
                >
                  {meta}
                </div>
              </div>
            </div>

            <div
              style={{ marginTop: '8px' }}
              className="mt-2 w-full flex-wrap flex items-center justify-between gap-y-2 gap-x-5"
            >
              <div className="flex items-center gap-2">
                <Link2Icon
                  style={{
                    color: 'var(--muted)',
                    minWidth: 20
                  }}
                  size={20}
                />
                <a
                  style={{
                    maxWidth: '100%'
                  }}
                  className="hist-url hover:underline hover:text-white"
                  title={item.url}
                  href={item.url}
                  target="_blank"
                >
                  {item.url}
                </a>
              </div>
              <span className="max-[520px]:hidden hist-meta">
                {date}
              </span>

              <div className="min-[520px]:hidden flex flex-1 items-center justify-between gap-2">
                <div className="hist-badge">
                  <span className={`badge ${item.format === 'audio' ? 'badge-audio' : 'badge-video'}`}>
                    {item.format || 'video'}
                  </span>
                  <span className={`badge ${item.status === 'success' ? 'badge-ok' : 'badge-error'}`}>
                    {item.status === 'success' ? 'OK' : 'Error'}
                  </span>
                </div>
                <span className="hist-meta">
                  {date}
                </span>
              </div>
            </div>
          </article>
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

export default DownloadList;