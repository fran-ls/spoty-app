import { createContext, useContext, useMemo, useRef, useState } from 'react'
import type { Playlist, PlaylistMeta } from '../../features/playlist/playlist.types';
import type { Song } from '../../features/song/song.types';
import songService from '../../features/song/services/song.service';

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'create-playlist' | 'songs';

interface PlayerContextType {
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
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  play: (tracks: Song[], index: number, meta: PlaylistMeta) => void;
  playQueueSong: (track: Song, index: number) => void;
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setPrevVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQueue: React.Dispatch<React.SetStateAction<boolean>>;
  setQueueMeta: React.Dispatch<React.SetStateAction<PlaylistMeta>>;
  setCurrentPlaylist: React.Dispatch<React.SetStateAction<Playlist>>;
}

export const PlayerContext = createContext<PlayerContextType>({
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
  setCurrentPlaylist: () => { }
});

export const PlayerProvider = ({ children }: any) => {
  const [isQueue, setIsQueue] = useState(true);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueMeta, setQueueMeta] = useState<PlaylistMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
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

  const playQueueSong = async (track: Song, index: number) => {
    if (!audio) return;
    setCurrentIndex(index);
    setCurrentSong(track);

    audio.src = songService.streamUrl(track.id, track.fileUrl);
    audio.play();
    setIsPlaying(true);
  }

  const seek = (time: number) => {
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  }

  const play = (tracks: Song[], index: number, meta: PlaylistMeta) => {
    if (!audio) return;
    const track = tracks[index];
    setQueue(tracks);
    setQueueMeta(meta);
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

    if (audio) {
      audio.src = songService.streamUrl(track.id, track.fileUrl);
      audio.play();
    }
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

    if (audio) {
      audio.src = songService.streamUrl(track.id, track.fileUrl);
      audio.play();
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }

  useMemo(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  return (
    <PlayerContext.Provider
      value={{
        progress, duration,
        currentSong, currentIndex,
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
        seek, toggleMute,
        playQueueSong
      }}
    >
      {children}

      <audio
        ref={audioRef}
        onTimeUpdate={() => audio && setProgress(audio.currentTime)}
        onLoadedMetadata={() => audio && setDuration(audio.duration)}
        onEnded={next} // 🔥 autoplay siguiente
        crossOrigin="anonymous"
      />
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
