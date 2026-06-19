import { MusicIcon } from 'lucide-react';
import type { Song } from '../song.types';
import type { SearchMeta } from '../../../shared/types/common.types';
import { usePlayer } from '../../../shared/context/PlayerContext';
import { showMusicIcon } from '../../../shared/utils/showMusicIcon';
import Loader from '../../../shared/components/Loader';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import songService from '../services/song.service';

interface SearchSongListProps {
  songs: Song[];
  searchMeta: SearchMeta;
  loadMore: () => void;
  addSongToPlaylist: (id: string) => void;
}

const SearchSongList: React.FC<SearchSongListProps> = (props) => {
  const { songs, searchMeta, loadMore, addSongToPlaylist } = props;
  const { currentSong } = usePlayer();
  const { loaderRef } = useInfiniteScroll(() => loadMore());

  return (
    <div className="flex flex-col gap-1 animate-fade-in bg-[#131313] overflow-hidden">
      {songs.map((track) => {
        const isCurrentPlayingNow = currentSong?.id === track.id;
        const cover = songService.songCoverUrl(track.id, track.cover);

        return (
          <div
            className="grid grid-cols-[minmax(200px,2fr)_minmax(120px,1fr)_120px] gap-4 p-2.5 items-center rounded hover:bg-white/5 group transition-colors duration-200 song-item"
            key={track.id}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="min-w-10 w-10 h-10 bg-[#262626] text-white rounded overflow-hidden relative">
                <MusicIcon
                  className={`${!cover ? '' : 'hidden opacity-0'} absolute top-1/2 left-1/2 -translate-1/2 music-icon`}
                  size={20}
                />

                {cover && (
                  <img
                    onError={(e) => showMusicIcon(e.currentTarget, '.song-item')}
                    className="w-full h-full object-cover"
                    src={cover}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    alt=""
                  />
                )}
                {track.title}
              </div>

              <div className="flex flex-col min-w-0 select-none">
                <span
                  className={`block font-semibold truncate text-sm leading-tight ${isCurrentPlayingNow ? 'text-primary' : 'text-white'
                    }`}
                  title={track.title}
                >
                  {track.title}
                </span>
                <span
                  className="block line-clamp-1 w-full text-[#adaaaa] text-xs truncate hover:text-white hover:underline mt-0.5"
                  title={track.artist?.name}
                >
                  {track.artist?.name}
                </span>
              </div>
            </div>

            <div className="text-[#adaaaa] text-sm truncate hover:text-white transition-colors select-none">
              {track.albumId ?? 'Sin albúm'}
            </div>

            <div className="text-sm text-white flex items-center justify-end gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addSongToPlaylist(track.id);
                }}
                className="hover:bg-[#0e0e0e] font-semibold px-4 py-1.5 border border-white/40 rounded-full duration-200 cursor-pointer hover:border-white hover:text-white"
              >
                Añadir
              </button>
            </div>
          </div>
        )
      })}

      {searchMeta.page < searchMeta.totalPages &&
        <div
          className="flex items-center justify-center px-6 py-1 overflow-hidden"
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
  )
}

export default SearchSongList;