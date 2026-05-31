import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Track, Playlist } from '../types/music.types';
import { mockPlaylists, mockTracks } from '../data/music.data';
import apiService from '../services/api.service';

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'create-playlist' | 'songs';

interface PlayerContextType {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  selectedPlaylistId: string | null;
  openPlaylist: (playlistId: string) => void;
  activePlaylist: Playlist | null;

  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track, tracksQueue?: Track[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;

  progress: number;
  setProgress: (sec: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
  toggleMute: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  likedTrackIds: string[];
  toggleLikeTrack: (trackId: string) => void;

  isShuffle: boolean;
  toggleShuffle: () => void;
  isRepeat: boolean;
  toggleRepeat: () => void;

  allPlaylists: Playlist[];
  createPlaylist: (name: string, description: string, coverUrl: string, bgColor?: string, gradientColor?: string) => string;
  updatePlaylist: (id: string, updatedFields: Partial<Playlist>) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setViewState] = useState<ViewType>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  // Choose standard initial track from "Rock Classics" - Stairway to Heaven as in screenshot
  const [currentTrack, setCurrentTrack] = useState<Track | null>(mockTracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(mockTracks);
  const [queueIndex, setQueueIndex] = useState<number>(0);

  const [progress, setProgress] = useState<number>(165); // starts at 2:45 as in screenshot for Rock Classics
  const [volume, setVolume] = useState<number>(0.75);
  const [prevVolume, setPrevVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(['stairway', 'dreamon', 'sweetchild']);

  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Set active playlist when ID or playlists change
  useEffect(() => {
    if (selectedPlaylistId) {
      const found = playlists.find(p => p.id === selectedPlaylistId) ||
        playlists[0]; // fallback
      setActivePlaylist(found);
    } else {
      setActivePlaylist(null);
    }
  }, [selectedPlaylistId, playlists]);

  // Wrapper for switching view that clears specific contextual view choices if appropriate
  const setView = (view: ViewType) => {
    setViewState(view);
    if (view !== 'playlist') {
      // Keep selectedPlaylistId intact so we can return to it, but update view
    }
  }

  const openPlaylist = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setViewState('playlist');
  }

  const playTrack = (track: Track, tracksQueue?: Track[]) => {
    if (!audioRef.current) return;

    audioRef.current.src = apiService.streamUrl(track.id);
    audioRef.current.play();

    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);

    const activeQueue = tracksQueue || queue;
    setQueue(activeQueue);

    const idx = activeQueue.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      setQueueIndex(idx);
    } else {
      setQueue([...activeQueue, track]);
      setQueueIndex(activeQueue.length);
    }
  }

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  }

  const playNext = () => {
    if (queue.length === 0) return;

    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = 0; // Wrap around
    }

    setQueueIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setProgress(0);
  }

  const playPrevious = () => {
    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1; // Wrap around
    }

    setQueueIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setProgress(0);
  }

  // Simulated playback progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const limit = currentTrack.durationSec;
          if (prev >= limit) {
            if (isRepeat) {
              return 0; // repeat current track
            } else {
              // delay slightly and play next
              setTimeout(() => playNext(), 50);
              return prev;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [isPlaying, currentTrack, queueIndex, isShuffle, isRepeat]);

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

  const toggleLikeTrack = (trackId: string) => {
    setLikedTrackIds(prev => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  }

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  const createPlaylist = (name: string, description: string, coverUrl: string, bgColor?: string, gradientColor?: string) => {
    const id = `playlist_${Date.now()}`;
    const newPlaylist: Playlist = {
      id,
      name: name || 'My Playlist',
      description: description || 'A playlist curated by franklemus.',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60',
      creator: 'You',
      likes: '0 likes',
      songCount: 0,
      durationText: '0 min',
      tracks: [],
      bgColor: bgColor || '#2a3a4a',
      gradientColor: gradientColor || '#0e1217'
    }
    setPlaylists(prev => [newPlaylist, ...prev]);
    return id;
  }

  const updatePlaylist = (id: string, updatedFields: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields }
      }
      return p;
    }));
  }

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.tracks.some(t => t.id === track.id)) return p;
        const updatedTracks = [...p.tracks, track];
        const totalDurationSec = updatedTracks.reduce((sum, t) => sum + t.durationSec, 0);
        const mins = Math.floor(totalDurationSec / 60);
        const durationText = `${mins} min`;
        return {
          ...p,
          tracks: updatedTracks,
          songCount: updatedTracks.length,
          durationText
        }
      }
      return p;
    }));
  }

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const updatedTracks = p.tracks.filter(t => t.id !== trackId);
        const totalDurationSec = updatedTracks.reduce((sum, t) => sum + t.durationSec, 0);
        const mins = Math.floor(totalDurationSec / 60);
        const durationText = `${mins} min`;
        return {
          ...p,
          tracks: updatedTracks,
          songCount: updatedTracks.length,
          durationText
        }
      }
      return p;
    }));
  }

  return (
    <PlayerContext.Provider
      value={{
        currentView,
        setView,
        selectedPlaylistId,
        openPlaylist,
        activePlaylist,
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        progress,
        setProgress,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        searchQuery,
        setSearchQuery,
        likedTrackIds,
        toggleLikeTrack,
        isShuffle,
        toggleShuffle,
        isRepeat,
        toggleRepeat,
        allPlaylists: playlists,
        createPlaylist,
        updatePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
