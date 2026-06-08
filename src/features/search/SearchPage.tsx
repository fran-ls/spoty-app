import React, { useState } from 'react';
import { Play, Heart, Clock, Plus, Check } from 'lucide-react';
import { mockGenres, mockPlaylists, mockTracks } from '../../shared/data/music.data';

const SearchPage: React.FC = () => {
  const searchQuery = '';
  const [activeTrackAddMenuId, setActiveTrackAddMenuId] = useState<string | null>(null);

  // Live query evaluation across our available mock tracks database
  const allPlaylists = mockPlaylists;
  const filteredTracks = mockTracks;

  return (
    <div
      className="px-[27px] pt-6 pb-10 min-h-full bg-surface text-white select-none scroll-smooth animate-fade-in"
      id="spotify-search-stage"
    >
      {searchQuery ? (
        <section className="animate-fade-in" id="search-results-section">
          <h1 className="text-xl text-[#adaaaa] font-medium mb-6">
            Search results for "<span className="text-white font-bold">{searchQuery}</span>"
          </h1>

          {filteredTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-lg text-[#adaaaa] font-semibold">No results found</p>
              <p className="text-xs text-[#adaaaa]/50 mt-1 max-w-sm text-center">
                Check spelling or try a different song or artist.
              </p>
              <button
                className="mt-6 px-4 py-2 bg-white text-black text-xs font-bold rounded-full select-none cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Table Headers */}
              <div className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_80px_80px] gap-4 px-4 py-3 border-b border-white/10 text-[#adaaaa] text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>#</span>
                <span>Title</span>
                <span>Album</span>
                <span className="text-center">Add / Like</span>
                <span className="flex justify-end"><Clock size={15} /></span>
              </div>

              {/* Tracks List */}
              <div className="flex flex-col gap-1">
                {filteredTracks.map((track, i) => {
                  const isCurrent = '' === track.id;
                  const isTrackLiked = true

                  return (
                    <div
                      key={track.id}
                      className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_80px_80px] gap-4 px-4 py-3 items-center rounded-lg hover:bg-white/5 transition-colors group cursor-pointer relative"
                    >
                      <div className="text-[#adaaaa] text-sm font-medium flex items-center">
                        <span className="group-hover:hidden">{i + 1}</span>
                        <Play size={13} fill="currentColor" className="hidden group-hover:block text-white" />
                      </div>

                      <div className="flex items-center gap-4 overflow-hidden">
                        <img
                          alt={track.title}
                          className="w-10 h-10 rounded-sm object-cover bg-[#262626]"
                          src={track.coverUrl}
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className={`font-semibold truncate text-sm ${isCurrent ? 'text-primary' : 'text-white'}`}>
                            {track.title}
                          </span>
                          <span className="text-[#adaaaa] text-xs truncate hover:underline mt-0.5">
                            {track.artist}
                          </span>
                        </div>
                      </div>

                      <div className="text-[#adaaaa] text-sm truncate group-hover:text-white transition-colors">
                        {track.album}
                      </div>

                      <div className="flex items-center justify-center gap-3 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="text-[#adaaaa] hover:text-white cursor-pointer transition-transform hover:scale-110 active:scale-95"
                          title="Like track"
                        >
                          <Heart size={15} fill={isTrackLiked ? '#72fe8f' : 'transparent'} className={isTrackLiked ? 'text-primary' : ''} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTrackAddMenuId(activeTrackAddMenuId === track.id ? null : track.id);
                          }}
                          className={`cursor-pointer transition-transform hover:scale-110 active:scale-95 ${activeTrackAddMenuId === track.id ? 'text-primary' : 'text-[#adaaaa] hover:text-white'
                            }`}
                          title="Add song to custom playlist"
                        >
                          <Plus size={16} />
                        </button>

                        {/* Floating list adder dropdown container */}
                        {activeTrackAddMenuId === track.id && (
                          <div
                            className="absolute right-0 top-6 bg-[#181818] border border-white/10 rounded-lg p-2.5 shadow-2xl z-50 min-w-50 text-left animate-scale-up"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-[9px] uppercase font-black tracking-widest text-[#adaaaa] px-2 pb-2 border-b border-white/5 mb-1.5">
                              Add Track to:
                            </p>

                            {allPlaylists.filter(p => p.creator === 'You').length === 0 ? (
                              <div className="px-2 py-1 flex flex-col gap-1">
                                <p className="text-[10px] text-[#adaaaa] italic leading-tight">No custom playlists found.</p>
                                <button
                                  onClick={() => {
                                    setActiveTrackAddMenuId(null);
                                  }}
                                  className="text-[10px] text-primary hover:underline font-bold text-left"
                                >
                                  + Create list Workshop
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                                {allPlaylists.filter(p => p.creator === 'You').map(playlist => {
                                  const isAdded = playlist.tracks?.some(t => t.id === track.id);
                                  return (
                                    <button
                                      key={playlist.id}
                                      className="w-full text-left text-xs font-bold px-2 py-1.5 rounded hover:bg-primary hover:text-black transition-all flex items-center justify-between gap-2 cursor-pointer text-white"
                                    >
                                      <span className="truncate">{playlist.name}</span>
                                      {isAdded ? (
                                        <Check size={12} className="text-primary shrink-0" />
                                      ) : (
                                        <Plus size={10} className="text-white/40 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-[#adaaaa] text-sm flex justify-end">
                        {track.duration}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Bento Grid Header */}
          <div className="flex justify-between items-end mb-10">
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-white select-none">
              Browse all
            </h1>
          </div>

          {/* Grid list */}
          <div className="grid grid-cols-[repeat(4,270px)] gap-4.5">
          {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6"> */}
            {mockGenres.map((genre) => (
              <div
                key={genre.id}
                style={{ backgroundColor: genre.bgColor }}
                className="group relative h-[12vw] max-h-37.5 min-h-31 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] shadow-lg flex flex-col justify-between p-4 selection:bg-none"
              >
                <div className="text-2xl font-headline font-extrabold text-white tracking-tight leading-snug wrap-break-word">
                  {genre.name}
                </div>
                {/* Rotated, cropped cover art overlapping card boundaries as in image */}
                <img
                  alt={genre.name}
                  className="absolute -right-4 -bottom-4 w-24 h-24 rotate-25 shadow-2xl transition-transform duration-500 group-hover:scale-108 group-hover:rotate-20"
                  src={genre.coverUrl}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>

          {/* Trending Today bento modules */}
          <section className="mt-20">
            <h2 className="text-2xl font-headline font-extrabold mb-8 tracking-tight">
              Trending Today
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* New Release item */}
              <div
                className="flex items-center gap-6 p-6 rounded-2xl bg-[#131313] hover:bg-[#262626] border border-white/5 transition-all duration-300 group cursor-pointer active:scale-98 shadow-xl"
              >
                <div className="relative w-32 h-32 shrink-0 bg-[#2d2d2d] rounded-xl overflow-hidden shadow-2xl">
                  {/* High fashion portrait representing release */}
                  <img
                    alt="Midnight Echoes"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkYVWtFrVqaw6z1Ebe5V20amVQDJTgszQ2yYQ7v6BldmKZ4rR6AHYIuCv2HKdkcZn6YkoBzW_ylzQzeYOGgxwg3bT3xNAoPn278TDgrExSmbo7c7blPb8rf8JS8nKWuneP91eO8wzicBNXSn53_fy7myMxVQNvgH9ff18_JAo97SzRreuXkm58ZjYX0eLhEm2eCOeN6Cfex51OffdApM4Rll0hGCJv2gKKhR4gnIY8_fhnWzSyLKgw5hjrmIFNh42F9bLIYpaF2p8N"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 shadow-xl transition-all cursor-pointer">
                      <Play size={16} fill="currentColor" stroke="none" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest mb-1 shadow-sm block">
                    New Release
                  </span>
                  <h3 className="text-xl font-bold mb-2 text-white truncate group-hover:text-primary transition-colors">
                    Midnight Echoes
                  </h3>
                  <p className="text-[#adaaaa] text-xs line-clamp-2 leading-relaxed">
                    The highly anticipated debut album from the masters of modern synthwave.
                  </p>
                </div>
              </div>

              {/* Editor's pick item */}
              <div
                className="flex items-center gap-6 p-6 rounded-2xl bg-[#131313] hover:bg-[#262626] border border-white/5 transition-all duration-300 group cursor-pointer active:scale-98 shadow-xl"
              >
                <div className="relative w-32 h-32 shrink-0 bg-[#2d2d2d] rounded-xl overflow-hidden shadow-2xl">
                  {/* High energy glow lines representing curated tracks */}
                  <img
                    alt="Today's Top Hits"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3PUB_ybXJo991ZJd-8oMV24ArEbksJRSwc6y7lcRs-fsrBBdV0zxbblD2wLUIfOyEGVjtt7ZGfJlrbZv6r5OS9w1k1IFRxgqVqxOqLqVFixGfyH4qYn3IqpYQB7v5-On8xB1AF43t0QvVHocdpvXBFYngpNzbZD2GL3zF63VDO9WwLF297ywP_tEeByyOyXo0vQX3YLsg8h7Ft5Vry6Nq7cef5Fk6oD9I3W47er0b7kkwmiz4WLuYLnpnwVnph_as31ZFspkjeGhA"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 shadow-xl transition-all cursor-pointer">
                      <Play size={16} fill="currentColor" stroke="none" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest mb-1 shadow-sm block">
                    Editor's Pick
                  </span>
                  <h3 className="text-xl font-bold mb-2 text-white truncate group-hover:text-primary transition-colors">
                    Today's Top Hits
                  </h3>
                  <p className="text-[#adaaaa] text-xs line-clamp-2 leading-relaxed">
                    Join millions of listeners exploring the biggest tracks across the globe right now.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default SearchPage;