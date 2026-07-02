import { useEffect, useRef, useState } from "react";
import { SettingsIcon } from "lucide-react";
import "../../assets/css/settings_menu.css";
import { getIsUploadToSpotify } from "../../helpers/getIsUpload";
import { envs } from "../../../shared/utils/envs";

const STORAGE_KEY = envs.YTDROP_STORAGE_KEY;

const SettingsMenu = () => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    ulRef.current && setSize({
      h: ulRef.current.offsetHeight,
      w: ulRef.current.offsetWidth
    });
  }, []);

  useEffect(() => {
    const isUpload = getIsUploadToSpotify();
    setIsUpload(isUpload);
  }, []);

  return (
    <div className="settings-menu-wrap">
      <button
        onClick={() => setIsActive(!isActive)}
        className="btn-settings"
        type="button"
      >
        <SettingsIcon />
      </button>

      <div
        style={{
          width: isActive ? size.w + 4 : 0,
          height: isActive ? size.h + 10 : 0,
          opacity: isActive ? 1 : 0
        }}
        className="settings-menu"
      >
        <div className="settings-menu-content">
          <div className="settings-ul-wrap">
            <div className="triangle" />

            <ul
              className="settings-menu-ul"
              ref={ulRef}
            >
              <li className="settings-menu-option">
                <div>
                  <p className="opt-text">
                    Subir a Spotify clone
                  </p>

                  <label className="switch">
                    <input
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setIsUpload(isChecked);
                        localStorage.setItem(STORAGE_KEY, `${isChecked}`);
                      }}
                      checked={isUpload}
                      type="checkbox" id="toggleSwitch"
                    />
                    <span className="slider" />
                  </label>
                </div>
                <p className="description">
                  <span>Nota:</span> Al activarse sube las descargas automáticamente al finalizar.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsMenu;