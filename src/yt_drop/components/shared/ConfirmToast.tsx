export interface ConfirmToastPayload {
  title: string;
  message: string;
  icon?: React.ReactElement;
  type: string;
  confirmMsg?: boolean;
}

interface ConfirmToastProps extends ConfirmToastPayload {
  isActive: boolean;
  isFirstLoad: boolean;
  className?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmToast = (props: ConfirmToastProps) => {
  const isHide = !props.isActive && !props.isFirstLoad;

  return (
    <div
      className={`${props.isActive ? 'show' : ''} ${isHide ? 'hide' : ''} toast-confirm`}
      id="toast-confirm"
    >
      <div
        className={`${props.type} accent-bar`}
        id="accent-bar"
      />

      <div className="toast-inner" id="toast-content">
        <div className={`${props.type} t-icon`} id="t-icon">
          {props.icon}
        </div>

        <div className="t-body">
          <p className="t-title" id="t-title">
            {props.title}
          </p>
          <p className="t-msg" id="t-msg">
            {props.message}
          </p>
          <div className="t-actions">
            <button
              onClick={props.onConfirm}
              className={`${props.type} btn-confirm`}
              id="btn-confirm"
            >
              Confirmar
            </button>
            <button
              onClick={props.onClose}
              className="btn-cancel" id="btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </div>

        <button
          onClick={props.onClose}
          className="t-close" aria-label="Cerrar"
        >
          <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="2" x2="11" y2="11" />
            <line x1="11" y1="2" x2="2" y2="11" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ConfirmToast;