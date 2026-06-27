import { useEffect, useState } from "react";
import { DiscIcon, MusicIcon } from "lucide-react";
import type { Album, AlbumFilters } from "../album.types";
import SmartImage from "../../../shared/components/SmartImage";
import useTrack from "../../song/hooks/useTrack";
import { formatTime } from "../../../shared/utils/formatTime";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Loader from "../../../shared/components/Loader";
import ProfileAdminMenu from "./ProfileAdminMenu";
import useAuth from "../../auth/hooks/useAuth";
import Toaster from "../../../shared/components/Toaster";
import useToaster from "../../../shared/hooks/useToaster";

interface AlbumDetailProps {
  selectedAlbumId: string;
  activeAlbum: Album | null;
  onRemove: (artistId: string) => Promise<boolean>;
}

const AlbumDetail = ({ activeAlbum, onRemove }: AlbumDetailProps) => {
  const { tracks, trackMeta, searchTracks } = useTrack();
  const { toast, isActive, isFirstLoad, showToast, onClose } = useToaster();
  const { isAdmin } = useAuth();

  const [page, setPage] = useState(0);
  const filters: AlbumFilters = {
    artistId: activeAlbum?.artistId,
    limit: 10,
    page: 1
  }

  const { loaderRef } = useInfiniteScroll(() => {
    if (trackMeta.hasNextPage) {
      searchTracks({ ...filters, page: page + 1 });
      setPage(page + 1);
    }
  });

  useEffect(() => { activeAlbum && searchTracks(filters) }, [activeAlbum]);

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      <div className="text-center pb-4 border-b border-white/5 relative">
        <SmartImage
          wrapClassName="w-28 h-28 rounded-xl bg-white/5 border border-white/10 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
          url={activeAlbum?.cover || null}
          icon={(
            <DiscIcon className="w-[30%] h-[30%] text-gray-400" />
          )}
        />

        <h3 className="text-base font-black text-white leading-tight">
          {activeAlbum?.title || 'Álbum Musical'}
        </h3>
        <p className="text-xs text-primary font-bold mt-1">
          {activeAlbum?.artist?.name || 'Artista'}
        </p>
        <p className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
          Álbum Musical
        </p>

        {isAdmin &&
          <ProfileAdminMenu
            onRemoveArtist={() => (onRemove(activeAlbum!.id))}
            onOpenToast={() => showToast({
              message: 'Álbum eliminado',
              type: 'error',
              icon: (
                <DiscIcon />
              )
            })}
          />
        }
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500 flex items-center gap-1 leading-none">
            <MusicIcon size={11} />
            <span>
              Lista de Canciones ({trackMeta.total})
            </span>
          </h4>
        </div>

        {tracks.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1">
            No hay canciones subidas para este álbum.
          </p>
        ) : (
          <div className="bg-[#1b1b1b] rounded-xl border border-white/5 divide-y divide-white/5">
            {tracks.map((tr, index) => (
              <div className="p-2.5 flex items-center justify-between gap-3 overflow-hidden" key={tr.id}>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-xs text-gray-500 font-mono w-4 text-center shrink-0">
                    {index + 1}
                  </span>

                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate leading-tight">
                      {tr.title}
                    </span>
                    <span className="text-[9px] text-gray-400 block truncate mt-0.5">
                      {tr.artist?.name}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 font-mono shrink-0">
                  {formatTime(tr.duration ?? 0)}
                </span>
              </div>
            ))}
          </div>
        )}

        {trackMeta.hasNextPage &&
          <div
            className="flex items-center justify-center overflow-hidden"
            ref={loaderRef}
          >
            <Loader
              className="border-transparent border-t-slate-200"
              size={20}
              stroke={2}
            />
          </div>
        }
      </div>

      <Toaster
        onClose={onClose}
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        {...toast}
      />
    </div>
  )
}

export default AlbumDetail;