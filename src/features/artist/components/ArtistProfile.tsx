import { useState } from "react";
import { ChevronRight, InfoIcon } from "lucide-react";
import type { ArtistDTO } from "../artist.types";
import { mockAlbums, mockArtists, mockTracks } from "../../home/data/music.data";

interface ArtistProfileProps {
  selectedArtistId: string;
  triggerViewAlbum: (id: string) => void;
}

const ArtistProfile = ({ selectedArtistId, triggerViewAlbum }: ArtistProfileProps) => {
  const [artistForm, setArtistForm] = useState<ArtistDTO>({ name: '' });

  // Retrieve focused models for Detail Views
  const viewingArtist = mockArtists.find(a => a.id === selectedArtistId);
  const artistAlbums = viewingArtist
    ? mockAlbums.filter(al => al.artist.toLowerCase() === viewingArtist.name.toLowerCase())
    : [];
  const artistTracks = viewingArtist
    ? mockTracks.filter(t => t.artist.toLowerCase() === viewingArtist.name.toLowerCase())
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Big Artist Avatar Header */}
      <div className="text-center pb-4 border-b border-white/5">
        <div className="w-28 h-28 rounded-full border-2 border-primary/20 bg-white/5 overflow-hidden mx-auto shadow-2xl relative mb-3.5">
          <img
            src={viewingArtist?.imageUrl}
            className="w-full h-full object-cover"
            alt={viewingArtist?.name}
            referrerPolicy="no-referrer"
          />
        </div>
        <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
          <span>{viewingArtist?.name}</span>
          <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[6px] font-black" title="Perfil Registrado">✓</span>
        </h3>
        <p className="text-[9px] font-mono uppercase tracking-wider text-primary font-bold mt-1">
          Artista Registrado
        </p>
      </div>

      {/* Biography */}
      <div className="space-y-1.5 bg-[#202020] p-4 rounded-xl border border-white/5">
        <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-400 flex items-center gap-1 leading-none">
          <InfoIcon size={11} className="text-primary" />
          <span>Biografía</span>
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed font-medium">
          {artistForm.bio || 'No se ha redactado biografía para este perfil todavía. Puedes actualizarla editando o agregando más información.'}
        </p>
      </div>

      {/* Albums under Artist */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500">
          Álbumes del Artista ({artistAlbums.length})
        </h4>
        {artistAlbums.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1">Sin álbumes registrados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-1.5">
            {artistAlbums.map(al => (
              <div
                key={al.id}
                onClick={() => triggerViewAlbum(al.id)}
                className="bg-[#202020] hover:bg-[#252525] p-2 rounded-xl flex items-center justify-between cursor-pointer border border-white/5 group transition-all"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-md overflow-hidden shrink-0">
                    <img
                      src={al.coverUrl}
                      className="w-full h-full object-cover"
                      alt={al.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-200 group-hover:text-primary transition-colors truncate">
                    {al.title}
                  </span>
                </div>
                <ChevronRight
                  className="text-gray-600 group-hover:text-primary transition-colors"
                  size={13}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tracks under Artist */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500">
          Canciones registradas ({artistTracks.length})
        </h4>
        {artistTracks.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1">Sin canciones subidas.</p>
        ) : (
          <div className="bg-[#1b1b1b] rounded-xl border border-white/5 divide-y divide-white/5">
            {artistTracks.map((tr, index) => (
              <div key={tr.id} className="p-2.5 flex items-center justify-between gap-3 overflow-hidden">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-[10px] text-gray-500 font-mono w-4 text-center shrink-0">
                    {(index + 1)}
                  </span>
                  <div className="w-7 h-7 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0">
                    <img
                      src={tr.coverUrl}
                      className="w-full h-full object-cover"
                      alt={tr.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate leading-tight">
                      {tr.title}
                    </span>
                    <span className="text-[9px] text-gray-400 block truncate mt-0.5">
                      {tr.album}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono shrink-0">
                  {tr.duration}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtistProfile;