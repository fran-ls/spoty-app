import { Play } from 'lucide-react';
import { mockMadeForYou, mockRecentlyPlayed } from '../../../shared/data/music.data';
import '../../../assets/css/home.css';
import UserPlaylistsSlider from '../components/UserPlaylistsSlider';
import ArtistSlider from '../components/ArtistSlider';

const HomePage = () => {
  return (
    <div
      className="pt-6 pb-10 min-h-full bg-[#131313] text-white select-none scroll-smooth animate-fade-in"
      // className="pt-6 pb-10 min-h-full bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#131313] text-white select-none scroll-smooth animate-fade-in"
      id="spotify-home-stage"
    >
      <ArtistSlider />

      <UserPlaylistsSlider />

      {/* 2. Made For You Section */}
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
                  <Play size={18} fill="currentColor" stroke="none" />
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

      {/* 3. Recently Played Section */}
      <section className="px-8" id="home-recent-section">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold font-headline text-white hover:underline cursor-pointer tracking-tight">
            Recently played
          </h2>
          <span className="text-[#adaaaa] font-bold text-xs hover:underline cursor-pointer select-none">
            Show all
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {mockRecentlyPlayed.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                // If the item represents a mock playlist or album, open appropriate playlist state or play mock track
                if (item.id === 'moonlight_trails') {
                  // Play custom song or open standard playlist
                  // openPlaylist('rock_classics');
                } else {
                  // openPlaylist('rock_classics');
                }
              }}
              className="group cursor-pointer select-none active:scale-98 flex flex-col"
            >
              <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-[#2d2d2d] shadow-lg">
                <img
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={item.coverUrl}
                  referrerPolicy="no-referrer"
                />
                {/* Instant dynamic feedback loop on hover */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-primary hover:bg-primary-dim p-2.5 rounded-full text-black shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                    <Play size={14} fill="currentColor" stroke="none" />
                  </span>
                </div>
              </div>
              <h4 className="font-bold text-sm text-white truncate text-center sm:text-left">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#adaaaa] mt-1 text-center sm:text-left truncate">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage;