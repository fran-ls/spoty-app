import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChartNoAxesColumnIcon, DownloadIcon, HistoryIcon, HomeIcon, ShieldIcon } from "lucide-react";
import { apiService } from "../../api/api.service";
import { AppIcon } from "../shared/Icons";
import UploadMenu from "../shared/UploadMenu";
import { routes } from "../../../shared/utils/routes";
import useAuth from "../../../features/auth/hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activePath, setActivePath] = useState('/');

  const logout = async () => {
    const r = await apiService.logout();

    if (r.data?.ok) {
      navigate(routes.auth);
    }
  }

  const links = [
    {
      label: 'Auth',
      to: routes.YTDrop.auth,
      icon: (
        <ShieldIcon />
      )
    },
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
          <span>YTDrop</span>
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link
              className={`nav-link ${activePath === l.to ? 'active' : ''}`}
              to={l.to}
              key={l.label}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-spacer" />
        <div className="nav-user">
          <div className="nav-avatar" id="nav-avatar">
            {user?.username ? user?.username[0].toUpperCase() : '?'}
          </div>
          <span
            style={{ marginRight: '10px' }}
            className="nav-username mr-10" id="nav-username"
          >
            {user?.username}
          </span>
          <button
            onClick={logout}
            className="hidden btn-logout"
            type="button"
          >
            Salir
          </button>

          <Link
            to={routes.home}
            style={{ color: 'var(--muted)' }}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#adaaaa] hover:text-white hover:bg-black/60 transition-all cursor-pointer"
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