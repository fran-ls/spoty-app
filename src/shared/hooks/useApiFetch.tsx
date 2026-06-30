import { InfoIcon } from "lucide-react";
import type { ToasterConfig } from "../components/Toaster";

const useApiFetch = (showToast: (config: ToasterConfig) => void) => {
  async function save<T>(cb: () => any, toast?: Partial<ToasterConfig> & { error?: string }): Promise<T> {
    const { data, error, errorMessage } = await cb();
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
    save
  }
}

export default useApiFetch;