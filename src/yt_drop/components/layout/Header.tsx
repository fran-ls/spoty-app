import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChartNoAxesColumnIcon, DownloadIcon, HistoryIcon, HomeIcon } from "lucide-react";
import { AppIcon } from "../shared/Icons";
import UploadMenu from "../shared/UploadMenu";
import { routes } from "../../../shared/utils/routes";
import useAuth from "../../../features/auth/hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [activePath, setActivePath] = useState('/');

  const links = [
    {
      label: 'Descargar',
      to: routes.YTDrop.download,
      icon: (
        <DownloadIcon />
      )
    },
    {
      label: 'Historial',
      to: routes.YTDrop.history,
      icon: (
        <HistoryIcon />
      )
    },
    {
      label: 'Análisis',
      to: routes.YTDrop.historyStats,
      icon: (
        <ChartNoAxesColumnIcon />
      )
    }
  ]

  useEffect(() => { setActivePath(location.pathname) }, [location]);

  return (
    <nav>
      <div className="nav-inner">
        <Link to={routes.YTDrop.download} className="nav-logo">
          <div className="nav-logo-icon">
            <AppIcon />
          </div>
          <span style={{
            display: 'block',
            marginTop: '3px'
          }}>
            YTDrop
          </span>
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link
              style={{
                height: 28,
                display: 'flex',
                alignItems: 'center'
              }}
              className={`nav-link ${activePath === l.to ? 'active' : ''}`}
              to={l.to}
              key={l.label}
            >
              {l.icon}
              <span style={{
                display: 'block',
                marginTop: '1px'
              }}>
                {l.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="nav-spacer" />
        <div className="nav-user">
          <div className="nav-avatar" id="nav-avatar">
            {user?.username ? user?.username[0].toUpperCase() : '?'}
          </div>
          <div className="nav-u-item">
            <span
              className="nav-username h-4 block text-nowrap overflow-hidden max-w-50" id="nav-username"
              title={user?.username}
            >
              {user?.username}
            </span>
            <span
              className="block text-xs text-nowrap overflow-hidden max-w-45"
              title={user?.email}
            >
              {user?.email}
            </span>
          </div>

          <Link
            to={routes.home}
            style={{ color: 'var(--muted)' }}
            className="max-[500px]:hidden flex w-8 h-8 items-center justify-center rounded-full text-[#adaaaa] hover:text-white hover:bg-black/60 transition-all cursor-pointer"
          >
            <HomeIcon size={24} />
          </Link>

          <UploadMenu />
        </div>
      </div>
    </nav>
  )
}

export default Header;