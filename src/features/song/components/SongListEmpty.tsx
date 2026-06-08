import { STYLES } from "../../../shared/utils/styles";

const SongListEmpty: React.FC = () => {
  return (
    <div
      style={{
        height: `calc(100vh - ${STYLES.heightHeader}px - ${STYLES.heightFooter}px - 112px)`
      }}
    >
      <div className="max-w-2xl m-auto flex flex-col items-center justify-center p-20 rounded-xl select-none animate-fade-in text-center">
        <p className="text-[#adaaaa] font-bold text-sm">
          Aún no hay pistas dentro de este diseño personalizado
        </p>
        <p className="text-xs text-[#adaaaa]/60 mt-1 max-w-md">
          {/* Navigate to the <strong>Search Tab</strong> or home collections, click the context menus or like any specific track to list them here in real-time! */}
          Navegue a la pestaña <strong>Buscar</strong> o a las colecciones de inicio, haga clic en los menús contextuales o marque como favorito cualquier pista específica para listarlas aquí en tiempo real
        </p>
        <button
          className="mt-6 px-5 py-2 bg-white text-black text-xs font-black rounded-full cursor-pointer hover:scale-105 transition-all"
        >
          Explora y añade pistas
        </button>
      </div>
    </div>
  )
}

export default SongListEmpty;