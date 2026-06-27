import { InfoIcon, XIcon } from "lucide-react";

export interface ToasterConfig {
  title?: string;
  message: string;
  type?: string;
  icon?: React.ReactElement;
}

interface ToasterProps extends ToasterConfig {
  isActive: boolean;
  isFirstLoad: boolean;
  onClose: () => void;
}

const Toaster = (props: ToasterProps) => {
  const { type = 'success', message, isActive, isFirstLoad, icon, onClose } = props;
  const isHide = !isActive && !isFirstLoad;

  return (
    <div
      className={`${isActive ? 'show-slide-down' : isHide ? 'hide-slide-up' : ''} ${type === 'error' ? 'bg-red-400' : 'bg-primary text-black'} rounded-md relative slide`}
      id="toast"
    >
      <div className="px-4 py-3 flex items-center gap-3">
        {icon ? icon : <InfoIcon size={20} />}

        <div className="text-sm">
          <p className="" id="toast-msg">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className={`${type === 'error' ? 'bg-red-400' : 'bg-primary'} absolute -top-2 -right-2 w-5 h-5 p-0.5 rounded-full border border-[#565656] cursor-pointer`}
          aria-label="Cerrar"
        >
          <XIcon className="w-full h-full" />
        </button>
      </div>
    </div>
  )
}

export default Toaster;