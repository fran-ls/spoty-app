import type { HistoryStat } from "../../types/history.type";
import { fmtSize } from "../../helpers/formats";

const HistoryStats = ({ stats }: { stats: HistoryStat }) => {
  return (
    <div className="stats-grid" id="stats-grid">
      <div className="stat-card c-total">
        <div className="stat-val" id="s-total">
          {stats.total || '—'}
        </div>
        <div className="stat-label">Total</div>
      </div>
      <div className="stat-card c-ok">
        <div className="stat-val" id="s-ok">
          {stats.success || '—'}
        </div>
        <div className="stat-label">Exitosas</div>
      </div>
      <div className="stat-card c-err">
        <div className="stat-val" id="s-err">
          {stats.errors || '—'}
        </div>
        <div className="stat-label">Errores</div>
      </div>
      <div className="stat-card c-video">
        <div className="stat-val" id="s-video">
          {stats.videos || '—'}
        </div>
        <div className="stat-label">Videos</div>
      </div>
      <div className="stat-card c-audio">
        <div className="stat-val" id="s-audio">
          {stats.audios || '—'}
        </div>
        <div className="stat-label">Audios</div>
      </div>
      <div className="stat-card c-size">
        <div className="stat-val" id="s-size">
          {fmtSize(stats.totalSize) || '—'}
        </div>
        <div className="stat-label">Tamaño total</div>
      </div>
    </div>
  )
}

export default HistoryStats;