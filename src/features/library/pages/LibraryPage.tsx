import React, { useState } from 'react';
import { Search, ListFilter, Play, Heart, LayoutGrid, List, Rows3 } from 'lucide-react';
import { mockArtists, mockPodcasts, mockAlbums } from '../../../shared/data/music.data';

type FilterType = 'All' | 'Playlists' | 'Podcasts' | 'Artists' | 'Albums';
type LayoutMode = 'grid' | 'list' | 'compact';

const LibraryPage: React.FC = () => {
  const allPlaylists = [] as any[];

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [searchLibraryQuery, setSearchLibraryQuery] = useState<string>('');
  const [playlistLayout, setPlaylistLayout] = useState<LayoutMode>('grid');

  const handleTabClick = (filter: FilterType) => {
    setActiveFilter(filter);
  }

  const matchFilter = (itemType: FilterType) => {
    return activeFilter === 'All' || activeFilter === itemType;
  }

  // Filter items matching search input
  const filterBySearch = (text: string) => {
    if (!searchLibraryQuery) return true;
    return text.toLowerCase().includes(searchLibraryQuery.toLowerCase());
  }

  const likedTrackIdsLength = 10;

  return (
    <div
      className="p-8 pb-10 min-h-full bg-surface text-white select-none scroll-smooth animate-fade-in"
      id="spotify-library-stage"
    >
      <div className="flex justify-between items-end mb-10">
        <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white select-none">
          Your Library
        </h1>
        <button
          className="bg-primary hover:bg-[#63ef82] text-black font-black text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-xl cursor-pointer font-headline"
        >
          Create Playlist
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2 select-none">
        {(['All', 'Playlists', 'Podcasts', 'Artists', 'Albums'] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => handleTabClick(filter)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${activeFilter === filter
              ? 'bg-white text-black'
              : 'bg-[#262626] text-white hover:bg-[#323232]'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Action panel with search box and layout customizer switches */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8 select-none">
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowSearchBox(!showSearchBox)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#adaaaa] hover:text-white hover:bg-[#262626] transition-all cursor-pointer bg-white/5"
            title="Search Library"
          >
            <Search size={18} />
          </button>

          {showSearchBox && (
            <input
              type="text"
              placeholder="Search library..."
              value={searchLibraryQuery}
              onChange={(e) => setSearchLibraryQuery(e.target.value)}
              className="bg-[#262626] border-none text-xs rounded-full py-1.5 px-4 outline-none text-white focus:ring-1 focus:ring-white/20 animate-scale-up border border-white/5 ml-1"
            />
          )}
        </div>

        {/* Layout Mode Selector (Cuadrícula, Lista, Lista Compacta) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 bg-[#181818] border border-white/5 p-1 rounded-full shadow-inner">
            <button
              onClick={() => setPlaylistLayout('grid')}
              className={`p-2 rounded-full transition-all cursor-pointer ${playlistLayout === 'grid' ? 'bg-primary text-black' : 'text-[#adaaaa] hover:text-white'
                }`}
              title="Cuadrícula"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setPlaylistLayout('list')}
              className={`p-2 rounded-full transition-all cursor-pointer ${playlistLayout === 'list' ? 'bg-primary text-black' : 'text-[#adaaaa] hover:text-white'
                }`}
              title="Lista"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setPlaylistLayout('compact')}
              className={`p-2 rounded-full transition-all cursor-pointer ${playlistLayout === 'compact' ? 'bg-primary text-black' : 'text-[#adaaaa] hover:text-white'
                }`}
              title="Lista compacta"
            >
              <Rows3 size={15} />
            </button>
          </div>

          <div className="flex items-center gap-2 group cursor-pointer select-none">
            <span className="text-[#adaaaa] text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">
              Recents
            </span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#adaaaa] group-hover:text-white bg-white/5">
              <ListFilter size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* RENDER MODE: GRID (Cuadrícula) */}
      {playlistLayout === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10 animate-fade-in">

          {/* Liked Songs Span Card */}
          {matchFilter('Playlists') && filterBySearch('Liked Songs') && (
            <div
              className="col-span-2 row-span-1 p-6 rounded-2xl bg-linear-to-br from-[#450af5] to-[#8e8ee5] flex flex-col justify-end group cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden min-h-55 active:scale-98 select-none font-headline"
            >
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] background-size:16px_16px pointer-events-none" />

              <div className="relative z-10 select-none">
                <p className="text-3xl font-black mb-2 text-white leading-none">
                  Liked<br />Songs
                </p>
                <p className="text-white/85 font-medium text-sm mt-3 flex items-center gap-1.5">
                  <Heart size={14} fill="currentColor" />
                  {likedTrackIdsLength} songs
                </p>
              </div>

              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                <button
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-black shadow-2xl scale-110 hover:scale-115 active:scale-90 cursor-pointer"
                >
                  <Play size={20} fill="currentColor" stroke="none" className="translate-x-px" />
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Playlists list from workshop state */}
          {matchFilter('Playlists') && allPlaylists.filter((p: any) => filterBySearch(p.name)).map(playlist => (
            <div
              key={playlist.id}
              className="p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all duration-300 group cursor-pointer flex flex-col active:scale-98 border border-white/5"
            >
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-[#262626]">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover shadow-lg group-hover:scale-[1.03] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-black shadow-xl"
                  >
                    <Play size={18} fill="currentColor" stroke="none" className="translate-x-px" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-white truncate mb-1 text-sm sm:text-base leading-snug">
                {playlist.name}
              </h3>
              <p className="text-[#adaaaa] text-xs font-semibold">
                Playlist • {playlist.creator}
              </p>
            </div>
          ))}

          {/* Artists */}
          {matchFilter('Artists') && mockArtists.filter(a => filterBySearch(a.name)).map(artist => (
            <div
              key={artist.id}
              className="p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center active:scale-98 border border-white/5"
            >
              <div className="relative aspect-square w-full mb-4 rounded-full overflow-hidden bg-[#262626] shadow-xl">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-white truncate mb-1 text-sm sm:text-base leading-snug w-full">
                {artist.name}
              </h3>
              <p className="text-[#adaaaa] text-xs font-semibold">
                Artist
              </p>
            </div>
          ))}

          {/* Podcasts */}
          {matchFilter('Podcasts') && mockPodcasts.filter(p => filterBySearch(p.title)).map(podcast => (
            <div
              key={podcast.id}
              onClick={() => alert(`Podcast Selected: ${podcast.title}`)}
              className="p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all duration-300 group cursor-pointer flex flex-col active:scale-98 border border-white/5"
            >
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-[#2d2d2d] shadow-lg">
                <img
                  src={podcast.coverUrl}
                  alt={podcast.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-white truncate mb-1 text-sm sm:text-base leading-snug">
                {podcast.title}
              </h3>
              <p className="text-[#adaaaa] text-xs font-semibold">
                Podcast • {podcast.publisher}
              </p>
            </div>
          ))}

          {/* Albums */}
          {matchFilter('Albums') && mockAlbums.filter(a => filterBySearch(a.title)).map(album => (
            <div
              key={album.id}
              className="p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all duration-300 group cursor-pointer flex flex-col active:scale-98 border border-white/5"
            >
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-[#2d2d2d] shadow-lg">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-white truncate mb-1 text-sm sm:text-base leading-snug">
                {album.title}
              </h3>
              <p className="text-[#adaaaa] text-xs font-semibold truncate">
                Album • {album.artist}
              </p>
            </div>
          ))}

        </div>
      )}

      {/* RENDER MODE: LIST (Lista) */}
      {playlistLayout === 'list' && (
        <div className="flex flex-col gap-4 max-w-4xl animate-fade-in" id="library-list-mode">

          {/* Liked Songs row */}
          {matchFilter('Playlists') && filterBySearch('Liked Songs') && (
            <div
              className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-[#450af5] to-[#8e8ee5]/40 hover:from-[#5113fa] hover:to-[#8e8ee5]/60 transition-all group cursor-pointer border border-[#8e8ee5]/20"
            >
              <div className="w-16 h-16 rounded-lg bg-linear-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shadow-lg shrink-0">
                <Heart size={24} fill="currentColor" className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base">Liked Songs</h3>
                <p className="text-xs text-white/70 font-semibold mt-1">
                  Playlist • By You • {10} tracks
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-black transition-transform hover:scale-105 active:scale-95"
                >
                  <Play size={16} fill="currentColor" stroke="none" className="translate-x-px" />
                </button>
              </div>
            </div>
          )}

          {/* Playlists lists mapping */}
          {matchFilter('Playlists') && allPlaylists.filter(p => filterBySearch(p.name)).map(playlist => (
            <div
              key={playlist.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all group cursor-pointer border border-white/5"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#262626]">
                <img src={playlist.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base truncate">{playlist.name}</h3>
                <p className="text-xs text-[#adaaaa] font-semibold mt-1">
                  Playlist • By {playlist.creator} • {playlist.songCount || 0} tracks • {playlist.durationText}
                </p>
                {playlist.description && (
                  <p className="text-[11px] text-[#adaaaa]/80 mt-1 truncate max-w-xl">
                    {playlist.description}
                  </p>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap gap-3 flex items-center">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-black cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <Play size={16} fill="currentColor" stroke="none" className="translate-x-px" />
                </button>
              </div>
            </div>
          ))}

          {/* Artists layout row */}
          {matchFilter('Artists') && mockArtists.filter(a => filterBySearch(a.name)).map(artist => (
            <div
              key={artist.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all group cursor-pointer border border-white/5 animate-fade-in"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#262626]">
                <img src={artist.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base truncate">{artist.name}</h3>
                <p className="text-xs text-[#adaaaa] font-semibold mt-1">
                  Artist • Pop/Rock classics
                </p>
              </div>
              <span className="text-xs text-white/40 uppercase tracking-widest font-black mr-4">Artist</span>
            </div>
          ))}

          {/* Podcasts row layout */}
          {matchFilter('Podcasts') && mockPodcasts.filter(p => filterBySearch(p.title)).map(podcast => (
            <div
              key={podcast.id}
              onClick={() => alert(`Podcast Episode Selected: ${podcast.title}`)}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all group cursor-pointer border border-white/5 animate-fade-in"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#2d2d2d] relative">
                <img src={podcast.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base truncate">{podcast.title}</h3>
                <p className="text-xs text-[#adaaaa] font-semibold mt-1">
                  Podcast • Published by {podcast.publisher}
                </p>
              </div>
              <div className="h-8 bg-white/5 border border-white/10 px-3 flex items-center justify-center rounded-full text-[10px] uppercase font-bold tracking-wider text-[#adaaaa]">
                Podcast
              </div>
            </div>
          ))}

          {/* Albums row layout */}
          {matchFilter('Albums') && mockAlbums.filter(a => filterBySearch(a.title)).map(album => (
            <div
              key={album.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#131313] hover:bg-[#262626] transition-all group cursor-pointer border border-white/5 animate-fade-in"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#2d2d2d]">
                <img src={album.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base truncate">{album.title}</h3>
                <p className="text-xs text-[#adaaaa] font-semibold mt-1">
                  Album • Artist: {album.artist}
                </p>
              </div>
              <span className="text-xs text-white/40 font-black mr-2">Core Album</span>
            </div>
          ))}

        </div>
      )}

      {/* RENDER MODE: COMPACT LIST (Lista Compacta) */}
      {playlistLayout === 'compact' && (
        <div className="flex flex-col gap-1.5 max-w-4xl bg-[#131313]/40 border border-white/5 p-4 rounded-2xl animate-fade-in" id="library-compact-mode">

          {/* Liked Songs Line */}
          {matchFilter('Playlists') && filterBySearch('Liked Songs') && (
            <div
              className="flex items-center justify-between gap-4 py-2 px-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer font-medium text-xs text-[#adaaaa]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-linear-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow">
                  <Heart size={12} fill="currentColor" className="text-white" />
                </div>
                <span className="text-white font-heavy text-sm">Liked Songs</span>
                <span className="text-white/20 select-none">•</span>
                <span>By You</span>
                <span className="text-white/10 select-none">|</span>
                <span>{likedTrackIdsLength} songs favorited</span>
              </div>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Liked List</span>
            </div>
          )}

          {/* Playlists mappings */}
          {matchFilter('Playlists') && allPlaylists.filter(p => filterBySearch(p.name)).map(playlist => (
            <div
              key={playlist.id}
              className="flex items-center justify-between gap-4 py-2 px-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer font-medium text-xs text-[#adaaaa]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-[#262626] overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={playlist.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-white font-bold truncate text-sm">{playlist.name}</span>
                <span className="text-white/20 select-none">•</span>
                <span className="truncate">Creator: {playlist.creator}</span>
                <span className="text-white/10 select-none">|</span>
                <span className="truncate">{playlist.songCount || 0} song{playlist.songCount === 1 ? '' : 's'}</span>
              </div>
              <span className="shrink-0 font-mono text-[10px] font-bold text-white/50">{playlist.durationText}</span>
            </div>
          ))}

          {/* Artists list */}
          {matchFilter('Artists') && mockArtists.filter(a => filterBySearch(a.name)).map(artist => (
            <div
              key={artist.id}
              className="flex items-center justify-between gap-4 py-2 px-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer font-medium text-xs text-[#adaaaa]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#262626] overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={artist.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-white font-bold truncate text-sm">{artist.name}</span>
                <span className="text-white/20 select-none">•</span>
                <span>Active Artist profile</span>
              </div>
              <span className="shrink-0 text-[9px] font-bold text-[#adaaaa] tracking-wider uppercase border border-white/10 px-1.5 py-0.5 rounded bg-white/3">Artist</span>
            </div>
          ))}

          {/* Podcasts list */}
          {matchFilter('Podcasts') && mockPodcasts.filter(p => filterBySearch(p.title)).map(podcast => (
            <div
              key={podcast.id}
              onClick={() => alert(`Podcast Selected: ${podcast.title}`)}
              className="flex items-center justify-between gap-4 py-2 px-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer font-medium text-xs text-[#adaaaa]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-[#2d2d2d] overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={podcast.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-white font-bold truncate text-sm">{podcast.title}</span>
                <span className="text-white/20 select-none">•</span>
                <span className="truncate">Publisher: {podcast.publisher}</span>
              </div>
              <span className="shrink-0 text-[9px] font-bold text-[#adfeff] tracking-wider uppercase border border-[#adfeff]/10 px-1.5 py-0.5 rounded bg-[#adfeff]/3">Podcast</span>
            </div>
          ))}

          {/* Albums list */}
          {matchFilter('Albums') && mockAlbums.filter(a => filterBySearch(a.title)).map(album => (
            <div
              key={album.id}
              className="flex items-center justify-between gap-4 py-2 px-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer font-medium text-xs text-[#adaaaa]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-[#2d2d2d] overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={album.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-white font-bold truncate text-sm">{album.title}</span>
                <span className="text-white/20 select-none">•</span>
                <span className="truncate">Artist: {album.artist}</span>
              </div>
              <span className="shrink-0 text-[9px] font-bold text-white/40 tracking-wider uppercase">Album</span>
            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default LibraryPage;