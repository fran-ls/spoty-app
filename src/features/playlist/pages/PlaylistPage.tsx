import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircleMinusIcon, ListPlusIcon, Music2Icon, MusicIcon, PlusIcon, ShareIcon } from 'lucide-react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import type { PlaylistSong } from '../playlist.types';
import ActionMenu from '../../../shared/components/ActionMenu';
import EditData from '../components/EditData';
import BackgroundColor from '../components/BackgroundColor';
import DeleteConfirm from '../components/DeleteConfirm';
import PlaylistSongs from '../components/PlaylistSongs';
import usePlayer from '../../player/hooks/usePlayer';
import usePlaylist from '../hooks/usePlaylist';
import TrackModal from '../../song/components/TrackModal';
import useLibrary from '../../library/hooks/useLibrary';
import useAuth from '../../auth/hooks/useAuth';
import { convertColor } from '../utils/convertColor';
import PlaylistCard from '../components/PlaylistCard';
import PlaylistActionBar from '../components/PlaylistActionBar';
import { STYLES } from '../../../shared/utils/styles';
import SearchSongsForPlaylist from '../components/SearchSongsForPlaylist';
import { PlaylistLayout } from '../../library/library.types';
import { routes } from '../../../shared/utils/routes';
import { CustomScrollbar } from '../../../shared/components/CustomScrollbar';

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const { removePlaylist } = useLibrary();
  const { isPlayer, play, onPlaylistChange } = usePlayer();
  const {
    playlistSongs, playlist, isOpenAction, loadingPlaylistSongs, playlistMeta, playlistItems,
    form, isEdit, setForm, setIsEdit, setIsOpenAction, getPlaylist, updatePlaylist,
    getPlaylistTracks, addSongToPlaylist, onChangeVisibility, removeSongFromPlaylist
  } = usePlaylist();

  const [isRemove, setIsRemove] = useState(false);
  const [isSongSearch, setIsSongSearch] = useState(true);
  const [openBgEditor, setOpenBgEditor] = useState(false);
  const [layout, setLayout] = useState<PlaylistLayout>(PlaylistLayout.LIST);

  const [page, setPage] = useState(0);
  const [toasterTime, setToasterTime] = useState(2500);
  const [isViewTrack, setIsViewTrack] = useState(false);
  const [activeItem, setActiveItem] = useState<PlaylistSong | null>(null);

  const navigate = useNavigate();

  const coverInputRef = useRef<HTMLInputElement>(null);

  const cover = form.fileUrl || form.cover;

  const isPlaylistOwner = useMemo(() => (
    user && playlist ? user.id === playlist.user?.id : false
  ), [user, playlist]);

  const colors = useMemo(() => ({
    bg: form.bgColor, // #0070E0FF, #0009, #535353
    base: form.gradientColor, // #00218FFF, #131313
    base70: convertColor(form.gradientColor, 'hsl', 70) // rgba(0, 33, 143, 0.7)
  }), [form, playlist]);

  const onRemoveSongFromPlaylist = async (id: string) => {
    if (!id) return;

    const ok = await removeSongFromPlaylist(id);
    if (!ok) return;

    setActiveItem(null);
    setToasterTime(3500);

    toast(
      <div className="flex items-center gap-2 p-2 pr-3 min-w-10 rounded-lg bg-black">
        <div className="bg-[#333333] min-w-10 w-10 h-10 rounded overflow-hidden relative">
          <MusicIcon
            className="absolute top-1/2 left-1/2 -translate-1/2"
            size={20}
          />
        </div>
        <div>
          <span
            className="line-clamp-1 font-medium"
            title={activeItem?.song?.title}
          >
            {activeItem?.song?.title}
          </span>
          <span className="text-sm block text-red-500">
            Se quitó de la lista
          </span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (playlistId) {
      getPlaylist(playlistId);
      getPlaylistTracks(playlistId).then((data) => {
        setIsSongSearch(data?.items.length === 0);
      });
    }
  }, [playlistId]);

  return (
    <div className={`${STYLES.maxHeightMain} text-white select-none relative overflow-hidden`}>
      <CustomScrollbar
        scrollbarMode="vertical"
        viewport={{
          className: `${STYLES.maxHeightMain} ${STYLES.minHeightMain} animate-fade-in relative`,
          style: {
            minHeight: "calc(100dvh - 64px - 88px)",
            maxHeight: "calc(100dvh - 64px - 88px)"
          }
        }}
      >
        <PlaylistCard
          form={form}
          colors={colors}
          playlist={playlist}
          coverInputRef={coverInputRef}
          isPlaylistOwner={isPlaylistOwner}
          setIsEdit={setIsEdit}
          setForm={setForm}
        />

        <PlaylistActionBar
          form={form}
          colors={colors}
          layout={layout}
          playlist={playlist}
          isPlaylistOwner={isPlaylistOwner}
          playable={playlistSongs.length > 0}
          onPlay={() => play(playlistSongs, 0, playlistMeta)}
          onChangeVisibility={() => playlistId && onChangeVisibility(playlistId)}
          setOpenBgEditor={setOpenBgEditor}
          setIsRemove={setIsRemove}
          setIsEdit={setIsEdit}
          setLayout={setLayout}
        />

        {(!isSongSearch && !playlistSongs.length && isPlaylistOwner) && (
          <div className="text-white ml-auto flex-1 flex">
            <button
              onClick={() => setIsSongSearch(true)}
              className="z-2 font-bold py-1 px-2 my-5 ml-auto mr-6 text-white text-xs rounded-full"
              type="button"
              disabled={false}
            >
              Buscar más
            </button>
          </div>
        )}

        {(playlistSongs.length > 0 && !isSongSearch) && (
          <section className="sm:px-5 p-1 animate-fade-in z-50">
            <PlaylistSongs
              items={playlistItems}
              playlistMeta={playlistMeta}
              onPlay={(index) => {
                onPlaylistChange(playlist);
                play(playlistSongs, index, playlistMeta);
              }}
              getItem={(item) => {
                setActiveItem(item);
                setIsOpenAction(true);
              }}
              loadMore={() => {
                if (page > playlistMeta.totalPages || loadingPlaylistSongs) return;
                const nextPage = page + 1;
                getPlaylistTracks(playlistId!, { page: nextPage });
                setPage(nextPage);
              }}
            />

            {isPlaylistOwner && (
              <div className="text-white ml-auto flex-1 flex">
                <button
                  onClick={() => setIsSongSearch(true)}
                  className="font-bold py-1 px-2 my-5 text-white text-xs rounded-full ml-auto"
                  type="button"
                >
                  Buscar más
                </button>
              </div>
            )}
          </section>
        )}

        {(isSongSearch && isPlaylistOwner) && (
          <SearchSongsForPlaylist
            playlist={{
              id: playlistId!,
              name: form.name,
              cover
            }}
            addSongToPlaylist={addSongToPlaylist}
            setIsSongSearch={setIsSongSearch}
          />
        )}
      </CustomScrollbar>

      <BackgroundColor
        open={openBgEditor}
        bgColor={form.bgColor}
        gradientColor={form.gradientColor}
        setForm={setForm}
        onClose={() => setOpenBgEditor(false)}
        onSave={async () => {
          const data = await updatePlaylist(playlistId!, form);
          if (data?.id) setOpenBgEditor(false);
        }}
      />

      {isOpenAction && (
        <div
          onMouseLeave={() => setIsOpenAction(false)}
          className={`${!isPlayer ? 'md:right-15 right-2' : 'md:right-76 right-2'} w-45 z-100 bg-[#282828] rounded fixed bottom-22`}
        >
          <ActionMenu
            onClose={() => setIsOpenAction(false)}
            styles={{
              wrap: "min-w-[160px]"
            }}
            items={[{
              label: 'Añadir a lista',
              icon: (
                <PlusIcon size={18} />
              )
            },
            ...(!isPlaylistOwner ? [] : [{
              label: 'Quitar de la lista',
              icon: (
                <CircleMinusIcon size={18} />
              ),
              onAction: () => onRemoveSongFromPlaylist(activeItem?.id!)
            }]),
            ...[{
              label: 'Añadir a la cola',
              icon: (
                <ListPlusIcon size={18} />
              )
            }, {
              label: 'Ver pista',
              icon: (
                <Music2Icon size={18} />
              ),
              onAction: () => activeItem?.id && navigate(`${routes.tracks}/${activeItem.songId}`)
            }, {
              label: 'Compartir',
              icon: (
                <ShareIcon size={18} />
              )
            }]]}
          />
        </div>
      )}

      {isEdit && (
        <EditData
          form={form}
          playlist={playlist}
          coverImages={playlist?.coverImages || []}
          coverInputRef={coverInputRef}
          setForm={setForm}
          onChangeVisibility={() => onChangeVisibility(playlistId!)}
          onSave={() => updatePlaylist(playlistId!, form)}
          onClose={() => setIsEdit(false)}
        />
      )}

      {isRemove && (
        <DeleteConfirm
          isOpen={isRemove}
          playlistName={form.name}
          onClose={() => setIsRemove(false)}
          onConfirm={() => removePlaylist(playlistId!)}
        />
      )}

      {isViewTrack && (
        <TrackModal
          onUpdateSong={async () => { }}
          activeTrack={activeItem?.song || null}
          onClose={() => setIsViewTrack(false)}
        />
      )}

      <SonnerToaster
        duration={toasterTime}
        visibleToasts={1}
        position="bottom-center"
        toastOptions={{
          unstyled: true,
          style: { bottom: 80 }
        }}
      />
    </div>
  )
}

export default PlaylistPage;