import { createContext, useContext, useMemo, useRef, useState } from 'react'
import type { Song } from '../../features/song/song.types';
import apiService from '../services/api.service'

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'create-playlist' | 'songs';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isQueue: boolean;
  queueTotal: number;
  seek: (time: number) => void;
  play: (songs: Song[], index: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  toggleMute: () => void;
  playQueueSong: (song: Song, index: number) => void;
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  setQueueTotal: React.Dispatch<React.SetStateAction<number>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQueue: React.Dispatch<React.SetStateAction<boolean>>;

  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null)

export const PlayerProvider = ({ children }: any) => {
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(1);
  const [isQueue, setIsQueue] = useState(true);

  const [currentView, setView] = useState<ViewType>('home');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playQueueSong = (track: Song, index: number) => {
    if (!audioRef.current) return;

    setCurrentIndex(index);
    setCurrentSong(track);

    audioRef.current.src = apiService.streamUrl(track.id);
    audioRef.current.play();

    setIsPlaying(true);
  }

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }

  const play = (tracks: Song[], index: number) => {
    if (!audioRef.current) return;
    const track = tracks[index];
    setQueue(tracks);
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
    const song = queue[newIndex];

    setCurrentIndex(newIndex);
    setCurrentSong(song);

    if (!isPlaying && currentIndex !== queue.length - 1) {
      setIsPlaying(true);
    }

    if (audioRef.current) {
      audioRef.current.src = apiService.streamUrl(song.id);
      audioRef.current.play();
    }
  }

  const prev = () => {
    // if (currentIndex <= 0) return;

    const newIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    const song = queue[newIndex];

    setCurrentIndex(newIndex);
    setCurrentSong(song);

    if (!isPlaying && currentIndex !== 0) {
      setIsPlaying(true);
    }

    if (audioRef.current) {
      audioRef.current.src = apiService.streamUrl(song.id);
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
        queueTotal, setQueueTotal,
        play, togglePlay,
        next, prev,
        seek, toggleMute,
        playQueueSong,

        currentView, setView
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
        onEnded={next} // 🔥 autoplay siguiente
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
