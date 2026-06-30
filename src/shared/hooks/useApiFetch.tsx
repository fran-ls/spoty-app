import { useState } from "react";
import { InfoIcon } from "lucide-react";
import type { ToasterConfig } from "../components/Toaster";

const useApiFetch = (showToast: (config: ToasterConfig) => void) => {
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  async function save<T>(cb: () => any, toast?: Partial<ToasterConfig> & { error?: string }): Promise<T | null> {
    if (isSaveLoading) return null;
    setIsSaveLoading(true);

    const { data, error, errorMessage } = await cb();
    setIsSaveLoading(false);

    const err = error?.response?.data?.message;

    if (err || error || !data) {
      showToast({
        type: 'error',
        icon: (
          <InfoIcon
            className="min-w-5 stroke-2"
            size={20}
          />
        ),
        ...toast,
        message: toast?.error || err || errorMessage || 'Ocurrió un error'
      });

      return data;
    }

    showToast({
      type: 'success',
      icon: toast?.icon ? toast.icon : (
        <InfoIcon
          className="min-w-5 stroke-2"
          size={20}
        />
      ),
      ...toast,
      message: toast?.message || 'Guardado'
    });

    return data;
  }

  return {
    isSaveLoading, setIsSaveLoading,
    save
  }
}

export default useApiFetch;