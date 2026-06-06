import React, { useEffect, useState } from 'react';
import { Play, Pause, Heart, Clock, MusicIcon } from 'lucide-react';
import type { Song } from '../../shared/types/song.types';
import apiService from '../../shared/services/api.service';
import { usePlayer } from '../../shared/context/PlayerContextMe';
import { formatTime } from '../../shared/utils/formatTime';
import { getFmtDate } from '../../shared/utils/getFormatDate';
import { STYLES } from '../../shared/utils/styles';

const SongPage: React.FC = () => {
  const { currentSong, isPlaying, play, togglePlay } = usePlayer();

  const [playlistLiked, setPlaylistLiked] = useState<boolean>(false);
  const [songs, setSongs] = useState<Song[]>([]);

  const isTrackLiked = true;
  const playlist = { bgColor: '#000000' }

  useEffect(() => {
    apiService.searchSongs().then(({ data }) => setSongs(data));
  }, []);

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${playlist.bgColor ? `${playlist.bgColor}55` : '#1c1c1c'} 0%, #121212 400px, #0e0e0e 100%)`
      }}
      className={`${STYLES.minHeightMain} text-white select-none scroll-smooth animate-fade-in`}
      id="spotify-playlist-stage"
    >
      <div className="min-w-full">
        <div className="px-8 pt-6 pb-8 flex items-center gap-6 flex-wrap" id="playlist-action-bar">
          <button
            onClick={togglePlay}
            disabled={songs.length === 0}
            className={`w-14 h-14 rounded-full flex items-center justify-center scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-black cursor-pointer ${songs.length === 0 ? 'bg-[#adaaaa]/40 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#63ef82]'
              }`}
            title="Play Playlist"
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

        {/* Table */}
        <div className={`max-h-[calc(100vh-88px-64px-88px-24px)] min-h-[calc(100vh-88px-64px-88px-24px)] min-w-full  overflow-auto`}>
          <div className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-3 mx-8 border-b border-white/10 text-[#adaaaa] text-sm font-bold tracking-wider mb-4 select-none">
            <span>#</span>
            <span>Título</span>
            <span>Álbum</span>
            <span>Fecha de publicación</span>
            <div className="flex justify-end pr-1">
              <Clock size={16} />
            </div>
          </div>

          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-32 py-20 bg-white/3 rounded-xl border border-white/5 select-none animate-fade-in text-center">
              <p className="text-[#adaaaa] font-bold text-sm">No tracks inside this custom layout yet</p>
              <p className="text-xs text-[#adaaaa]/60 mt-1 max-w-md">
                Navigate to the <strong>Search Tab</strong> or home collections, click the context menus or like any specific track to list them here in real-time!
              </p>
              <button
                className="mt-6 px-5 py-2 bg-white text-black text-xs font-black rounded-full cursor-pointer hover:scale-105 transition-all"
              >
                Browse & Add Tracks
              </button>
            </div>
          ) : (
            <div className="px-8 flex flex-col gap-1 animate-fade-in">
              {songs.map((track, i) => {
                const isCurrentPlayingRow = currentSong?.id === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => play && play(songs, i)}
                    className="grid grid-cols-[40px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-2.5 items-center rounded-lg hover:bg-white/5 group cursor-pointer transition-colors duration-200"
                  >
                    {/* # column - shows number or nice Play/Pause icon on hover */}
                    <div className={`${isCurrentPlayingRow ? 'text-primary' : 'text-[#adaaaa] hover:text-[#72fe8f]'} text-sm font-medium flex items-center`}>
                      <span className="group-hover:hidden select-none">{i + 1}</span>
                      <Play size={13} fill="currentColor" stroke="none" className="hidden group-hover:block text-white" />
                    </div>

                    {/* TITLE column - thumb, name status highlights */}
                    <div className="flex items-center gap-4 overflow-hidden">
                      {track.cover
                        ?
                        <img
                          className="w-10 h-10 rounded-sm object-cover bg-[#262626] shadow"
                          src={track.cover}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                        :
                        <MusicIcon className="" />
                      }
                      <div className="flex flex-col min-w-0 select-none">
                        <span className={`font-semibold truncate text-sm leading-tight ${isCurrentPlayingRow ? 'text-primary' : 'text-white'
                          }`}>
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

                    {/* DURATION & LIKE column (Combines hover Like triggers nicely + Remove Action) */}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SongPage;