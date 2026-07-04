import { useEffect, useState } from "react";
import { CircleMinus, ListVideoIcon, MusicIcon, PlusCircleIcon, UploadIcon } from "lucide-react";
import type { Playlist } from "../playlist.types";
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
import playlistService from "../services/playlist.service";

interface PanelPlaylistDetailProps {
  activePlaylist: Playlist | null;
  onClose: () => void;
}

const PanelPlaylistDetail = ({ activePlaylist, onClose }: PanelPlaylistDetailProps) => {
  const playlistId = activePlaylist?.id;
  const user = activePlaylist?.user;

  const { playlistItems, playlistMeta, getPlaylistTracks, addSongToPlaylist, removeSongFromPlaylist } = usePlaylist();
  const { toast, isActive, isFirstLoad, onClose: onCloseToast } = useToaster();
  const { tracks, trackMeta, searchTracks } = useTrack();

  const [isPlaylistMenu, setIsPlaylistMenu] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState('');
  const [isRemoveFiles, setIsRemoveFiles] = useState(true);
  const [isSearchWiget, setIsSearchWiget] = useState(false);
  const [page, setPage] = useState(0);

  const { loaderRef } = useInfiniteScroll(() => {
    if (!playlistMeta.hasNextPage || !playlistId) return;
    getPlaylistTracks(playlistId, {
      limit: 10,
      page: page + 1
    });
    setPage(page + 1);
  });

  async function loadMoreSearchTracks(query: string, page: number) {
    await searchTracks({
      title: query,
      limit: 10,
      page
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

  async function removePlaylist() {
    const { data } = await playlistService.removePlaylist(
      activePlaylist!.id, isRemoveFiles
    );
    if (data?.id) onClose();
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

  useEffect(() => {
    playlistId && getPlaylistTracks(playlistId);
    setIsPlaylistMenu(false);
    setIsSearchWiget(false);
    setActiveTrackId('');
  }, [playlistId]);

  return (
    <div className="overflow-hidden relative">
      <section className="animate-fade-in space-y-6 upload-panel-wrap">
        <div
          style={{
            background: `linear-gradient(to bottom, ${activePlaylist?.bgColor} 0%, ${activePlaylist?.gradientColor} 50%, #121212 100%)`
          }}
          className="text-center p-5 border--b border-white/5 relative mb-0"
        >
          <SmartImage
            wrapClassName="w-28 h-28 rounded-xl bg-white/5 border border-white/10 overflow-hidden mx-auto shadow-2xl relative mb-3.5"
            url={playlistService.playlistCover(activePlaylist!.id, activePlaylist!.cover)}
            icon={(
              <ListVideoIcon className="w-[30%] h-[30%] text-gray-400" />
            )}
          />

          <h3 className="text-xl font-black text-white leading-tight">
            {activePlaylist?.name || 'Lista'}
          </h3>
          <p className="text-xs text-primary font-bold mt-1">
            {user?.username || 'Usuario'}
          </p>
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mt-1.5">
            Playlist
          </span>

          <MenuItem
            onActive={() => setIsPlaylistMenu(true)}
            open={isPlaylistMenu}
            styles={{
              btn: 'absolute top-5 right-5',
              menu: 'top-5 right-5',
              subtext: 'mt-2'
            }}
            sections={[{
              label: 'actions',
              items: [{
                action: 'remove',
                label: 'Eliminar lista',
                icon: (
                  <CircleMinus
                    className="text-current"
                    size={20}
                  />
                ),
                onAction: () => removePlaylist()
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
              items: [{
                action: 'toggle',
                label: 'Incluir archivos',
                subtext: 'Borrar archivos de la lista',
                isActive: isRemoveFiles,
                onAction: (isActive) => setIsRemoveFiles(isActive!)
              }]
            }]}
          />
        </div>

        <div className="space-y-2 p-5">
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
                      open={activeTrackId === track?.id}
                      actions={trackActions}
                      styles={{
                        menu: 'top-0 right-0'
                      }}
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
        label="Buscar canción"
        open={isSearchWiget}
        items={tracks}
        meta={trackMeta}
        isLoadMore={trackMeta.hasNextPage}
        loadMore={loadMoreSearchTracks}
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
        onClose={onCloseToast}
        isFirstLoad={isFirstLoad}
        isActive={isActive}
        {...toast}
      />
    </div>
  )
}

export default PanelPlaylistDetail;