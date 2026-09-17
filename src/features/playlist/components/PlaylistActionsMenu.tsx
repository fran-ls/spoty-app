import { useEffect, useState } from "react";
import { CircleMinusIcon, EllipsisIcon, GlobeIcon, ListPlusIcon, LockIcon, PaletteIcon, PenIcon } from "lucide-react";
import type { Playlist, PlaylistDTO } from "../playlist.types";
import ActionMenu from "../../../shared/components/ActionMenu";
import usePlayer from "../../player/hooks/usePlayer";
import usePlaylist from "../hooks/usePlaylist";

interface PlaylistActionsMenuProps {
  form: PlaylistDTO;
  playlist: Playlist | null;
  playable: boolean;
  isPlaylistOwner: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemove: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenBgEditor: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeVisibility: () => void;
}

const PlaylistActionsMenu = (props: PlaylistActionsMenuProps) => {
  const {
    playlist, form, isPlaylistOwner, playable, setIsEdit,
    setIsRemove, setOpenBgEditor, onChangeVisibility
  } = props;
  const { queue, currentPlaylist, setQueue, setQueueMeta, onPlaylistChange } = usePlayer();
  const { getPlaylistTracks } = usePlaylist();

  const [isPlaylistMenu, setIsPlaylistMenu] = useState(false);

  async function addToQueue() {
    if (!playlist?.id || !playable || playlist.id === currentPlaylist?.id) return;
    const data = await getPlaylistTracks(playlist.id);
    if (!data || !data.songs.length) return;
    setQueue([...queue, ...data.songs]);
    setQueueMeta(data.meta);
    onPlaylistChange(playlist);
  }

  useEffect(() => {
    return () => setIsPlaylistMenu(false);
  }, [form]);

  return (
    <div className="max-[500px]:order-3 relative">
      <button
        onClick={() => setIsPlaylistMenu((prev) => !prev)}
        className="flex items-center justify-center h-8 cursor-pointer"
        type="button"
      >
        <EllipsisIcon className="min-[500px]:w-8 min-[500px]:h-8 min-[500px]:rotate-0 w-6 h-6 rotate-90" />
      </button>

      {isPlaylistMenu && (
        <div
          onMouseLeave={() => setIsPlaylistMenu(false)}
          className="z-10 absolute bottom-10 left-0"
        >
          <ActionMenu
            onClose={() => setIsPlaylistMenu(false)}
            styles={{
              wrap: "min-w-[170px] shadow-[0_16px_24px_#0000004d,0_6px_8px_#0003]"
            }}
            items={[
              ...(!isPlaylistOwner ? [] : [{
                label: 'Fondo',
                icon: (
                  <PaletteIcon size={18} />
                ),
                onAction: () => setOpenBgEditor(true)
              }, {
                label: 'Editar datos',
                icon: (
                  <PenIcon size={18} />
                ),
                onAction: () => {
                  setIsEdit(true);
                  setIsPlaylistMenu(false);
                  setOpenBgEditor(false);
                  setIsRemove(false);
                }
              }, {
                label: 'Eliminar',
                icon: (
                  <CircleMinusIcon size={18} />
                ),
                onAction: () => {
                  setIsEdit(false);
                  setIsPlaylistMenu(false);
                  setOpenBgEditor(false);
                  setIsRemove(true);
                }
              }, {
                label: `Hacer ${form.isPublic ? 'privada' : 'pública'}`,
                icon: (
                  !form.isPublic
                    ? <GlobeIcon size={18} />
                    : <LockIcon size={18} />
                ),
                onAction: () => onChangeVisibility()
              }]),
              ...(!playable ? [] : [{
                label: 'Añadir a la cola',
                icon: (
                  <ListPlusIcon size={18} />
                ),
                onAction: () => addToQueue()
              }])
            ]}
          />
        </div>
      )}
    </div>
  )
}

export default PlaylistActionsMenu;