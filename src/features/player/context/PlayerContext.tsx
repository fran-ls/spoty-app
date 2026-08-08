import { createContext, useRef, useState } from 'react'
import type { Playlist } from '../../playlist/playlist.types';
import type { Player } from '../../player/player.types';
import type { Song } from '../../song/song.types';
import type { PaginationMeta } from '../../../shared/types/common.types';
import songService from '../../song/services/song.service';
import playerService from '../../player/services/player.service';
import { paginationMeta } from '../../../shared/data/search.data';

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'create-playlist' | 'songs';

interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>,
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  prevVolume: number;
  isMuted: boolean;
  isQueue: boolean;
  queue: Song[];
  queueMeta: PaginationMeta;
  currentPlaylist: Playlist | null;
  isRepeat: boolean;
  isShuffle: boolean;
  player: Player | null;
  playingTracks: Song[];
  isPlayer: boolean;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  volumeSeek: (time: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  updatePlayer: (data: Partial<Player>) => Promise<any>;
  play: (tracks: Song[], index: number, meta: PaginationMeta) => void;
  playQueueSong: (track: Song, index: number) => void;
  onPlayerChange: (player: Player | null) => void;
  onPlaylistChange: (playlist: Playlist | null) => void;
  resetPlayer: () => void;
  shuffleTracks: () => void;
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setPrevVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQueue: React.Dispatch<React.SetStateAction<boolean>>;
  setQueueMeta: React.Dispatch<React.SetStateAction<PaginationMeta>>;
  setCurrentPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsRepeat: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayingTracks: React.Dispatch<React.SetStateAction<Song[]>>;
  setIsPlayer: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlayerContext = createContext<PlayerContextType>({
  audioRef: {
    current: null
  },
  player: null,
  isRepeat: false,
  isShuffle: false,
  currentSong: null,
  currentIndex: 0,
  progress: 0,
  duration: 0,
  volume: 1,
  prevVolume: 1,
  isMuted: false,
  isQueue: true,
  isPlaying: false,
  isPlayer: false,
  queue: [],
  queueMeta: paginationMeta,
  currentPlaylist: null,
  playingTracks: [],
  play: () => { },
  next: () => { },
  prev: () => { },
  seek: () => { },
  volumeSeek: () => { },
  togglePlay: () => { },
  playQueueSong: () => { },
  setIsPlaying: () => { },
  setIsMuted: () => { },
  toggleMute: () => { },
  setVolume: () => { },
  setPrevVolume: () => { },
  setQueueMeta: () => { },
  setIsQueue: () => { },
  setQueue: () => { },
  setCurrentPlaylist: () => { },
  toggleShuffle: () => { },
  toggleRepeat: () => { },
  setProgress: () => { },
  setIsRepeat: () => { },
  setIsShuffle: () => { },
  setDuration: () => { },
  setPlayer: () => { },
  updatePlayer: async () => { },
  onPlaylistChange: () => { },
  onPlayerChange: () => { },
  resetPlayer: () => { },
  setPlayingTracks: () => { },
  shuffleTracks: () => { },
  setIsPlayer: () => { }
});

export const PlayerProvider = ({ children }: any) => {
  const [isQueue, setIsQueue] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueMeta, setQueueMeta] = useState<PaginationMeta>(paginationMeta);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  const [isPlayer, setIsPlayer] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(1);

  // const [unplayedTracks, setUnplayedTracks] = useState<Record<string, number>>({});
  const [playingTracks, setPlayingTracks] = useState<Song[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;

  const [player, setPlayer] = useState<Player | null>(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const playQueueSong = (track: Song, index: number) => {
    if (!audio) return;
    setCurrentIndex(index);
    setCurrentSong(track);
    setDuration(track.duration);
    seek(0);

    audio.src = songService.streamUrl(track.id, track.fileUrl);
    audio.play();
    setIsPlaying(true);

    updatePlayer({ songId: track.id });
  }

  const seek = (time: number) => {
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  }

  const volumeSeek = (vol: number) => {
    if (!audio) return;
    audio.volume = vol;
    setVolume(vol);
    if (vol) setIsMuted(false);
  }

  const play = (tracks: Song[], index: number, meta: PaginationMeta) => {
    if (!audio) return;
    const track = tracks[index];
    setQueue(tracks);
    setPlayingTracks(structuredClone(tracks));
    setQueueMeta({ ...queueMeta, ...meta });
    playQueueSong(track, index);
  }

  const togglePlay = () => {
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }

  const next = () => {
    if (isShuffle) return shuffleTracks();

    const lastIndex = queue.length - 1;
    if (currentIndex >= lastIndex && !isRepeat) {
      if (isPlaying && Math.round(progress) !== Math.round(duration)) return;
      audio?.pause();
      setIsPlaying(false);
      return;
    }

    const newIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
    const track = queue[newIndex];

    setCurrentIndex(newIndex);
    setCurrentSong(track);

    if (!isPlaying && currentIndex !== lastIndex) {
      setIsPlaying(true);
    }

    if (audio && track) {
      audio.src = songService.streamUrl(track.id, track.fileUrl);
      audio.play();
    }

    updatePlayer({ songId: track.id });
  }

  const prev = () => {
    if (isShuffle) return shuffleTracks();

    if (currentIndex <= 0 && !isRepeat) return;

    const newIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    const track = queue[newIndex];

    setCurrentIndex(newIndex);
    setCurrentSong(track);

    if (!isPlaying && currentIndex !== 0) {
      setIsPlaying(true);
    }

    if (audio && track) {
      audio.src = songService.streamUrl(track.id, track.fileUrl);
      audio.play();
    }

    updatePlayer({ songId: track.id });
  }

  const toggleMute = () => {
    if (!audio) return;

    if (isMuted) {
      audio.volume = prevVolume;
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }

  const toggleShuffle = () => {
    const shuffle = !isShuffle;
    setIsShuffle(shuffle);
    updatePlayer({ shuffle });
  }

  const toggleRepeat = () => {
    const repeat = !isRepeat;
    setIsRepeat(repeat);
    updatePlayer({ repeat });
  }

  async function updatePlayer(data: Partial<Player>) {
    if (!player?.id) return;

    return await playerService.updatePlayer(player.id, {
      repeat: isRepeat,
      shuffle: isShuffle,
      songId: currentSong?.id || null,
      progress,
      ...data
    });
  }

  const onPlaylistChange = (playlist: Playlist | null) => {
    setCurrentPlaylist(playlist);

    if (playlist) {
      updatePlayer({ playlistId: playlist.id });
    }
  }

  const onPlayerChange = (player: Player | null) => {
    if (!player) {
      setPlayer(null);
      return;
    }

    setPlayer(player);

    if (player.playlist) {
      setCurrentPlaylist(player.playlist);
    }

    const vol = player.volume / 100;
    const song = player.song;

    setIsShuffle(player.shuffle);
    setIsRepeat(player.repeat);
    seek(player.progress);
    volumeSeek(vol);

    if (audio) {
      if (song) audio.src = songService.streamUrl(song.id, song.fileUrl);
      audio.volume = vol;
    }

    if (!song) return;
    setQueue([song]);
    setCurrentIndex(0);
    setCurrentSong(song);
  }

  const resetPlayer = () => {
    setPlayer(null);
    setQueue([]);
    setCurrentIndex(0);
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setCurrentPlaylist(null);
    setQueueMeta(paginationMeta);

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  const shuffleTracks = () => {
    if (!playingTracks.length && !isRepeat) {
      if (isPlaying && Math.round(progress) !== Math.round(duration)) return;
      audio?.pause();
      setIsPlaying(false);
      return;
    }

    const tracks = !playingTracks.length ? [...queue] : playingTracks;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const track = tracks[randomIndex];
    setPlayingTracks(tracks.filter((t) => t.id !== track.id));
    setCurrentSong(track);

    if (audio && track) {
      audio.src = songService.streamUrl(track.id, track.fileUrl);
      audio.play();
      setIsPlaying(true);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        currentSong, currentIndex,
        isRepeat, setIsRepeat,
        isShuffle, setIsShuffle,
        progress, setProgress,
        duration, setDuration,
        player, setPlayer,
        queue, setQueue,
        isPlaying, setIsPlaying,
        volume, setVolume,
        prevVolume, setPrevVolume,
        isMuted, setIsMuted,
        isQueue, setIsQueue,
        queueMeta, setQueueMeta,
        currentPlaylist, setCurrentPlaylist,
        playingTracks, setPlayingTracks,
        isPlayer, setIsPlayer,
        play, togglePlay,
        next, prev,
        seek, volumeSeek,
        toggleMute,
        playQueueSong,
        toggleShuffle,
        toggleRepeat,
        updatePlayer,
        onPlaylistChange,
        onPlayerChange,
        resetPlayer,
        shuffleTracks
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}