import { CircleMinusIcon, ListPlusIcon, Music2Icon, PlusIcon, ShareIcon } from "lucide-react";
import type { Track } from "../song.types";
import ActionMenu from "../../../shared/components/ActionMenu";
import usePlayer from "../../player/hooks/usePlayer";
import { routes } from "../../../shared/utils/routes";

interface SongActionsMenuProps {
  track: Track | null;
  isPlaylistOwner: boolean;
  unbox?: boolean;
  index?: number;
  onClose: () => void;
}

const SongActionsMenu = (props: SongActionsMenuProps) => {
  const { track, isPlaylistOwner, index, unbox = false, onClose } = props;
  const { queue, setQueue } = usePlayer();

  const items = [{
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
    onAction: () => onClose()
  }]),
  ...[{
    label: 'Añadir a la cola',
    icon: (
      <ListPlusIcon size={18} />
    ),
    onAction: () => {
      if (queue.includes(track!)) return;
      setQueue([...queue, track!]);
      onClose();
    }
  }, {
    link: track?.id && `${routes.tracks}/${track.id}`,
    label: 'Ver pista',
    icon: (
      <Music2Icon size={18} />
    ),
  }, {
    label: 'Compartir',
    icon: (
      <ShareIcon size={18} />
    ),
    onAction: () => onClose()
  }]];

  return unbox ? (
    <ActionMenu
      onClose={onClose}
      styles={{
        wrap: "min-w-[160px]"
      }}
      items={items}
    />
  ) : (
    <div
      className={`z-3 absolute right-1 shadow-[0_16px_24px_#0000004d,0_6px_8px_#0003] ${index != null ? index > 1 ? 'bottom-1' : 'top-1' : ''}`}
      onMouseLeave={() => onClose()}
    >
      <ActionMenu
        onClose={onClose}
        styles={{
          wrap: "min-w-[160px]"
        }}
        items={items}
      />
    </div>
  )
}

export default SongActionsMenu;