import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Clock, Plus, Check } from 'lucide-react';
import { mockGenres, mockPlaylists, mockTracks } from '../../../shared/data/music.data';
import type { Playlist } from '../playlist.types';
import playlistService from '../services/playlist.service';
import type { SearchMeta } from '../../../shared/types/common.types';
import SmartImage from '../../../shared/components/SmartImage';
import { routes } from '../../../shared/utils/routes';

const SearchPlaylists: React.FC = () => {
  const searchQuery = '';
  const [activeTrackAddMenuId, setActiveTrackAddMenuId] = useState<string | null>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [_playlistMeta, setPlaylistMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Live query evaluation across our available mock tracks database
  const allPlaylists = mockPlaylists;
  const filteredTracks = mockTracks;

  const getPlaylists = async () => {
    const { data } = await playlistService.searchPlaylists();

    if (data) {
      setPlaylistMeta(data.meta);
      setPlaylists(data.items);
    }
  }

  useEffect(() => { getPlaylists() }, []);

  return (
    <div
      className="px-6.75 pt-6 pb-10 min-h-full bg-surface text-white select-none scroll-smooth animate-fade-in"
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
                  const isTrackLiked = true;

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
              Explorar
            </h1>
          </div>

          <div className="grid grid-cols-[repeat(4,270px)] gap-4.5 mb-4.5">
            {playlists.map((p) => {
              const cover = playlistService.playlistCover(p.id);

              return (
                <Link
                  to={`${routes.playlists}/${p.id}`}
                  key={p.id}
                >
                  <div
                    key={p.id}
                    style={{ backgroundColor: p.bgColor }}
                    className="group relative h-[12vw] max-h-37.5 min-h-31 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] shadow-lg flex flex-col justify-between p-4 selection:bg-none"
                  >
                    <div className="text-2xl font-headline font-extrabold text-white tracking-tight leading-snug wrap-break-word">
                      {p.name}
                    </div>

                    <SmartImage
                      url={cover}
                      wrapStyles={{
                        background: `linear-gradient(to bottom, ${p.bgColor} 0%, ${p.bgColor} 100%)`
                      }}
                      wrapClassName="bg-[#262626] absolute -right-4 -bottom-4 w-24 h-24 rotate-25 shadow-2xl transition-transform duration-500 group-hover:scale-108 group-hover:rotate-20 flex items-center justify-center"
                    />
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="grid grid-cols-[repeat(4,270px)] gap-4.5">
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
        </>
      )}
    </div>
  )
}

export default SearchPlaylists;