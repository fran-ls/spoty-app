import { CameraPlusIcon } from "../../../shared/components/Icons";

const ArtistForm = () => {
  return (
    <div className="max-w-4xl space-y-8 text-white mx-auto">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="shrink-0">
          <div className="border-[#1a1a1a] relative w-48 h-48 rounded-full overflow-hidden bg-surface-container-highest border-2 border-dashed border-outline-variant/30 flex items-center justify-center cursor-pointer group hover:border-primary/50 transition-all">
            <div
              className="absolute w-48 h-48 rounded-full bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700"
              data-alt="A professional close-up portrait of a music artist in a dark studio setting with moody green rim lighting, shot in a high-fashion editorial style. The artist has a mysterious and creative expression, fitting the Spotify premium aesthetic."
              style={{
                backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAcFCQ4q4N_ffTa1PghdsJBCyr6Et3o2zcg1eeQK4Bw3UM4WZsmVUhQIFwmR6XZVNtBshWdpJBcl_Uv9VfuyybVD85KEIgIbJQq7WXp_M4OkdfRJFbKVLgDDbTkxzSX0egf1xzDfaZ_XGvhfFNp4AIU4m04yv_VyzYxai63-y2m0zJnShQo19hgSrOgT9snRZKBloQGwcRKyIx0AQuC9BJ-Gg2PVIYet7C_1MKkyoAqGFYNAWSQGeOfu_R98aDB0bq5pcJJJxx23MNF)"
              }}
            />
            <CameraPlusIcon
              className="mb-2 material-symbols-outlined text-4xl text-on-surface-variant relative z-10 group-hover:text-primary transition-colors"
              size={40}
            />
          </div>
          <label className="mt-4 text-center block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
            Foto de Perfil
          </label>
        </div>
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-on-surface">
              Nombre del Artista
            </label>
            <input
              className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 font-body transition-all"
              placeholder="Tu nombre artístico"
              type="text"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-bold text-on-surface">
              Biografía
            </label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 font-body transition-all resize-none"
              placeholder="Cuéntale tu historia al mundo..."
              rows={6}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="text-sm flex justify-end gap-4 pt-3">
        <button
          className="text-black px-10 py-3 rounded-full bg-primary text-on-primary-container font-black shadow-xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all"
        >
          Guardar Perfil
        </button>
      </div>
    </div>
  )
}

export default ArtistForm;