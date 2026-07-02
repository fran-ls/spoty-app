import { Link } from "react-router-dom";
import { ChartNoAxesColumnIcon, DownloadIcon, HistoryIcon, LogInIcon } from "lucide-react";
import { AppIcon } from "../shared/Icons";
import { routes } from "../../../shared/utils/routes";

const Sidebar = () => {
  const navItems = [
    {
      label: 'Descargar',
      to: routes.YTDrop.download,
      icon: <DownloadIcon />
    },
    {
      label: 'Historial',
      to: routes.YTDrop.history,
      icon: <HistoryIcon />
    },
    {
      label: 'Análisis',
      to: routes.YTDrop.historyStats,
      icon: <ChartNoAxesColumnIcon />
    },
    {
      label: 'Auth',
      to: routes.YTDrop.auth,
      icon: <LogInIcon />
    }
  ];

  return (
    <aside>
      <header className="aside-header">
        <div className="logo">
          <Link className="logo-link" to="/">
            <AppIcon />
          </Link>
          <span>YTDrop</span>
        </div>
        <p className="tagline hidden">Descarga videos y audios de YouTube con un solo clic</p>
      </header>
      <nav className="aside-nav">
        <ul>
          {navItems.map((it) => (
            <li key={it.label}>
              <Link to={it.to}>
                {it.icon}
                <span>{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <footer style={{
        paddingBlock: 20,
        width: '100%'
      }}
      >
        &copy; 2026 YTDrop
      </footer>
    </aside>
  )
}

export default Sidebar;