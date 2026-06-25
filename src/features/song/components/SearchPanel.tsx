import { useEffect, useState } from "react";
import { ChevronRightIcon, DiscIcon, SearchIcon, UserIcon } from "lucide-react";
import type { Artist } from "../../artist/artist.types";
import type { Song } from "../song.types";
import { mockAlbums, mockArtists } from "../../home/data/music.data";
import songService from "../services/song.service";
import artistService from "../../artist/services/artist.service";
import SmartImage from "../../artist/components/SmartImage";

interface SearchPanelProps {
  triggerViewArtist: (id: string) => void;
  triggerViewAlbum: (id: string) => void;
  setArtist: React.Dispatch<React.SetStateAction<Artist | null>>;
}

const SearchPanel = (props: SearchPanelProps) => {
  const { setArtist, triggerViewArtist, triggerViewAlbum } = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterType, setSearchFilterType] = useState<'all' | 'artists' | 'albums'>('all');

  const [artists, setArtists] = useState<Artist[]>([]);
  // const [tracks, setTracks] = useState<Song[]>([]);

  const filteredArtists = mockArtists.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = mockAlbums.filter(al =>
    al.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    al.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // async function getTracks() {
  //   const { data } = await songService.searchSongs({
  //     title: searchQuery.trim()
  //   });

  //   if (data) setTracks(data.items);

  //   console.log(data)
  // }

  async function searchArtists() {
    const { data } = await artistService.getArtists({
      name: searchQuery.trim()
    });

    if (data) setArtists(data.items);
  }

  useEffect(() => { setTimeout(() => searchArtists(), 300) }, [searchQuery]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
          <SearchIcon size={14} />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, artista, álbum..."
          className="w-full bg-[#181818] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-500 outline-none transition-all"
        />
      </div>

      <div className="flex gap-1.5 shrink-0">
        {(['all', 'artists', 'albums'] as const).map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setSearchFilterType(f)}
            className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold transition-all outline-none ${searchFilterType === f
              ? 'bg-white text-black font-black'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
          >
            {f === 'all' ? 'Todo' : f === 'artists' ? 'Artistas' : 'Álbumes'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(searchFilterType === 'all' || searchFilterType === 'artists') && (
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
              <UserIcon size={11} />
              <span>
                Artistas Registrados ({filteredArtists.length})
              </span>
            </h4>
            {artists.length === 0 ? (
              <p className="text-[10px] text-gray-600 italic px-1">
                Ningún artista coincide.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5">
                {artists.map((artist) => (
                  <div
                    onClick={() => {
                      triggerViewArtist(artist.id);
                      setArtist(artist);
                    }}
                    className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                    key={artist.id}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <SmartImage
                        wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0"
                        url={artistService.artistImage(artist.id, artist.image)}
                      />

                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                          {artist.name}
                        </p>
                        <span className="text-[9px] text-gray-400 font-mono">
                          ID: {artist.id}
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon
                      className="text-gray-600 group-hover:text-primary transition-colors"
                      size={14}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Albums */}
        {(searchFilterType === 'all' || searchFilterType === 'albums') && (
          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 flex items-center gap-1.5 px-1 leading-none">
              <DiscIcon size={11} />
              <span>Álbumes Registrados ({filteredAlbums.length})</span>
            </h4>
            {filteredAlbums.length === 0 ? (
              <p className="text-[10px] text-gray-600 italic px-1">Ningún álbum coincide.</p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5">
                {filteredAlbums.map(album => (
                  <div
                    key={album.id}
                    onClick={() => triggerViewAlbum(album.id)}
                    className="bg-[#161616] hover:bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                        <img src={album.coverUrl} className="w-full h-full object-cover" alt={album.title} referrerPolicy="no-referrer" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{album.title}</p>
                        <span className="text-[9px] text-gray-400 truncate leading-none mt-0.5 block">{album.artist}</span>
                      </div>
                    </div>
                    <ChevronRightIcon className="text-gray-600 group-hover:text-primary transition-colors" size={14} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPanel;