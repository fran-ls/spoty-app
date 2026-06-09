import { Play, Heart, Clock, MusicIcon } from 'lucide-react';
import type { Song } from '../song.types';
import { usePlayer } from '../../../shared/context/PlayerContext';
import { formatTime } from '../../../shared/utils/formatTime';
import { getFmtDate } from '../../../shared/utils/getFormatDate';
import apiService from '../../../shared/services/api.service';
import { showMusicIcon } from '../../../shared/utils/showMusicIcon';

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  const { currentSong, play } = usePlayer();
  const isTrackLiked = true;

  return (
    <div className={`min-w-full overflow-auto pb-8`}>
      <div className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-3 mx-8 border-b border-white/10 text-[#adaaaa] text-sm font-bold tracking-wider select-none">
        <span>#</span>
        <span>Título</span>
        <span>Álbum</span>
        <span>Fecha de publicación</span>
        <div className="flex justify-end pr-1">
          <Clock size={16} />
        </div>
      </div>

      <div className="px-8 flex flex-col gap-1 animate-fade-in">
        {songs.map((track, i) => {
          const isCurrentPlayingNow = currentSong?.id === track.id;
          const cover = apiService.songCoverUrl(track.id, track.cover);

          return (
            <div
              onClick={() => play(songs, i)}
              className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-2.5 items-center rounded-lg hover:bg-white/5 group cursor-pointer transition-colors duration-200 song-item"
              key={track.id}
            >
              {/* # column - shows number or nice Play/Pause icon on hover */}
              <div className={`${isCurrentPlayingNow ? 'text-primary' : 'text-[#adaaaa] hover:text-[#72fe8f]'} text-sm font-medium flex items-center`}>
                <span className="group-hover:hidden select-none">{i + 1}</span>
                <Play
                  className="hidden group-hover:block text-white"
                  fill="currentColor"
                  stroke="none"
                  size={13}
                />
              </div>

              {/* TITLE column - thumb, name status highlights */}
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
                      alt=""
                    />
                  )}
                </div>

                <div className="flex flex-col min-w-0 select-none">
                  <span
                    className={`font-semibold truncate text-sm leading-tight ${isCurrentPlayingNow ? 'text-primary' : 'text-white'
                      }`}
                    title={track.title}
                  >
                    {track.title}
                  </span>
                  <span className="text-[#adaaaa] text-xs truncate hover:text-white hover:underline mt-0.5">
                    {track.artist?.name}
                  </span>
                </div>
              </div>

              <div className="text-[#adaaaa] text-sm truncate hover:text-white transition-colors select-none">
                {track.albumId ?? 'Sin albúm'}
              </div>

              <div className="text-[#adaaaa] text-sm truncate select-none">
                {getFmtDate(track.createdAt, 'dd MMM yyyy')}
              </div>

              <div className="text-sm text-[#adaaaa] flex items-center justify-end gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-[#adaaaa] hover:text-white"
                  title="Like song"
                >
                  <Heart
                    size={15}
                    fill={isTrackLiked ? '#72fe8f' : 'transparent'}
                    className={isTrackLiked ? 'text-primary' : 'text-[#adaaaa] hover:text-[#72fe8f]'}
                  />
                </button>

                <span className="w-10 text-right pr-1 select-none">
                  {formatTime(track.duration)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SongList;