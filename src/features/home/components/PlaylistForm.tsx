const PlaylistForm = () => {
  return (
    <div className="text-white max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <div
          className="aspect-square rounded-2xl overflow-hidden bg-surface-container-highest shadow-2xl relative group cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
            data-alt="A collage-style playlist cover featuring dark urban elements, neon lights, and blurry cinematic movement. The color palette is dominated by deep blacks, charcoal greys, and vibrant green accents, echoing a curated underground music vibe."
            style={{
              backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCs5MK3GNk50nrNmp8wKYoF3EDZNXEIogQ32g1alD4Fjte9V3eYQ-avf_YUlE3Ca5DIFsdKjTzM6og4qhE3NGdk4HCMIAuoukHQQHqJWaovrIv9UvzjO7rMJwBBEZfB91tlcbalIHPlIetECcV2I7TDpbbBcy9pfW2O_9Ydnukym7EQuEVQ8qWH2HjtLsngwLxVmXP2elSmLlpkEZHuRMbtEAbyC8WHWPq2oR8s4AoxcZ31J6gHRI8L-mx2xeVwzUaKHDvfd-aIV35A)"
            }}
          />
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-4xl text-white">
              upload_file
            </span>
          </div>
        </div>
        <label className="mt-4 mb-0 text-center block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Portada
        </label>
      </div>
      <div className="md:col-span-8 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-on-surface">
            Nombre de la Playlist
          </label>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg p-5 text-on-surface text-xl font-bold placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all"
            placeholder="Mi Playlist Increíble"
            type="text"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-bold text-on-surface">
            Descripción
          </label>
          <textarea
            className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 font-body transition-all resize-none"
            placeholder="Añade una descripción opcional"
            rows={4}
          ></textarea>
        </div>
        <div
          className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl"
        >
          <div>
            <div className="font-bold text-on-surface">Playlist Pública</div>
            <div className="text-xs text-on-surface-variant">
              Cualquiera puede ver y seguir esta playlist
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div
              className="w-14 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"
            />
          </label>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            className="text-black px-10 py-3 rounded-full bg-primary text-on-primary-container font-black shadow-xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all"
          >
            Crear Playlist
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaylistForm;