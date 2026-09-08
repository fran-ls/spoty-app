import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import usePlayer from '../../player/hooks/usePlayer';
import { convertColor } from '../../playlist/utils/convertColor';
import { STYLES } from '../../../shared/utils/styles';
import type { Song } from '../song.types';
import songService from '../services/song.service';
import SongCard from '../components/SongCard';
import SongActionBar from '../components/SongActionBar';
import { paginationMeta } from '../../../shared/data/search.data';
import { playlistBg } from '../../../shared/data/stylePresets';

const SongPage = () => {
  const { id } = useParams();
  const { play, onPlaylistChange } = usePlayer();

  const [song, setSong] = useState<Song | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);

  const colors = useMemo(() => ({
    bg: playlistBg.bgColor,
    base: playlistBg.gradientColor,
    base70: convertColor(playlistBg.gradientColor, 'hsl', 70)
  }), []);

  useEffect(() => {
    if (id) {
      songService.searchSongs({ id }).then(({ data }) => {
        const s = data?.items[0];
        if (s) setSong(s);
      })
    }
  }, [id]);

  return (
    <div className={`${STYLES.maxHeightMain} text-white select-none relative overflow-hidden`}>
      <div className={`${STYLES.maxHeightMain} ${STYLES.minHeightMain} overflow-auto animate-fade-in relative`}>
        <SongCard
          song={song}
          colors={colors}
          coverInputRef={coverInputRef}
        />

        <SongActionBar
          song={song}
          colors={colors}
          playable={!!song}
          onPlay={() => {
            if (!song) return;
            play([song], 0, paginationMeta);
            onPlaylistChange(null);
          }}
        />
      </div>
    </div>
  )
}

export default SongPage;