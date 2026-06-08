import React, { useEffect, useState } from 'react';
import type { Song } from '../song.types';
import apiService from '../../../shared/services/api.service';
import { STYLES } from '../../../shared/utils/styles';
import NewPlaylistPageGradient from '../../playlist/pages/NewPlaylistPageGradient';
import SongList from '../components/SongList';
import SongListEmpty from '../components/SongListEmpty';

const SongPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [gradientCSS, setGradientCSS] = useState<string>('');

  const bgColor = '#0a0808'; // #131313, #000000, #3a3a3a, #0a0808

  useEffect(() => {
    apiService.searchSongs({ artistName: 'lady gaga' }).then(({ data }) => setSongs(data));
  }, []);

  return (
    <div className={`${STYLES.minHeightMain} min-w-full text-white select-none scroll-smooth animate-fade-in relative`}>
      <NewPlaylistPageGradient
        isSearch={false}
        gradientCSS={gradientCSS}
        setGradientCSS={setGradientCSS}
      >
        <div
          style={{
            background: `linear-gradient(to bottom, ${bgColor ? `${bgColor}55` : '#1c1c1c'} 0%, #121212 400px, #0e0e0e 100%)`
          }}
          className={`bg-transparent text-white select-none scroll-smooth animate-fade-in`}
        >
          {songs.length === 0 ? (
            <SongListEmpty />
          ) : (
            <SongList songs={songs} />
          )}
        </div>
      </NewPlaylistPageGradient>
    </div>
  )
}

export default SongPage;