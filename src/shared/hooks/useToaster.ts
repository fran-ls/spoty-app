import { useState } from "react";
import type { ToasterConfig } from "../components/Toaster";

const useToaster = (duration = 3000) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [toast, setToast] = useState<ToasterConfig>({
    title: 'Guardado',
    message: 'Los cambios han sido guardados.',
    type: 'success'
  });

  function showToast(config: ToasterConfig) {
    if (isActive) return;
    setToast({ ...toast, ...config });
    setIsFirstLoad(false);
    setIsActive(true);

    setTimeout(() => { setIsActive(false) }, duration);
  }

  const onClose = () => setIsActive(false);

  return {
    isFirstLoad, setIsFirstLoad,
    isActive, setIsActive,
    toast, setToast,
    showToast,
    onClose
  }
}

export default useToaster;