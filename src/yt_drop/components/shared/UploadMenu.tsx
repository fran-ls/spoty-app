import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChartNoAxesColumnIcon, HistoryIcon, HeadphonesIcon, SettingsIcon } from "lucide-react";
import { getIsUploadToSpotify, setIsUploadToSpotify } from "../../helpers/getIsUpload";
import { useAppCtx } from "../../../shared/context/AppContext";
import { config } from "../../../shared/data/config.data";
import { routes } from "../../../shared/utils/routes";
import useAuth from "../../../features/auth/hooks/useAuth";

const UploadMenu = () => {
  const { user } = useAuth();
  const { isSettingsMenu, setIsSettingsMenu, setIsSettingsModal } = useAppCtx();
  const [isUpload, setIsUpload] = useState(false);

  const onConfigPanel = () => {
    setIsSettingsMenu(false);
    setIsSettingsModal(true);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}`;
  }

  useEffect(() => {
    const upload = getIsUploadToSpotify();
    setIsUpload(upload);
  }, []);

  return (
    <div className="nav-right">
      <div className="settings-wrap flex items-center" id="settings-wrap">
        <button
          onClick={() => setIsSettingsMenu(!isSettingsMenu)}
          className="btn-settings"
          type="button"
        >
          <SettingsIcon />
        </button>

        <div
          className={`${isSettingsMenu ? 'open' : ''} settings-dropdown`}
          id="settings-dropdown"
        >
          <div className="nav-u-dropwdown">
            <div className="nav-avatar" id="nav-avatar">
              {user?.username ? user?.username[0].toUpperCase() : '?'}
            </div>
            <div className="nav-u">
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
          </div>

          <Link
            to={routes.home}
            onClick={() => setIsSettingsMenu(false)}
            className="sd-item-label sd-item sd-item-menu nav-i-h"
          >
            <div className="flex items-center gap-2.5">
              <HeadphonesIcon />
              <span style={{
                display: 'block',
                marginTop: '4px'
              }}>
                {config.APP_NAME}
              </span>
            </div>
          </Link>

          <Link
            to={routes.YTDrop.history}
            onClick={() => setIsSettingsMenu(false)}
            className="sd-item-label sd-item sd-item-menu"
          >
            <div className="flex items-center gap-2.5">
              <HistoryIcon />
              <span style={{
                display: 'block',
                marginTop: '4px'
              }}>
                Historial
              </span>
            </div>
          </Link>

          <Link
            to={routes.YTDrop.historyStats}
            onClick={() => setIsSettingsMenu(false)}
            className="sd-item-label sd-item sd-item-menu"
          >
            <div className="flex items-center gap-2.5">
              <ChartNoAxesColumnIcon />
              <span style={{
                display: 'block',
                marginTop: '4px'
              }}>
                Análisis
              </span>
            </div>
          </Link>

          <div className="sd-header">
            <span className="sd-title">Configuración</span>
          </div>

          <div className="sd-item">
            <div className="sd-item-left">
              <div className="sd-item-icon groovix">
                <svg viewBox="0 0 24 24">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div>
                <div className="sd-item-label">
                  Subir a {config.APP_NAME}
                </div>
                <div className="sd-item-sub">
                  Auto-subir tras descarga
                </div>
              </div>
            </div>

            <label className="switch">
              <input
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setIsUpload(isChecked);
                  setIsUploadToSpotify(`${isChecked}`);
                }}
                id="toggleSwitch"
                checked={isUpload}
                type="checkbox"
              />
              <span className="slider" />
            </label>
          </div>

          <div
            className="sd-item"
            onClick={onConfigPanel}
          >
            <div className="sd-item-left">
              <div className="sd-item-icon config">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"
                  />
                </svg>
              </div>
              <div>
                <div className="sd-item-label">Configurar subida</div>
                <div className="sd-item-sub">Artista y playlist</div>
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              style={{
                width: '14px',
                height: '14px',
                fill: 'none',
                stroke: ' var(--muted)',
                strokeWidth: 2,
                strokeLinecap: 'round',
                flexShrink: 0
              }}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadMenu;