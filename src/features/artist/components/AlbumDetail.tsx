import { MusicIcon } from "lucide-react";
import { mockAlbums, mockTracks } from "../../home/data/music.data";

interface AlbumDetailProps {
  selectedAlbumId: string;
}

const AlbumDetail = ({ selectedAlbumId }: AlbumDetailProps) => {
  const viewingAlbum = mockAlbums.find(al => al.id === selectedAlbumId);
  const albumTracks = viewingAlbum
    ? mockTracks.filter(t => t.album.toLowerCase() === viewingAlbum.title.toLowerCase())
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center pb-4 border-b border-white/5">
        <div className="w-28 h-28 rounded-xl border border-white/10 bg-white/5 overflow-hidden mx-auto shadow-2xl relative mb-3.5">
          <img
            src={viewingAlbum?.coverUrl}
            className="w-full h-full object-cover"
            alt={viewingAlbum?.title}
            referrerPolicy="no-referrer"
          />
        </div>
        <h3 className="text-base font-black text-white leading-tight">
          {viewingAlbum?.title}
        </h3>
        <p className="text-xs text-primary font-bold mt-1">
          {viewingAlbum?.artist}
        </p>
        <p className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
          Álbum Musical
        </p>
      </div>

      {/* Album Tracks list */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500 flex items-center gap-1 leading-none">
            <MusicIcon size={11} />
            <span>
              Lista de Canciones ({albumTracks.length})
            </span>
          </h4>
        </div>

        {albumTracks.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1">
            No hay canciones subidas para este álbum.
          </p>
        ) : (
          <div className="bg-[#1b1b1b] rounded-xl border border-white/5 divide-y divide-white/5">
            {albumTracks.map((tr, index) => (
              <div className="p-2.5 flex items-center justify-between gap-3 overflow-hidden" key={tr.id}>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-[10px] text-gray-500 font-mono w-4 text-center shrink-0">
                    {(index + 1)}
                  </span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate leading-tight">
                      {tr.title}
                    </span>
                    <span className="text-[9px] text-gray-400 block truncate mt-0.5">
                      {tr.artist}
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

export default AlbumDetail;