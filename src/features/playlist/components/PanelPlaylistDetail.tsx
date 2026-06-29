import { useEffect, useState } from "react";
import { CircleMinus, ListVideoIcon, MusicIcon, PlusCircleIcon, UploadIcon } from "lucide-react";
import type { Playlist } from "../playlist.types";
import type { Song } from "../../song/song.types";
import type { SearchMeta } from "../../../shared/types/common.types";
import SmartImage from "../../../shared/components/SmartImage";
import { formatTime } from "../../../shared/utils/formatTime";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Loader from "../../../shared/components/Loader";
import Toaster from "../../../shared/components/Toaster";
import useToaster from "../../../shared/hooks/useToaster";
import usePlaylist from "../hooks/usePlaylist";
import songService from "../../song/services/song.service";
import SearchWidget from "../../../shared/components/SearchWidget";
import useTrack from "../../song/hooks/useTrack";
import MenuItem, { type MenuItemAction } from "../../../shared/components/MenuItem";

interface PanelPlaylistDetailProps {
  activePlaylist: Playlist | null;
  onRemove: (playlistId: string) => Promise<boolean>;
}

const PanelPlaylistDetail = ({ activePlaylist, onRemove }: PanelPlaylistDetailProps) => {
  const playlistId = activePlaylist?.id;
  const { playlistItems, playlistMeta, getPlaylistSongs, addSongToPlaylist, removeSongFromPlaylist } = usePlaylist();
  const { toast, isActive, isFirstLoad, onClose } = useToaster();
  const { searchTracks } = useTrack();

  const [activeTrackId, setActiveTrackId] = useState('');
  const artist = playlistItems[0]?.song?.artist;

  const [isSearchWiget, setIsSearchWiget] = useState(false);
  const [artistSearch, setArtistSearch] = useState<Song[]>([]);
  const [artistSearchMeta, setArtistSearchMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [page, setPage] = useState(0);
  const filters = {
    limit: 10,
    page: 0
  }

  const { loaderRef } = useInfiniteScroll(() => {
    if (!playlistMeta.hasNextPage || !playlistId) return;
    getPlaylistSongs(playlistId, { ...filters, page: page + 1 });
    setPage(page + 1);
  });

  const loadMoreArtists = async (query: string, page: number) => {
    const searchFilters = {
      title: query,
      limit: 10,
      page
    }

    await searchTracks(searchFilters, (data) => {
      if (!data) return;
      setArtistSearchMeta(data.meta);

      if (page > 1) {
        setArtistSearch((prev) => [...prev, ...data.items]);
        return;
      }

      setArtistSearch(data.items);
    });
  }

  const addSong = async (songId: string) => addSongToPlaylist({
    playlistId: playlistId!,
    songId,
    include: {
      song: {
        include: {
          artist: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  async function playlistActions(action: MenuItemAction) {
    switch (action) {
      case 'remove':
        const ok = await onRemove(activePlaylist!.id);
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
        const ok = await removeSongFromPlaylist(activeTrackId);
        setActiveTrackId('');
        return ok;
      default:
        break;
    }

  }

  useEffect(() => { playlistId && getPlaylistSongs(playlistId) }, [playlistId]);

  return (
    <div className="animate-fade-in overflow-hidden">
      <section className="overflow-y-auto max-h-[calc(100vh-73px)] min-h-[calc(100vh-73px)] p-5 space-y-6 panel-wrap">
        <div className="text-center pb-4 border-b border-white/5 relative">
          <SmartImage
            wrapClassName="w-28 h-28 rounded-xl bg-white/5 border border-white/10 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
            url={activePlaylist?.cover || null}
            icon={(
              <ListVideoIcon className="w-[30%] h-[30%] text-gray-400" />
            )}
          />

          <h3 className="text-xl font-black text-white leading-tight">
            {activePlaylist?.name || 'Lista'}
          </h3>
          <p className="text-xs text-primary font-bold mt-1">
            {artist?.name || 'Artista'}
          </p>
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
            Playlist
          </span>

          <MenuItem
            styles={{ btn: 'absolute top-0 right-0' }}
            actions={playlistActions}
            items={[
              {
                action: 'remove',
                label: 'Eliminar lista',
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
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-gray-500 flex items-center gap-1 leading-none">
              <MusicIcon size={11} />
              <span>
                Lista de Canciones ({playlistMeta.total})
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

          {playlistItems.length === 0 ? (
            <p className="text-[10px] text-gray-600 italic px-1">
              No hay canciones subidas para este álbum.
            </p>
          ) : (
            <div className="bg-[#1b1b1b] rounded-xl border border-white/5 divide-y divide-white/5 relative">
              {playlistItems.map((tr, index) => {
                const track = tr.song;
                const artist = tr.song?.artist || null;

                return (
                  <div
                    style={{ position: 'relative' }}
                    className="p-2.5 flex items-center justify-between gap-3 relative"
                    key={tr.id}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-xs text-gray-500 font-mono w-4 text-center shrink-0">
                        {index + 1}
                      </span>

                      <SmartImage
                        wrapClassName="text-gray-400 w-7 h-7 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0"
                        url={track ? songService.songCoverUrl(track.id, track.cover) : null}
                      />

                      <div className="overflow-hidden">
                        <h3
                          className="text-xs font-bold text-white block truncate leading-tight"
                          title={track?.title}
                        >
                          {track?.title}
                        </h3>
                        <span
                          className="text-[9px] text-gray-400 block truncate mt-0.5"
                          title={artist?.name}
                        >
                          {artist?.name}
                        </span>
                      </div>
                    </div>

                    <span className="ml-auto text-[10px] text-gray-400 font-mono shrink-0">
                      {formatTime(track?.duration ?? 0)}
                    </span>

                    <MenuItem
                      onActive={() => setActiveTrackId(tr.id)}
                      styles={{ menu: 'top-0 right-0' }}
                      open={activeTrackId === track?.id}
                      actions={trackActions}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {playlistMeta.hasNextPage &&
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
        open={isSearchWiget}
        items={artistSearch}
        meta={artistSearchMeta}
        isLoadMore={artistSearchMeta.hasNextPage}
        loadMore={loadMoreArtists}
        onClose={() => setIsSearchWiget(false)}
        payload={({ value }) => addSong(value)}
        loadIcon={({ id, cover }) => (
          <SmartImage
            wrapClassName="text-gray-400 min-w-0 w-9 h-9 rounded border border-white/5 overflow-hidden shrink-0"
            url={id ? songService.songCoverUrl(id, cover) : null}
            icon={<MusicIcon size={16} />}
          />
        )}
      />

      <Toaster
        onClose={onClose}
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        {...toast}
      />
    </div>
  )
}

export default PanelPlaylistDetail;