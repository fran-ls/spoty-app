interface ToastSimpleProps {
  message: string;
  type: string;
  isActive: boolean;
}

const SimpleToast = ({ message, type, isActive }: ToastSimpleProps) => {
  return (
    <div
      className={`${isActive ? 'show' : ''} ${type}`}
      id="toast-simple"
    >
      {message}
    </div>
  )
}

export default SimpleToast;