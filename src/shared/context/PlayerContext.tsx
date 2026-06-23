import { createContext, useContext, useMemo, useRef, useState } from 'react'
import type { PlaylistMeta } from '../../features/playlist/playlist.types';
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
  isMuted: boolean;
  isQueue: boolean;
  queue: Song[];
  queueMeta: PlaylistMeta;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  play: (tracks: Song[], index: number, meta: PlaylistMeta) => void;
  playQueueSong: (track: Song, index: number) => void;
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQueue: React.Dispatch<React.SetStateAction<boolean>>;
  setQueueMeta: React.Dispatch<React.SetStateAction<PlaylistMeta>>;
}

export const PlayerContext = createContext<PlayerContextType>({
  currentSong: null,
  currentIndex: 0,
  progress: 0,
  duration: 0,
  volume: 1,
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
  setQueueMeta: () => { },
  setIsQueue: () => { },
  setQueue: () => { },
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playQueueSong = async (track: Song, index: number) => {
    if (!audioRef.current) return;

    setCurrentIndex(index);
    setCurrentSong(track);

    audioRef.current.src = songService.streamUrl(track.id, track.fileUrl);
    audioRef.current.play();

    setIsPlaying(true);
  }

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }

  const play = (tracks: Song[], index: number, meta: PlaylistMeta) => {
    if (!audioRef.current) return;
    const track = tracks[index];
    setQueue(tracks);
    setQueueMeta(meta);
    playQueueSong(track, index);
  }

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
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

    if (audioRef.current) {
      audioRef.current.src = songService.streamUrl(track.id, track.fileUrl);
      audioRef.current.play();
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

    if (audioRef.current) {
      audioRef.current.src = songService.streamUrl(track.id, track.fileUrl);
      audioRef.current.play();
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
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // useEffect(() => {
  //   if (audioRef.current) {
  //     audioRef.current.volume = volume;
  //   }
  // }, [volume]);

  return (
    <PlayerContext.Provider
      value={{
        progress, duration,
        currentSong, currentIndex,
        queue, setQueue,
        isPlaying, setIsPlaying,
        volume, setVolume,
        isMuted, setIsMuted,
        isQueue, setIsQueue,
        queueMeta, setQueueMeta,
        play, togglePlay,
        next, prev,
        seek, toggleMute,
        playQueueSong
      }}
    >
      {children}

      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (!audioRef.current) return;
          setProgress(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          setDuration(audioRef.current.duration);
        }}
        onEnded={next} // 🔥 autoplay siguiente,
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
