import { useState } from "react";
import type { ConfirmToastPayload } from "../components/shared/ConfirmToast";
import type { ToastPayload } from "../components/shared/Toast";

const useToast = () => {
  const [isSimpleToast, setIsSimpleToast] = useState(false);
  const [simpleToast, setSimpleToast] = useState({
    message: '',
    type: ''
  });

  const [isActiveConfirmToast, setIsActiveConfirmToast] = useState(false);
  const [confirmToast, setConfirmToast] = useState<ConfirmToastPayload>({
    title: 'Borrar historial',
    message: '¿Quieres limpiar todo el historial?',
    type: 'del',
  });

  const [isActiveToast, setIsActiveToast] = useState(false);
  const [toast, setToast] = useState<ToastPayload>({
    title: 'Operación exitosa',
    message: 'Los cambios han sido guardados.',
    type: 'success',
  });

  const [isFirstLoadConfirmToast, setIsFirstLoadConfirmToast] = useState(true);
  const [isFirstLoadToast, setIsFirstLoadToast] = useState(true);

  function showSimpleToast(message: string, type: string, reset = false) {
    setSimpleToast({ ...simpleToast, message, type });
    setIsSimpleToast(true);

    setTimeout(() => { setIsSimpleToast(false) }, 3500);

    if (reset) return;

    setTimeout(() => {
      setSimpleToast({
        ...simpleToast,
        message: '',
        type: ''
      })
    }, 4000);
  }

  function showToast(config: ToastPayload) {
    if (isActiveToast) return;

    setIsFirstLoadToast(false);
    setToast({ ...toast, ...config });
    setIsActiveToast(true);

    setTimeout(() => { setIsActiveToast(false) }, 3500);

    setTimeout(() => setToast({
      ...toast,
      title: '',
      message: '',
      type: '',
    }), 4000);
  }

  function showConfirmToast(config: ConfirmToastPayload) {
    if (isActiveConfirmToast) return;

    setIsFirstLoadConfirmToast(false);
    setConfirmToast({ ...confirmToast, ...config });
    setIsActiveConfirmToast(true);

    setTimeout(() => { setIsActiveConfirmToast(false) }, 3500);

    setTimeout(() => setConfirmToast({
      ...confirmToast,
      title: '',
      confirmMsg: false,
      message: '',
      type: '',
    }), 4000);
  }

  return {
    simpleToast, setSimpleToast,
    isSimpleToast, setIsSimpleToast,
    showSimpleToast,

    toast, setToast,
    isActiveToast, setIsActiveToast,
    isFirstLoadToast, setIsFirstLoadToast,
    showToast,

    confirmToast, setConfirmToast,
    isActiveConfirmToast, setIsActiveConfirmToast,
    isFirstLoadConfirmToast, setIsFirstLoadConfirmToast,
    showConfirmToast,
  }
}

export default useToast;