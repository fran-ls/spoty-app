interface DeleteConfirmProps {
  playlistName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirm = ({ playlistName, onConfirm, onClose }: DeleteConfirmProps) => {
  return (
    <>
      <div className="bg-black/50 min-h-screen w-full fixed top-0 left-0 z-999" />

      <div className="min-h-screen w-full flex flex-col items-center justify-center fixed top-0 left-0 z-999">
        <div className="bg-[#262626] rounded-lg m-6 p-8">
          <h2 className="min-w-sm text-[18px] font-semibold">
            ¿Eliminar de Tu biblioteca?
          </h2>
          <p className="mt-2 mb-8 text-sm">
            Se eliminará <strong>{playlistName}</strong> de <strong>Tu biblioteca.</strong>
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="cursor-pointer py-2 px-6 hover:bg-[#3e3e3e] border-[#3e3e3e] border rounded-full transition-all duration-100"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
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

export default DeleteConfirm;