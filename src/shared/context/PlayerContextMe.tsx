import { createContext, useContext, useRef, useState } from 'react'
import apiService from '../services/api.service'

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'create-playlist' | 'songs';

interface Song {
  id: string
  title: string
  cover?: string
  artist: { name: string }
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  seek: (time: number) => void;
  play: (songs: Song[], index: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  toggleMute: () => void;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;

  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null)

export const PlayerProvider = ({ children }: any) => {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(0.75);

  const [currentView, setView] = useState<ViewType>('home');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }

  const play = (songs: Song[], index: number) => {
    if (!audioRef.current) return;

    const song = songs[index];

    setQueue(songs);
    setCurrentIndex(index);
    setCurrentSong(song);

    audioRef.current.src = apiService.streamUrl(song.id);
    audioRef.current.play();

    setIsPlaying(true);
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
    if (currentIndex >= queue.length - 1) return;

    const newIndex = currentIndex + 1;
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
    if (currentIndex <= 0) return;

    const newIndex = currentIndex - 1;
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

  return (
    <PlayerContext.Provider
      value={{
        progress,
        duration,
        currentSong,
        isPlaying,
        queue,
        currentIndex,
        volume,
        isMuted,
        seek,
        play,
        togglePlay,
        next,
        prev,
        setIsPlaying,
        setVolume,
        setIsMuted,
        toggleMute,

        currentView,
        setView,
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
  const context = useContext(PlayerContext);

  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context!;
}
