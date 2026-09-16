import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import usePlayer from '../../player/hooks/usePlayer';
import { convertColor } from '../../playlist/utils/convertColor';
import { STYLES } from '../../../shared/utils/styles';
import type { Track } from '../song.types';
import songService from '../services/song.service';
import SongCard from '../components/SongCard';
import SongActionBar from '../components/SongActionBar';
import { paginationMeta } from '../../../shared/data/search.data';
import { playlistBg } from '../../../shared/data/stylePresets';
import BackgroundColor from '../../playlist/components/BackgroundColor';

const SongPage = () => {
  const { id } = useParams();
  const { play, onPlaylistChange } = usePlayer();

  const [track, setTrack] = useState<Track | null>(null);
  const [openBgEditor, setOpenBgEditor] = useState(false);
  const [form, setForm] = useState({
    title: '',
    artistId: '',
    bgColor: '',
    gradientColor: ''
  });

  const coverInputRef = useRef<HTMLInputElement>(null);

  const colors = useMemo(() => ({
    bg: form.bgColor,
    base: form.gradientColor,
    base70: convertColor(form.gradientColor, 'hsl', 70)
  }), [track, form]);

  useEffect(() => {
    if (!id) return;
    songService.searchSongs({ id }).then(({ data }) => {
      const s = data?.items[0];
      if (!s) return;
      setTrack(s);
      setForm({
        title: '',
        artistId: '',
        bgColor: s?.bgColor || playlistBg.bgColor,
        gradientColor: s?.bgBase || playlistBg.gradientColor
      });
    });
  }, [id]);

  return (
    <div className={`${STYLES.maxHeightMain} text-white select-none relative overflow-hidden`}>
      <div className={`${STYLES.maxHeightMain} ${STYLES.minHeightMain} overflow-auto animate-fade-in relative`}>
        <SongCard
          song={track}
          colors={colors}
          coverInputRef={coverInputRef}
        />

        <SongActionBar
          track={track}
          colors={colors}
          playable={!!track}
          setIsEdit={() => { }}
          setIsRemove={() => { }}
          setOpenBgEditor={setOpenBgEditor}
          onPlay={() => {
            if (!track) return;
            play([track], 0, paginationMeta);
            onPlaylistChange(null);
          }}
        />
      </div>

      <BackgroundColor
        open={openBgEditor}
        bgColor={form.bgColor}
        gradientColor={form.gradientColor}
        setForm={setForm as any}
        onClose={() => setOpenBgEditor(false)}
        onSave={async () => {
          if (!track?.id) return;
          const { data } = await songService.updateSong(track.id, {
            bgColor: form.bgColor,
            bgBase: form.gradientColor
          });
          if (data?.id) setOpenBgEditor(false);
        }}
      />
    </div>
  )
}

export default SongPage;