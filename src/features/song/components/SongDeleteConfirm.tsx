import { useState } from "react";

interface SongDeleteConfirmProps {
  songName: string;
  isOpen: boolean;
  onConfirm: (isRemoveFiles: boolean) => void;
  onClose: () => void;
}

const SongDeleteConfirm = ({ songName, onConfirm, onClose }: SongDeleteConfirmProps) => {
  const [isRemoveFiles, setIsRemoveFiles] = useState(true);

  return (
    <>
      <div className="bg-black/50 min-h-screen w-full fixed top-0 left-0 z-999" />

      <div className="text-white min-h-screen w-full flex flex-col items-center justify-center fixed top-0 left-0 z-999">
        <div className="bg-[#262626] max-w-md rounded-lg m-6 p-8">
          <h2 className="min-w-sm text-[18px] font-semibold">
            ¿Eliminar canción?
          </h2>
          <p className="mt-2 text-sm">
            Se eliminará <strong>{songName}</strong> de <strong>Tu biblioteca.</strong>
          </p>

          <div className="w-full flex items-center justify-between gap-2 mt-5 mb-8">
            <span>Borrar archivos</span>
            <label
              className="switch"
              title={`${!isRemoveFiles ? 'Activar' : 'Desactivar'} Borrar archivos`}
            >
              <input
                onChange={() => setIsRemoveFiles(!isRemoveFiles)}
                checked={isRemoveFiles}
                type="checkbox"
                id="toggleSwitch"
              />
              <span className="slider bg-primary" />
            </label>
          </div>

          <div className="text-sm flex items-center justify-between">
            <button
              onClick={onClose}
              className="cursor-pointer py-2 px-6 hover:bg-[#3e3e3e] border-[#3e3e3e] border rounded-full transition-all duration-100"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(isRemoveFiles)}
              className="hover:bg-red-700 cursor-pointer py-2 px-6 bg-red-500 rounded-full transition-all duration-100"
              type="button"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SongDeleteConfirm;