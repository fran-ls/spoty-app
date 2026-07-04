import { useEffect, useState } from "react";
import { CircleMinus, DiscIcon, MusicIcon, PlusCircleIcon, UploadIcon } from "lucide-react";
import type { Album } from "../album.types";
import type { Track, TrackFilters } from "../../song/song.types";
import SmartImage from "../../../shared/components/SmartImage";
import useTrack from "../../song/hooks/useTrack";
import Loader from "../../../shared/components/Loader";
import Toaster from "../../../shared/components/Toaster";
import useToaster from "../../../shared/hooks/useToaster";
import SearchWidget from "../../../shared/components/SearchWidget";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import { formatTime } from "../../../shared/utils/formatTime";
import MenuItem, { type MenuItemAction } from "../../../shared/components/MenuItem";
import albumService from "../services/album.service";
import songService from "../../song/services/song.service";

interface AlbumDetailProps {
  activeAlbum: Album | null;
  onRemove: (albumId: string) => Promise<boolean>;
}

const AlbumDetail = ({ activeAlbum, onRemove }: AlbumDetailProps) => {
  const { tracks, trackMeta, searchTracks, setTracks, setTrackMeta } = useTrack();
  const {
    tracks: searchTracksItems,
    trackMeta: searchTrackMeta,
    searchTracks: findTracks
  } = useTrack();
  const { toast, isActive, isFirstLoad, onClose } = useToaster();

  const [isSearchWiget, setIsSearchWiget] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState('');

  const [isAlbumMenu, setIsAlbumMenu] = useState(false);
  const [page, setPage] = useState(0);
  const trackFilters: TrackFilters = {
    albumId: activeAlbum?.id,
    limit: 10,
    page: 0
  }

  const { loaderRef } = useInfiniteScroll(() => {
    if (!trackMeta.hasNextPage) return;
    searchTracks({ ...trackFilters, page: page + 1 });
    setPage(page + 1);
  });

  const loadMoreSearchTracks = async (query: string, page: number) => {
    await findTracks({
      title: query,
      limit: 10,
      page
    });
  }

  async function albumActions(action: MenuItemAction) {
    const onClose = () => setIsAlbumMenu(false);

    switch (action) {
      case 'remove':
        const ok = await onRemove(activeAlbum!.id);
        onClose();
        return ok;
      default:
        onClose();
        break;
    }
  }

  async function trackActions(action: MenuItemAction) {
    switch (action) {
      case 'close':
        setActiveTrackId('');
        break;
      case 'remove':
        const ok = await songService.updateSong(activeTrackId, { albumId: null });
        if (ok) {
          setTracks((prev) => prev.filter((t) => t.id !== activeTrackId));
          setTrackMeta((prev) => ({ ...prev, total: prev.total - 1 }));
        }
        setActiveTrackId('');
        return ok;
      default:
        break;
    }
  }

  async function addSongToAlbum(item: Track) {
    if (!item || !activeAlbum?.id) return;
    const { data } = await songService.updateSong(
      item.id,
      { albumId: activeAlbum.id },
      { artist: 'id name' }
    );
    if (!data) return;
    setTrackMeta((prev) => ({ ...prev, total: prev.total + 1 }));
    setTracks((prev) => [data, ...prev]);
  }

  useEffect(() => {
    activeAlbum && searchTracks({ ...trackFilters, page: 0 });
    setIsSearchWiget(false);
    setIsAlbumMenu(false);
    setActiveTrackId('');
  }, [activeAlbum]);

  return (
    <div className="animate-fade-in relative overflow-hidden">
      <section className="p-5 space-y-6 upload-panel-wrap">
        <div className="text-center pb-4 border-b border-white/5 relative">
          <SmartImage
            wrapClassName="w-28 h-28 rounded-xl bg-white/5 border border-white/10 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
            url={activeAlbum ? albumService.albumCover(activeAlbum?.id, activeAlbum.cover) : null}
            icon={(
              <DiscIcon className="w-[30%] h-[30%] text-gray-400" />
            )}
          />

          <h3 className="text-xl font-black text-white leading-tight">
            {activeAlbum?.title || 'Álbum Musical'}
          </h3>
          <p className="text-xs text-primary font-bold mt-1">
            {activeAlbum?.artist?.name || 'Artista'}
          </p>
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
            Álbum Musical
          </span>

          <MenuItem
            styles={{ btn: 'absolute top-0 right-0' }}
            onActive={() => setIsAlbumMenu(true)}
            actions={albumActions}
            open={isAlbumMenu}
            items={[
              {
                action: 'remove',
                label: 'Eliminar álbum',
                icon: (
                  <CircleMinus
                    className="text-current"
                    size={20}
                  />
                )
              },
              {
                action: 'share',
                label: 'Compartir',
                icon: (
                  <UploadIcon
                    className="text-current"
                    size={20}
                  />
                )
              }
            ]}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center gap-2 px-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500 flex items-center gap-1 leading-none">
              <MusicIcon size={11} />
              <span>
                Lista de Canciones ({trackMeta.total})
              </span>
            </h4>
            <button
              onClick={() => setIsSearchWiget(true)}
              className="cursor-pointer text-[9px] font-bold text-primary hover:underline transition-all flex items-center gap-0.5 outline-none"
              title="Añadir canción"
              type="button"
            >
              <PlusCircleIcon size={14} />
            </button>
          </div>

          {tracks.length === 0 ? (
            <p className="text-[10px] text-gray-600 italic px-1">
              No hay canciones subidas para este álbum.
            </p>
          ) : (
            <div className="bg-[#1b1b1b] rounded-xl border border-white/5 divide-y divide-white/5">
              {tracks.map((tr, index) => (
                <div className="p-2.5 flex items-center justify-between gap-3 relative" key={tr.id}>
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-xs text-gray-500 font-mono w-4 text-center shrink-0">
                      {index + 1}
                    </span>

                    <SmartImage
                      wrapClassName="text-gray-400 w-7 h-7 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0"
                      url={songService.songCoverUrl(tr.id, tr.cover)}
                    />

                    <div className="overflow-hidden">
                      <h3
                        className="text-xs font-bold text-white block truncate leading-tight"
                        title={tr.title}
                      >
                        {tr.title}
                      </h3>
                      <span
                        className="text-[9px] text-gray-400 block truncate mt-0.5"
                        title={tr.artist?.name}
                      >
                        {tr.artist?.name}
                      </span>
                    </div>
                  </div>

                  <span className="ml-auto text-[10px] text-gray-400 font-mono shrink-0">
                    {formatTime(tr.duration ?? 0)}
                  </span>

                  <MenuItem
                    onActive={() => setActiveTrackId(tr.id)}
                    open={activeTrackId === tr?.id}
                    actions={trackActions}
                    styles={{
                      menu: 'top-0 right-0'
                    }}
                  />
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
      </section>

      <SearchWidget
        keys={{
          label: 'title',
          value: 'id',
          sub: 'artist.name'
        }}
        label="Buscar canción"
        open={isSearchWiget}
        items={searchTracksItems}
        meta={searchTrackMeta}
        isLoadMore={searchTrackMeta.hasNextPage}
        loadMore={loadMoreSearchTracks}
        onClose={() => setIsSearchWiget(false)}
        payload={({ item }) => addSongToAlbum(item)}
        loadIcon={({ id, cover }) => (
          <SmartImage
            wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded border border-white/5 overflow-hidden shrink-0"
            url={songService.songCoverUrl(id, cover)}
            icon={<MusicIcon size={16} />}
          />
        )}
      />

      <Toaster
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        onClose={onClose}
        {...toast}
      />
    </div>
  )
}

export default AlbumDetail;