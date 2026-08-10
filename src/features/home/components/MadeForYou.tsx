import { PlayIcon } from "lucide-react";
import { mockMadeForYou } from "../../../shared/data/music.data";

const MadeForYou = () => {
  return (
    <section className="px-8 mb-12" id="home-recommendations-section">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold font-headline text-white hover:underline cursor-pointer tracking-tight">
          Made For You
        </h2>
        <span className="text-[#adaaaa] font-bold text-xs hover:underline cursor-pointer select-none">
          Show all
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mockMadeForYou.map((playlist) => (
          <div
            className="group bg-[#1a1a1a] p-4 rounded-xl hover:bg-[#262626] transition-all duration-300 cursor-pointer flex flex-col h-full active:scale-98"
            key={playlist.id}
          >
            <div className="relative mb-4 aspect-square rounded-md overflow-hidden bg-[#262626]">
              <img
                alt={playlist.name}
                className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                src={playlist.coverUrl}
                referrerPolicy="no-referrer"
              />
              <button
                className="absolute bottom-3 right-3 bg-primary text-black p-3 rounded-full shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <PlayIcon size={18} fill="currentColor" stroke="none" />
              </button>
            </div>
            <h3 className="font-bold text-white mb-1.5 truncate text-sm sm:text-base">
              {playlist.name}
            </h3>
            <p className="text-xs text-[#adaaaa] line-clamp-2 leading-relaxed">
              {playlist.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MadeForYou;