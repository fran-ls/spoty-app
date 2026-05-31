import React from 'react';
import { Play } from 'lucide-react';
import { usePlayer } from '../../shared/context/PlayerContext';
import { mockPlaylists, mockMadeForYou, mockRecentlyPlayed } from '../../shared/data/music.data';

const HomePage: React.FC = () => {
  const { openPlaylist, playTrack } = usePlayer();

  const handleQuickPlay = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    const pl = mockPlaylists.find(p => p.id === playlistId) || mockMadeForYou.find(p => p.id === playlistId);
    if (pl && pl.tracks.length > 0) {
      playTrack(pl.tracks[0], pl.tracks);
    } else {
      openPlaylist(playlistId);
    }
  }

  // Grid collection matching exact prompt mockup
  const quickAccessGrid = [
    { id: 'techno_bunker', name: 'Techno Bunker', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf1NaZTBitthIYfInIVbfS2EMzCcOVEfx8RZtsIcS4Ein_62b1kNGDwWQpfUKEYDAalo32tp2eSQHw3PaqfrNXd84sEQhjL-TRBN3IN9FVO6dcczBJaa1UiCeH5VWDxRJXUlKhBifdlg9iPXlF1YX4G3BZFYfR1ZZDtfFdV7uPB8H5IAoABjFz7FnuV9rKn46qKW224Hzv4w6nvZLMU09Xqc_dv2k21qnExKXizI4o3QeIglQ3tlB9W_uElVN_JAhC6A4KSCFIAxhJ' },
    { id: 'electronic_focus', name: 'Electronic Focus', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJTLGfWQfO8AEdntUIEA2I1sNV8qgzM_8jSFt81xsnKsxfmn6O__UZV6jvLC_aKkfBB4QmAfqAi8iSBdUDyOY6oO9chio6J4Hz_PWt2d_UZdUDZMu2cKIz0T5QlHVPLf73FphX9z9JF_JfucZ3HVTnTRN2n2KjyqcW_MkccT_2FEIGQiPE44ZMxlzuOtzJMkNx1eRwOXTlvHtlBpyNlvqkLnCRARztZntBfvm9E2EeuJwCcxI4JSTAii_D09lplGr1XzliVaBqjpK8' },
    { id: 'late_night_jazz', name: 'Late Night Jazz', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaxm-x5ZwdSIp1o1iTt2RgQJo8-cN-FRYs8ANlBTpPp2z8m437BmqyrBpMgz40_UB_YJDEyVvKpH9_Kp56CUvhSb0ghUhwj_j6VjX3HwW9Xs5CgGSZdca1VoeLbq_Wy7rjFUvgg0kghxqWE-UHRGGMgv3-uEhj-7XMAEHO7G5crSxhg3shqNHSQcBchHpJzKmye8KvdQSi_hzh3DQxQPXgDTDQntM9_9htmG6FpheYxITRl2jEP2xIzYqNFtvCaVv_gyf_TdcrYAY0' },
    { id: 'live_classics', name: 'Live Classics', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Hr-SlYkAMb02-s5Po7vNxWxt45o9l4c8OQDf4TXw7tGASfgd900L6dvLeGYQrftnE3xBOnVdYHe8ylJjU5eNM3_23ZB47U2yVPdHs6bVp-d5ErjZtBpEMSBsp1i7NYFiZZzwli2ceNP3pP_AjSeHnnyzvZ-_Iv5AE-t4Q2U65GDPJFew68AmLL_gjnzBwfHwRzyMnKVz2PkeXzu7m1pyvxaAaF1-_RX6MxrS0tkfujt6a0jJJbJ2BxEHyvJMp4LH86ODwgpSAZPy' },
    { id: 'discover_weekly', name: 'Discover Weekly', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNxYUiH_xh1-AtH2KnNXdaeRkrI1cDW_a3vWxxMX58tNb-k5WWt_ey_j5xtU2glHodotxWSLPCiQvZxJvx3ccK243dptlJ5AdHpB3VTEAeH_HVxXO3v1UyU6wO9Gy_V8Jw5ekl1jWfYZbRy9-shE8p_ZEghMvZ9XR0HimSRsiZl0B31K-mhA8YqYm9HwO5qsst0_0pVgfs5oJfQM4eRpN5fERko43Z2DKkRTzTVkyA5ucsD4Hkr-cbMrYKAMj5rPBg-aSvdJ6kdWb' },
    { id: 'daily_mix_1', name: 'Daily Mix 1', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp48qE2s5HJlg_nyZlhNkOgQK5MoBjzuPPCnhQNA32-hGG4mZUXlUBSN2NB-EvLn88byNCeNwi_clA0UdGUsr_EX_ZOrK4GbynnHZxzBqzlhPTgsJWiXcgnEFeh9rBlRTT8KocubWLpivBt4DsZK5pmOpCSfkpviSo4H02820Ew2rN9cCJPLZ27Bhy61iuBKLFTPaIw8ZqRirQYi1GF8He3DblQOUve_lhqPOh7kLM6m9uXz382aOpUJQrwCFn88_ZKDmOgpi0-M8D' }
  ];

  return (
    <div
      className="px-8 pt-6 pb-32 min-h-full bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#0e0e0e] text-white select-none scroll-smooth animate-fade-in"
      id="spotify-home-stage"
    >
      {/* 1. Good Evening Section */}
      <section className="mb-12" id="home-greeting-section">
        <h1 className="text-3xl font-bold font-headline mb-6 tracking-tight text-white select-none">
          Good evening
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {quickAccessGrid.map((item) => (
            <div
              key={item.id}
              onClick={() => openPlaylist(item.id)}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative pr-16 active:scale-98"
            >
              <div className="w-20 h-20 bg-[#262626] shrink-0 relative overflow-hidden">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover select-none"
                  src={item.coverUrl}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-5 flex-1 font-headline font-extrabold text-[#ffffff] text-sm truncate">
                {item.name}
              </div>
              <button
                onClick={(e) => handleQuickPlay(e, item.id)}
                className="absolute right-4 bg-primary text-black p-3 rounded-full shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-90"
              >
                <Play size={18} fill="currentColor" stroke="none" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Made For You Section */}
      <section className="mb-12" id="home-recommendations-section">
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
              key={playlist.id}
              onClick={() => openPlaylist(playlist.id)}
              className="group bg-[#1a1a1a] p-4 rounded-xl hover:bg-[#262626] transition-all duration-300 cursor-pointer flex flex-col h-full active:scale-98"
            >
              <div className="relative mb-4 aspect-square rounded-md overflow-hidden bg-[#262626]">
                <img
                  alt={playlist.name}
                  className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  src={playlist.coverUrl}
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={(e) => handleQuickPlay(e, playlist.id)}
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
      <section className="mb-12" id="home-recent-section">
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
                  openPlaylist('rock_classics');
                } else {
                  openPlaylist('rock_classics');
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