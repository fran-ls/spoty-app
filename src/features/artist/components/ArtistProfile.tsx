import { useEffect } from "react";
import { ChevronRight, DiscIcon, InfoIcon, UserIcon } from "lucide-react";
import type { Artist } from "../artist.types";
import type { AlbumFilters } from "../album.types";
import type { TrackFilters } from "../../song/song.types";
import SmartImage from "../../../shared/components/SmartImage";
import artistService from "../services/artist.service";
import useAuth from "../../auth/hooks/useAuth";
import useTrack from "../../song/hooks/useTrack";
import ProfileTrackList from "./ProfileTrackList";
import ProfileAdminMenu from "./ProfileAdminMenu";
import useAlbum from "../hooks/useAlbum";

interface ArtistProfileProps {
  artist: Artist | null;
  onRemove: (artistId: string) => Promise<boolean>;
  triggerViewAlbum: (id: string) => void;
}

const ArtistProfile = (props: ArtistProfileProps) => {
  const { artist, triggerViewAlbum, onRemove } = props;
  const { isAdmin } = useAuth();
  const { tracks, trackMeta, searchTracks } = useTrack();
  const { albums, albumMeta, searchAlbums } = useAlbum();

  const trackFilters: TrackFilters = {
    page: 0,
    limit: 10,
    include: { album: true },
    ...(artist?.id && { artistId: artist.id })
  }

  const albumFilters: AlbumFilters = {
    page: 0,
    limit: 10,
    ...(artist?.id && { artistId: artist.id })
  }

  useEffect(() => {
    searchTracks(trackFilters);
    searchAlbums(albumFilters);
  }, [artist]);

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      <div className="text-center pb-4 border-b border-white/5 relative">
        <SmartImage
          wrapClassName="text-gray-400 w-28 h-28 rounded-full border-1 border-white/20 bg-white/5 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
          url={artist ? artistService.artistImage(artist.id, artist.image) : null}
          icon={(
            <UserIcon className="w-[30%] h-[30%]" />
          )}
        />

        <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
          <span>{artist?.name}</span>
          <span
            className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[6px] font-black"
            title="Perfil Registrado"
          >
            ✓
          </span>
        </h3>
        <p className="text-[9px] font-mono uppercase tracking-wider text-primary font-bold mt-1">
          Artista Registrado
        </p>

        {isAdmin &&
          <ProfileAdminMenu
            onRemoveArtist={() => (onRemove(artist!.id))}
          />
        }
      </div>

      <div className="space-y-1.5 bg-[#202020] p-4 rounded-xl border border-white/5">
        <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-400 flex items-center gap-1 leading-none">
          <InfoIcon size={11} className="text-primary" />
          <span>Biografía</span>
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed font-medium">
          {artist?.bio || 'No se ha redactado biografía para este perfil todavía. Puedes actualizarla editando o agregando más información.'}
        </p>
      </div>

      {/* Albums under Artist */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500">
          Álbumes del Artista ({albumMeta.total})
        </h4>

        {albums.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1">
            Sin álbumes registrados.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-1.5">
            {albums.map((al, i) => (
              <div
                key={al.id}
                onClick={() => triggerViewAlbum(al.id)}
                className="bg-[#202020] hover:bg-[#252525] p-2 rounded-xl flex items-center justify-between cursor-pointer border border-white/5 group transition-all"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-xs text-gray-500 font-mono w-4 text-center shrink-0">
                    {i + 1}
                  </span>

                  <SmartImage
                    wrapClassName="text-gray-400 w-8 h-8 rounded-md shrink-0 bg-transparent border border-white/20"
                    url={null}
                    icon={(
                      <DiscIcon size={20} />
                    )}
                  />
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

      <div className="space-y-2">
        <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500">
          Canciones registradas ({trackMeta.total})
        </h4>

        {tracks.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1">
            Sin canciones subidas.
          </p>
        ) : (
          <ProfileTrackList tracks={tracks} />
        )}
      </div>
    </div>
  )
}

export default ArtistProfile;