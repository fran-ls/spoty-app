import React, { useState } from 'react';
import { Play, Pause, Heart, EllipsisIcon, ListIcon } from 'lucide-react';
import { usePlayer } from '../../../shared/context/PlayerContext';
import ActionMenu from './ActionMenu';
import LayoutMenu from './LayoutMenu';

interface FooterProps {
  isPlay: boolean;
  isPublic: boolean;
  isBackground: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemove: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBackground: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeVisibility: () => void;
}

const Footer: React.FC<FooterProps> = (props) => {
  const {
    isBackground, isPublic, isPlay, setIsEdit, setIsBackground,
    onChangeVisibility, setIsRemove
  } = props;

  const { isPlaying, togglePlay } = usePlayer();

  const [isOpenAction, setIsOpenAction] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [playlistLiked, setPlaylistLiked] = useState<boolean>(false);

  return (
    <div className="text-sm text-[#adaaaa] flex items-center justify-between relative">
      <div className="flex items-center gap-6 flex-wrap" id="playlist-action-bar">
        <button
          onClick={togglePlay}
          disabled={!isPlay}
          className={`w-14 h-14 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black cursor-pointer ${!isPlay ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82]'
            }`}
          title="Reproducir lista"
        >
          {isPlaying ? (
            <Pause size={24} fill="currentColor" stroke="none" className="translate-x-0" />
          ) : (
            <Play size={24} fill="currentColor" stroke="none" className="translate-x-px" />
          )}
        </button>

        <button
          onClick={() => setPlaylistLiked(!playlistLiked)}
          className={`transition-all hover:scale-115 active:scale-90 cursor-pointer ${playlistLiked ? 'text-primary' : 'text-[#adaaaa] hover:text-white'
            }`}
          title="Like Playlist"
        >
          <Heart size={30} fill={playlistLiked ? '#72fe8f' : 'transparent'} />
        </button>
      </div>

      <div className="relative ml-5 mr-auto">
        <button
          onClick={() => setIsOpenAction(!isOpenAction)}
          className="h-8 px-2 hover:text-white cursor-pointer"
          type="button"
        >
          <EllipsisIcon className="w-8 h-8" />
        </button>

        {isOpenAction &&
          <ActionMenu
            isPublic={isPublic}
            onIsEdit={() => {
              setIsEdit(true);
              setIsOpenAction(false);
              setIsBackground(false);
              setIsRemove(false);
            }}
            onIsBackground={() => setIsBackground(!isBackground)}
            onClose={() => setIsOpenAction(!isOpenAction)}
            onChangeVisibility={onChangeVisibility}
            onRemove={() => {
              setIsEdit(false);
              setIsOpenAction(false);
              setIsBackground(false);
              setIsRemove(true);
            }}
          />
        }
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="font-semibold hover:text-white cursor-pointer h-8 px-2 flex items-center gap-2"
          type="button"
        >
          <span>Lista</span>
          <ListIcon className="inline-flex w-5 h-5" />
        </button>

        {isOpen &&
          <LayoutMenu onClose={() => setIsOpen(!isOpen)} />
        }
      </div>
    </div>
  )
}

export default Footer;