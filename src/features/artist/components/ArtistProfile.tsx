import { useEffect, useState } from "react";
import { CheckIcon, ChevronRight, CircleMinus, DiscIcon, InfoIcon, MusicIcon, PlusCircleIcon, UploadIcon, UserIcon } from "lucide-react";
import type { Artist } from "../artist.types";
import type { Album, AlbumFilters } from "../album.types";
import type { Song, TrackFilters } from "../../song/song.types";
import SmartImage from "../../../shared/components/SmartImage";
import artistService from "../services/artist.service";
import useTrack from "../../song/hooks/useTrack";
import ProfileTrackList from "./ProfileTrackList";
import useAlbum from "../hooks/useAlbum";
import MenuItem from "../../../shared/components/MenuItem";
import SearchWidget from "../../../shared/components/SearchWidget";
import songService from "../../song/services/song.service";
import useToaster from "../../../shared/hooks/useToaster";
import useApiFetch from "../../../shared/hooks/useApiFetch";
import Toaster from "../../../shared/components/Toaster";

interface ArtistProfileProps {
  artist: Artist | null;
  onRemove: (artistId: string, isRemoveFiles?: boolean) => Promise<boolean>;
  triggerViewAlbum: (album: Album) => void;
}

const ArtistProfile = (props: ArtistProfileProps) => {
  const { artist, triggerViewAlbum, onRemove } = props;
  const { tracks, trackMeta, searchTracks, setTracks, setTrackMeta } = useTrack();
  const { albums, albumMeta, searchAlbums } = useAlbum();

  const { isActive, toast, isFirstLoad, showToast, onClose } = useToaster(5000);
  const useApi = useApiFetch(showToast);

  const {
    tracks: searchTrackItems,
    trackMeta: searchTrackMeta,
    searchTracks: searchTracksToAdd
  } = useTrack();

  const [isRemoveFiles, setIsRemoveFiles] = useState(true);
  const [isSearchWiget, setIsSearchWiget] = useState(false);

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

  const loadMoreTracks = async (query: string, page: number) => {
    await searchTracksToAdd({
      title: query,
      limit: 10,
      page
    });
  }

  function uploadSong(item: any) {
    const config = {
      message: 'Agregada',
      icon: (
        <MusicIcon
          className="min-w-5 stroke-2"
          size={20}
        />
      )
    }

    const artistName = item.artist?.name;

    useApi.save<Song>(
      () => songService.uploadSong({ ...item, artistName }), config)
      .then((data) => {
        if (!data) return;
        setTracks((prev) => [data, ...prev]);
        setTrackMeta((prev) => ({ ...prev, total: prev.total + 1 }));
      });
  }

  useEffect(() => {
    searchTracks(trackFilters);
    searchAlbums(albumFilters);
  }, [artist]);

  return (
    <div className="overflow-hidden relative">
      <div className="p-5 space-y-6 animate-fade-in upload-panel-wrap">
        <div className="text-center pb-4 border-b border-white/5 relative">
          <SmartImage
            wrapClassName="text-gray-400 w-28 h-28 rounded-full border-1 border-white/20 bg-white/5 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
            url={artist ? artistService.artistImage(artist.id, artist.image) : null}
            icon={<UserIcon className="w-[30%] h-[30%]" />}
          />

          <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
            <span>{artist?.name}</span>
            <span
              className="p-0.5 w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[6px] font-black"
              title="Perfil Registrado"
            >
              <CheckIcon />
            </span>
          </h3>
          <p className="text-[9px] font-mono uppercase tracking-wider text-primary font-bold mt-1">
            Artista Registrado
          </p>

          <MenuItem
            styles={{
              btn: 'absolute top-0 right-0',
              menu: 'w-50'
            }}
            sections={[{
              label: 'actions',
              items: [{
                action: 'remove',
                label: 'Eliminar artista',
                icon: (
                  <CircleMinus
                    className="text-current"
                    size={20}
                  />
                ),
                onAction: () => onRemove(artist!.id, isRemoveFiles)
              }, {
                action: 'share',
                label: 'Compartir',
                icon: (
                  <UploadIcon
                    className="text-current"
                    size={20}
                  />
                )
              }]
            }, {
              label: 'files',
              items: [
                {
                  action: 'toggle',
                  label: 'Incluir archivos',
                  isActive: isRemoveFiles,
                  icon: (
                    <CircleMinus
                      className="text-current"
                      size={20}
                    />
                  ),
                  onAction: (isActive) => setIsRemoveFiles(isActive!)
                }
              ]
            }]}
          />
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
                  onClick={() => triggerViewAlbum(al)}
                  className="bg-[#202020] hover:bg-[#252525] p-2 rounded-xl flex items-center justify-between cursor-pointer border border-white/5 group transition-all"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-xs text-gray-500 font-mono w-4 text-center shrink-0">
                      {i + 1}
                    </span>

                    <SmartImage
                      wrapClassName="text-gray-400 w-8 h-8 rounded-md shrink-0 bg-transparent border border-white/20"
                      url={null}
                      icon={<DiscIcon size={20} />}
                    />

                    <h3 className="text-xs font-bold text-gray-200 group-hover:text-primary transition-colors truncate">
                      {al.title}
                    </h3>
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
          <div className="flex justify-between items-center gap-2 px-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500">
              Canciones registradas ({trackMeta.total})
            </h4>
            <button
              // onClick={() => setIsSearchWiget(true)}
              className="cursor-pointer text-[9px] font-bold text-primary hover:underline transition-all hidden items-center gap-0.5 outline-none"
              title="Añadir canción"
              type="button"
            >
              <PlusCircleIcon size={14} />
            </button>
          </div>

          {tracks.length === 0 ? (
            <p className="text-[10px] text-gray-600 italic px-1">
              Sin canciones subidas.
            </p>
          ) : (
            <ProfileTrackList
              tracks={tracks}
              trackMeta={trackMeta}
              isLoadMore={trackMeta.hasNextPage}
              loadMore={(page) => searchTracks({ ...trackFilters, page: page + 1 })}
            />
          )}
        </div>
      </div>

      <div className="hidden">
        <SearchWidget
          keys={{
            label: 'title',
            value: 'id',
            sub: 'artist.name'
          }}
          label="Buscar canción"
          open={isSearchWiget}
          items={searchTrackItems}
          meta={searchTrackMeta}
          isLoadMore={searchTrackMeta.hasNextPage}
          loadMore={loadMoreTracks}
          payload={uploadSong}
          onClose={() => setIsSearchWiget(false)}
          loadIcon={({ id, cover }) => (
            <SmartImage
              wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded border border-white/5 overflow-hidden shrink-0"
              url={id ? artistService.artistImage(id, cover) : null}
              icon={<MusicIcon size={16} />}
            />
          )}
        />
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

export default ArtistProfile;