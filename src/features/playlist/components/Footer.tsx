import React, { useState } from 'react';
import { Play, Pause, Heart, EllipsisIcon, ListIcon, SearchIcon, XIcon, SearchXIcon } from 'lucide-react';
import type { SearchMeta } from '../../../shared/types/common.types';
import type { Song } from '../../song/song.types';
import { usePlayer } from '../../../shared/context/PlayerContext';
import ActionMenu from './ActionMenu';
import LayoutMenu from './LayoutMenu';

interface FooterProps {
  isPlay: boolean;
  isPublic: boolean;
  isBackground: boolean;
  songs: Song[];
  songMeta: SearchMeta;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemove: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBackground: React.Dispatch<React.SetStateAction<boolean>>;
  searchTracks: (query: string) => void;
  onChangeVisibility: () => void;
}

const Footer: React.FC<FooterProps> = (props) => {
  const {
    isBackground, isPublic, isPlay, songs, songMeta, searchTracks,
    setIsEdit, setIsBackground, onChangeVisibility, setIsRemove
  } = props;

  const { isPlaying, queueMeta, togglePlay, play } = usePlayer();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [playlistLiked, setPlaylistLiked] = useState(false);

  const [isSearch, setIsSearch] = useState(false);
  const [query, setQuery] = useState('');

  const isMobile = window.innerWidth < 768 && isSearch;

  const playlistId = 'song-list';

  return (
    <div className={`${isMobile ? 'overflow-hidden' : ''} text-sm text-[#adaaaa] flex items-center justify-between relativ`}>
      <div className="md:gap-6 gap-3 flex items-center flex-wrap" id="playlist-action-bar">
        <button
          onClick={() => {
            if (queueMeta.playlistId === playlistId) {
              return togglePlay();
            }

            play(songs, 0, { ...songMeta, playlistId: '', totalDuration: 0 })
          }}
          disabled={!isPlay}
          className={`md:max-w-14 md:max-h-14 w-[10vw] h-[10vw] max-w-10 max-h-10 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black cursor-pointer ${!isPlay ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82]'}`}
          title="Reproducir lista"
        >
          {(isPlaying && isPlay && playlistId === queueMeta.playlistId) ? (
            <Pause
              className="w-1/2 h-1/2 max-w-6 max-h-6 translate-x-0"
              fill="currentColor"
              stroke="none"
            />
          ) : (
            <Play
              className="w-1/2 h-1/2 max-w-6 max-h-6 translate-x-px"
              fill="currentColor"
              stroke="none"
            />
          )}
        </button>

        <button
          onClick={() => setPlaylistLiked(!playlistLiked)}
          className={`md:max-w-10 md:max-h-10 w-[10vw] h-[10vw] max-w-8 max-h-8 transition-all hover:scale-115 active:scale-90 cursor-pointer flex items-center justify-center ${playlistLiked ? 'text-primary' : 'text-[#adaaaa] hover:text-white'
            }`}
          title="Like Playlist"
        >
          <Heart className="md:w-[80%] md:h-[80%]" fill={playlistLiked ? '#72fe8f' : 'transparent'} />
        </button>
      </div>

      <div className="flex items-center relative ml-5 mr-auto">
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

      <div className={`${isMobile ? 'absolute left-0 w-full px-2' : 'relative'} text-[#adaaaa] flex items-center justify-between gap-1`}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsSearch(true);
          }}
          onBlur={() => !query && setIsSearch(false)}
          className={`${isSearch ? 'w-full bg-[#1f1f1f] rounded' : 'w-8 h-8 rounded-full'} ${isSearch ? 'md:h-fit h-10' : ''} md:max-w-100 z-5 transition-all duration-100 hover:bg-[#1f1f1f] px-2 py-1.5 text-sm cursor-pointer flex items-center`}
        >
          <SearchIcon className="min-w-4" size={18} strokeWidth={2.5} />

          <input
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              searchTracks(value);
            }}
            value={query}
            className="w-full ml-2"
            placeholder="Buscar canción"
            type="text"
          />

          {isSearch && query &&
            <XIcon
              className="min-w-4 w-5 h-5"
              onClick={() => {
                setQuery('');
                searchTracks('');
              }}
            />
          }
        </div>

        {isMobile && (
          <button
            onClick={() => setIsSearch(false)}
            className="bg-[#1f1f1f] z-1 rounded font-semibold min-w-10 w-10 h-10 hover:text-white cursor-pointer p-1.5 flex items-center gap-2"
            type="button"
          >
            <SearchXIcon className="block m-auto w-5 h-5" />
          </button>
        )}
      </div>

      <div className={`relative ${isMobile ? 'opacity-0' : ''}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="font-semibold hover:text-white cursor-pointer h-8 ml-2 flex items-center gap-2"
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