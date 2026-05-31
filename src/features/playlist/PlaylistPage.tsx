import React, { useState } from 'react';
import { usePlayer } from '../../shared/context/PlayerContext';
import { Play, Pause, Heart, Clock, Disc, Paintbrush, Check, Trash2 } from 'lucide-react';

const PlaylistPage: React.FC = () => {
  const {
    activePlaylist,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedTrackIds,
    toggleLikeTrack,
    setView,
    allPlaylists,
    updatePlaylist,
    removeTrackFromPlaylist
  } = usePlayer();

  const [playlistLiked, setPlaylistLiked] = useState<boolean>(false);
  const [stylePaneOpen, setStylePaneOpen] = useState<boolean>(false);

  // If there is no active playlist yet, fallback to the first playlist loaded (Rock Classics)
  const playlist = activePlaylist || allPlaylists[0];

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-surface select-none pb-40">
        <Disc size={64} className="animate-spin text-primary opacity-30" />
        <p className="mt-4 text-[#adaaaa] font-semibold text-sm">Loading playlist context...</p>
        <button
          onClick={() => setView('home')}
          className="mt-6 px-4 py-2 bg-white text-black text-xs font-bold rounded-full cursor-pointer hover:scale-105 transition-all"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const handlePlaylistPlay = () => {
    if (playlist.tracks.length === 0) return;

    // Check if a song from this playlist is already active
    const isSongFromPlaylistActive = playlist.tracks.some(t => t.id === currentTrack?.id);

    if (isSongFromPlaylistActive) {
      togglePlay();
    } else {
      // Play first track of playlist
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  }

  const isCurrentPlaylistPlaying = isPlaying && playlist.tracks.some(t => t.id === currentTrack?.id);

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${playlist.bgColor ? `${playlist.bgColor}55` : '#1c1c1c'} 0%, #121212 400px, #0e0e0e 100%)`
      }}
      className="pb-32 min-h-full text-white select-none scroll-smooth animate-fade-in"
      id="spotify-playlist-stage"
    >
      {/* Dynamic atmospheric hero banner */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${playlist.bgColor || '#3a3a3a'} 0%, ${playlist.gradientColor || '#121212'} 100%)`
        }}
        className="relative px-8 pt-10 pb-8 flex flex-col md:flex-row items-end gap-8 overflow-hidden transition-all duration-500"
        id="playlist-header-banner"
      >
        {/* Floating rounded XL cover image with dramatic shadow */}
        <div className="shrink-0 shadow-2xl relative group select-none">
          <img
            alt={playlist.name}
            src={playlist.coverUrl}
            className="w-48 h-48 md:w-60 md:h-60 rounded-xl object-cover shadow-3xl select-none transition-transform duration-300 hover:scale-102"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Playlist meta statistics */}
        <div className="flex flex-col gap-2 min-w-0 flex-1 select-none z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#72fe8f] font-label select-none">
            {playlist.creator === 'You' ? 'Personal Playlist' : 'Spotify Curated'}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-headline tracking-tighter text-white leading-none wrap-break-word select-none">
            {playlist.name}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm md:text-base mt-2 max-w-2xl font-medium leading-relaxed select-none">
            {playlist.description}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm mt-3 text-white font-semibold select-none">
            <span className="font-bold hover:underline cursor-pointer">{playlist.creator}</span>
            <span className="text-white/40 select-none">•</span>
            <span>{playlist.likes}</span>
            <span className="text-white/40 select-none">•</span>
            <span>{playlist.songCount} {playlist.songCount === 1 ? 'song' : 'songs'},</span>
            <span className="text-white/60 font-normal select-none">{playlist.durationText}</span>
          </div>
        </div>
      </div>

      {/* Main content table area */}
      <div className="px-8 mt-6">

        {/* Action Button Controls Bar */}
        <div className="flex items-center gap-6 mb-8 flex-wrap" id="playlist-action-bar">
          <button
            disabled={playlist.tracks.length === 0}
            onClick={handlePlaylistPlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black cursor-pointer ${playlist.tracks.length === 0 ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82]'
              }`}
            title="Play Playlist"
          >
            {isCurrentPlaylistPlaying ? (
              <Pause size={24} fill="currentColor" stroke="none" className="translate-x-0" />
            ) : (
              <Play size={24} fill="currentColor" stroke="none" className="translate-x-px" />
            )}
          </button>

          <button
            onClick={() => setPlaylistLiked(!playlistLiked)}
            className={`transition-all hover:scale-115 active:scale-90 cursor-pointer ${playlistLiked ? 'text-primary' : 'text-[#adaaaa] hover:text-white'
              }`}
            title="Like Playlist"
          >
            <Heart size={30} fill={playlistLiked ? '#72fe8f' : 'transparent'} />
          </button>

          {/* Theme customizer workspace toggle */}
          <button
            onClick={() => setStylePaneOpen(!stylePaneOpen)}
            className={`flex items-center gap-2 border text-xs font-black tracking-wide px-4 py-3 rounded-full transition-all cursor-pointer ${stylePaneOpen
              ? 'border-primary bg-primary text-black hover:scale-102 hover:bg-[#63ef82]'
              : 'border-white/10 hover:border-white/30 hover:bg-white/5 text-[#adaaaa] hover:text-white hover:scale-102'
              }`}
            title="Configure Styles"
          >
            <Paintbrush size={15} />
            Configure Styles
          </button>
        </div>

        {/* Dynamic Theme customizer block */}
        {stylePaneOpen && (
          <div className="bg-[#181818] border border-white/10 p-6 rounded-xl mb-8 flex flex-col gap-6 animate-scale-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm tracking-wide text-primary uppercase flex items-center gap-2">
                <Paintbrush size={16} /> Live Playlist Personalizer & Themes
              </h3>
              <button
                onClick={() => setStylePaneOpen(false)}
                className="text-xs text-[#adaaaa] hover:text-white font-bold bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full whitespace-nowrap cursor-pointer"
              >
                Close Panel
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side: Inputs */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#adaaaa] uppercase">Playlist Title</label>
                  <input
                    type="text"
                    value={playlist.name}
                    onChange={(e) => updatePlaylist(playlist.id, { name: e.target.value })}
                    className="bg-[#282828] text-white text-xs font-semibold px-3 py-2.5 rounded-lg border border-white/5 focus:border-primary/40 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#adaaaa] uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={playlist.description}
                    onChange={(e) => updatePlaylist(playlist.id, { description: e.target.value })}
                    className="bg-[#282828] text-white text-xs font-medium px-3 py-2 rounded-lg border border-white/5 focus:border-primary/40 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#adaaaa] uppercase">Cover Artwork Connection URL</label>
                  <input
                    type="text"
                    value={playlist.coverUrl}
                    onChange={(e) => updatePlaylist(playlist.id, { coverUrl: e.target.value })}
                    className="bg-[#282828] text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-primary/40"
                  />
                </div>
              </div>

              {/* Right Side: Preset colors and custom specifications */}
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold text-[#adaaaa] uppercase">Curate Aura theme colors</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Deep Space', bgColor: '#16192b', gradientColor: '#090a10' },
                    { name: 'Sunset Fusion', bgColor: '#bf226e', gradientColor: '#300f2e' },
                    { name: 'Forest Calm', bgColor: '#0e4a36', gradientColor: '#051d14' },
                    { name: 'Crimson Storm', bgColor: '#8b1321', gradientColor: '#1d0205' },
                    { name: 'Gold Luxury', bgColor: '#d4af37', gradientColor: '#1c1704' },
                    { name: 'Cyberpunk Neon', bgColor: '#7928ca', gradientColor: '#0b0c10' },
                    { name: 'Arctic Ice', bgColor: '#2575fc', gradientColor: '#12192a' },
                    { name: 'Obsidian Matte', bgColor: '#3b3b3b', gradientColor: '#111111' }
                  ].map(col => {
                    const isActive = playlist.bgColor === col.bgColor && playlist.gradientColor === col.gradientColor;
                    return (
                      <button
                        key={col.name}
                        onClick={() => updatePlaylist(playlist.id, { bgColor: col.bgColor, gradientColor: col.gradientColor })}
                        style={{ background: `linear-gradient(135deg, ${col.bgColor} 0%, ${col.gradientColor} 100%)` }}
                        className="h-10 rounded-lg flex items-center justify-center border border-white/10 hover:scale-105 active:scale-95 transition-all text-left relative cursor-pointer"
                      >
                        <span className="text-[8px] font-bold bg-black/60 px-1 py-0.5 rounded text-white leading-none">
                          {col.name}
                        </span>
                        {isActive && (
                          <div className="absolute top-1 right-1 bg-primary text-black rounded-full p-0.5 scale-75">
                            <Check size={8} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[#adaaaa]">Custom Hex Core</span>
                    <input
                      type="color"
                      value={playlist.bgColor || '#1c1c1c'}
                      onChange={(e) => updatePlaylist(playlist.id, { bgColor: e.target.value })}
                      className="w-full h-8 rounded bg-transparent border-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[#adaaaa]">Custom Hex Secondary</span>
                    <input
                      type="color"
                      value={playlist.gradientColor || '#0e0e0e'}
                      onChange={(e) => updatePlaylist(playlist.id, { gradientColor: e.target.value })}
                      className="w-full h-8 rounded bg-transparent border-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table column headers */}
        <div className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-3 border-b border-white/10 text-[#adaaaa] text-[11px] font-bold uppercase tracking-wider mb-4 select-none">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Date Added</span>
          <div className="flex justify-end pr-1">
            <Clock size={16} />
          </div>
        </div>

        {/* Tracks List entries */}
        {playlist.tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/3 rounded-xl border border-white/5 select-none animate-fade-in text-center px-4">
            <p className="text-[#adaaaa] font-bold text-sm">No tracks inside this custom layout yet</p>
            <p className="text-xs text-[#adaaaa]/60 mt-1 max-w-md">
              Navigate to the <strong>Search Tab</strong> or home collections, click the context menus or like any specific track to list them here in real-time!
            </p>
            <button
              onClick={() => setView('search')}
              className="mt-6 px-5 py-2 bg-white text-black text-xs font-black rounded-full cursor-pointer hover:scale-105 transition-all"
            >
              Browse & Add Tracks
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pb-20 animate-fade-in">
            {playlist.tracks.map((track, i) => {
              const isCurrentPlayingRow = currentTrack?.id === track.id;
              const isTrackLiked = likedTrackIds.includes(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, playlist.tracks)}
                  className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-2.5 items-center rounded-lg hover:bg-white/5 group cursor-pointer transition-colors duration-200"
                >
                  {/* # column - shows number or nice Play/Pause icon on hover */}
                  <div className="text-[#adaaaa] text-sm font-medium flex items-center">
                    <span className="group-hover:hidden select-none">{i + 1}</span>
                    <Play size={13} fill="currentColor" stroke="none" className="hidden group-hover:block text-white" />
                  </div>

                  {/* TITLE column - thumb, name status highlights */}
                  <div className="flex items-center gap-4 overflow-hidden">
                    <img
                      alt=""
                      className="w-10 h-10 rounded-sm object-cover bg-[#262626] shadow"
                      src={track.coverUrl}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0 select-none">
                      <span className={`font-semibold truncate text-sm leading-tight ${isCurrentPlayingRow ? 'text-primary' : 'text-white'
                        }`}>
                        {track.title}
                      </span>
                      <span className="text-[#adaaaa] text-xs truncate hover:text-white hover:underline mt-0.5">
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  {/* ALBUM column */}
                  <div className="text-[#adaaaa] text-sm truncate hover:text-white transition-colors select-none">
                    {track.album}
                  </div>

                  {/* DATE ADDED column */}
                  <div className="text-[#adaaaa] text-sm truncate select-none">
                    {track.addedDate || 'Jan 10, 2024'}
                  </div>

                  {/* DURATION & LIKE column (Combines hover Like triggers nicely + Remove Action) */}
                  <div className="text-sm text-[#adaaaa] flex items-center justify-end gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTrack(track.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-[#adaaaa] hover:text-white"
                      title="Like song"
                    >
                      <Heart
                        size={15}
                        fill={isTrackLiked ? '#72fe8f' : 'transparent'}
                        className={isTrackLiked ? 'text-primary' : 'text-[#adaaaa] hover:text-[#72fe8f]'}
                      />
                    </button>

                    {/* Delete track layout option */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrackFromPlaylist(playlist.id, track.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-red-500 hover:text-red-400"
                      title="Remove song"
                    >
                      <Trash2 size={15} />
                    </button>

                    <span className="w-10 text-right pr-1 select-none">{track.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistPage;