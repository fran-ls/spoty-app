import { createContext, useContext, useRef, useState } from 'react'
import type { Playlist, PlaylistMeta } from '../../features/playlist/playlist.types';
import type { Player } from '../../features/player/player.types';
import type { Song } from '../../features/song/song.types';
import songService from '../../features/song/services/song.service';
import playerService from '../../features/player/services/player.service';

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
  queueMeta: PlaylistMeta;
  currentPlaylist: Playlist;
  isRepeat: boolean;
  isShuffle: boolean;
  player: Player | null;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  volumeSeek: (time: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  updatePlayer: (data: Partial<Player>) => Promise<any>;
  play: (tracks: Song[], index: number, meta: PlaylistMeta) => void;
  initPlayer: (tracks: Song[], index: number, meta?: PlaylistMeta) => void;
  playQueueSong: (track: Song, index: number) => void;
  onPlayerChange: (player: Player) => void;
  resetPlayer: () => void;
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setPrevVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQueue: React.Dispatch<React.SetStateAction<boolean>>;
  setQueueMeta: React.Dispatch<React.SetStateAction<PlaylistMeta>>;
  setCurrentPlaylist: React.Dispatch<React.SetStateAction<Playlist>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsRepeat: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>;
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
  queue: [],
  queueMeta: {
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    totalDuration: 0,
    playlistId: ''
  },
  currentPlaylist: {
    id: '',
    name: '',
    description: '',
    cover: '',
    isPublic: false,
    gradientColor: '',
    bgColor: '',
    userId: '',
    createdAt: ''
  },
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
  initPlayer: () => { },
  setPlayer: () => { },
  updatePlayer: async () => { },
  onPlayerChange: () => { },
  resetPlayer: () => { }
});

export const PlayerProvider = ({ children }: any) => {
  const [isQueue, setIsQueue] = useState(true);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueMeta, setQueueMeta] = useState<PlaylistMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalDuration: 0,
    playlistId: ''
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(1);

  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>({
    id: '',
    name: '',
    description: '',
    cover: '',
    isPublic: false,
    gradientColor: '',
    bgColor: '',
    userId: '',
    createdAt: ''
  });

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
    updatePlayer({ volume: Math.round(vol * 100) });
  }

  const play = (tracks: Song[], index: number, meta: PlaylistMeta) => {
    if (!audio) return;
    const track = tracks[index];
    setQueue(tracks);
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
    // if (currentIndex >= queue.length - 1) return;

    const newIndex = currentIndex >= queue.length - 1 ? 0 : currentIndex + 1;
    const track = queue[newIndex];

    setCurrentIndex(newIndex);
    setCurrentSong(track);

    if (!isPlaying && currentIndex !== queue.length - 1) {
      setIsPlaying(true);
    }

    if (audio && track) {
      audio.src = songService.streamUrl(track.id, track.fileUrl);
      audio.play();
    }

    updatePlayer({ songId: track.id });
  }

  const prev = () => {
    // if (currentIndex <= 0) return;

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

  const initPlayer = (tracks: Song[], index: number, meta?: PlaylistMeta) => {
    const track = tracks[index] || null;
    setQueue(tracks);
    setQueueMeta({ ...queueMeta, ...meta });
    setCurrentIndex(index);
    setCurrentSong(track);

    if (audio && track) {
      audio.src = songService.streamUrl(track.id, track.fileUrl);
      audio.volume = volume;
    }
  }

  const onPlayerChange = (player: Player) => {
    setIsRepeat(player.repeat);
    setIsShuffle(player.shuffle);
    seek(player.progress);
    volumeSeek(player.volume / 100);
    initPlayer(player.song ? [player.song] : [], 0);
  }

  const resetPlayer = () => {
    setPlayer(null);
    setQueue([]);
    setCurrentIndex(0);
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setCurrentPlaylist({
      id: '',
      name: '',
      description: '',
      cover: '',
      isPublic: false,
      gradientColor: '',
      bgColor: '',
      userId: '',
      createdAt: ''
    });
    setQueueMeta({
      page: 0,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      totalDuration: 0,
      playlistId: ''
    });

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
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
        play, togglePlay,
        next, prev,
        seek, volumeSeek,
        toggleMute,
        playQueueSong,
        toggleShuffle,
        toggleRepeat,
        updatePlayer,
        initPlayer,
        onPlayerChange,
        resetPlayer
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)!;

  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
}
