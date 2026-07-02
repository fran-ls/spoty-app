export interface ToastPayload {
  title: string;
  message: string;
  type: string;
  icon?: React.ReactElement;
}

interface ToastProps extends ToastPayload {
  isActive: boolean;
  isFirstLoad: boolean;
  onClose: () => void;
}

const Toast = (props: ToastProps) => {
  const isHide = !props.isActive && !props.isFirstLoad;

  return (
    <div
      className={`${props.isActive ? 'show' : ''} ${isHide ? 'hide' : ''} toast-container`}
      id="toast"
    >
      <div className="toast-body">
        <div className={`${props.type} toast-icon`} id="toast-icon">
          {props.icon}
        </div>

        <div className="toast-text">
          <p className="toast-title" id="toast-title">
            {props.title}
          </p>
          <p className="toast-msg" id="toast-msg">
            {props.message}
          </p>
        </div>

        <button
          onClick={props.onClose}
          className="toast-close"
          aria-label="Cerrar"
          id="toast-close"
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>
      </div>

      <div className={`${props.type} toast-progress`}>
        <div
          className={`${props.type} toast-progress-bar`}
          id="progress-bar"
        />
      </div>
    </div>
  )
}

export default Toast;