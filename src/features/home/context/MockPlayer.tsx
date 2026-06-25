import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Track, Playlist, Artist, Album } from '../music.types';
import { mockPlaylists, mockTracks, mockArtists, mockAlbums } from '../data/music.data';

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'create-playlist' | 'upload';

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
  isSmartShuffle: boolean;
  toggleSmartShuffle: () => void;
  isRepeat: boolean;
  toggleRepeat: () => void;

  queue: Track[];
  addToQueue: (track: Track) => void;
  toast: { message: string; show: boolean };
  showToast: (message: string) => void;

  isLyricsOpen: boolean;
  toggleLyrics: () => void;

  isMiniPlayer: boolean;
  toggleMiniPlayer: () => void;
  setIsMiniPlayer: (val: boolean) => void;

  allPlaylists: Playlist[];
  createPlaylist: (name: string, description: string, coverUrl: string, bgColor?: string, gradientColor?: string, isPrivate?: boolean) => string;
  updatePlaylist: (id: string, updatedFields: Partial<Playlist>) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  allTracks: Track[];
  addNewTrack: (track: Track) => void;
  allArtists: Artist[];
  addNewArtist: (artist: Artist) => void;
  allAlbums: Album[];
  addNewAlbum: (album: Album) => void;

  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (val: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Helper for dynamic genre and mood extraction
export function getTrackGenreAndMood(track: Track): { genre: string; mood: string } {
  if (track.genre && track.mood) {
    return { genre: track.genre, mood: track.mood };
  }

  const id = (track.id || '').toLowerCase();
  const title = (track.title || '').toLowerCase();
  const artist = (track.artist || '').toLowerCase();

  if (id.includes('stairway') || title.includes('stairway')) {
    return { genre: 'Rock', mood: 'Melancholic / Epic' };
  }
  if (id.includes('backinblack') || title.includes('back in black') || id.includes('ac/dc')) {
    return { genre: 'Rock', mood: 'Energetic / Aggressive' };
  }
  if (id.includes('dreamon') || title.includes('dream on')) {
    return { genre: 'Rock', mood: 'Dramatic / Trippy' };
  }
  if (id.includes('bohemian') || title.includes('bohemian')) {
    return { genre: 'Rock', mood: 'Dramatic / Epic' };
  }
  if (id.includes('sweetchild') || title.includes('sweet child')) {
    return { genre: 'Rock', mood: 'Energetic / Anthemic' };
  }
  if (id.startsWith('tb_') || title.includes('orbit') || title.includes('resonator')) {
    return { genre: 'Techno', mood: 'Hypnotic / Dark' };
  }
  if (id.startsWith('ef_') || title.includes('deep quantum') || title.includes('workspace')) {
    return { genre: 'Ambient', mood: 'Chill / Focused' };
  }
  if (id.startsWith('lnj_') || title.includes('blue in velvet') || artist.includes('miles davis')) {
    return { genre: 'Jazz', mood: 'Sultry / Nocturnal' };
  }
  if (id.startsWith('lc_') || title.includes('comfortably numb')) {
    return { genre: 'Rock', mood: 'Epic / Live' };
  }
  if (id.startsWith('dw_') || title.includes('neon horizon')) {
    return { genre: 'Synthwave', mood: 'Retro / High-Energy' };
  }
  if (id.startsWith('dm1_') || title.includes('fake empire')) {
    return { genre: 'Indie', mood: 'Atmospheric / Melodic' };
  }
  if (id.startsWith('dm2_') || title.includes('new person')) {
    return { genre: 'Psychedelic Indie', mood: 'Trippy / Chill' };
  }

  if (title.includes('live')) {
    return { genre: 'Live Rock', mood: 'Energetic' };
  }
  if (title.includes('ambient') || artist.includes('ambient') || title.includes('chill') || title.includes('sleep') || title.includes('focus')) {
    return { genre: 'Ambient', mood: 'Chill / Focused' };
  }
  if (title.includes('techno') || title.includes('house') || title.includes('beat') || title.includes('drum')) {
    return { genre: 'Techno', mood: 'Hypnotic' };
  }
  if (title.includes('jazz') || artist.includes('jazz') || title.includes('brass') || title.includes('sax')) {
    return { genre: 'Jazz', mood: 'Sultry / Chill' };
  }

  return { genre: 'Acoustic Pop', mood: 'Chilled / Welcoming' };
}

// Smart Shuffle Sorting algorithm reorders tracks remaining in the queue to flow smoothly
export function smartReorderQueue(currentQueue: Track[], index: number): Track[] {
  if (currentQueue.length <= 1 || index < 0 || index >= currentQueue.length) return currentQueue;

  const currentTrack = currentQueue[index];
  const processed = getTrackGenreAndMood(currentTrack);

  const played = currentQueue.slice(0, index + 1);
  const remaining = currentQueue.slice(index + 1);

  const scoredRemaining = remaining.map(track => {
    const info = getTrackGenreAndMood(track);
    let score = 0;

    if (info.genre === processed.genre) {
      score += 10;
    }
    if (info.mood === processed.mood) {
      score += 5;
    }

    const genresMatch = info.genre.toLowerCase().split(/[ \/]/).some(g =>
      processed.genre.toLowerCase().split(/[ \/]/).includes(g)
    );
    if (genresMatch) score += 3;

    const moodsMatch = info.mood.toLowerCase().split(/[ \/]/).some(m =>
      processed.mood.toLowerCase().split(/[ \/]/).includes(m)
    );
    if (moodsMatch) score += 2;

    if (track.bpm && currentTrack.bpm) {
      const bpmDiff = Math.abs(track.bpm - currentTrack.bpm);
      if (bpmDiff <= 10) score += 4;
      else if (bpmDiff <= 25) score += 2;
    }

    // Add small random noise to keep it fresh and feel like a shuffle
    score += Math.random() * 1.5;

    return { track, score };
  });

  scoredRemaining.sort((a, b) => b.score - a.score);
  const sortedRemaining = scoredRemaining.map(item => item.track);

  return [...played, ...sortedRemaining];
}

export const PlayerContextMock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setViewState] = useState<ViewType>('home');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('soundup_playlists');
      return saved ? JSON.parse(saved) : mockPlaylists;
    } catch (e) {
      return mockPlaylists;
    }
  });
  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('soundup_tracks');
      return saved ? JSON.parse(saved) : mockTracks;
    } catch (e) {
      return mockTracks;
    }
  });
  const [artists, setArtists] = useState<Artist[]>(() => {
    try {
      const saved = localStorage.getItem('soundup_artists');
      return saved ? JSON.parse(saved) : mockArtists;
    } catch (e) {
      return mockArtists;
    }
  });
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem('soundup_albums');
      return saved ? JSON.parse(saved) : mockAlbums;
    } catch (e) {
      return mockAlbums;
    }
  });
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  // Choose standard initial track from "Rock Classics" - Stairway to Heaven as in screenshot
  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(() => tracks);
  const [queueIndex, setQueueIndex] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('soundup_playlists', JSON.stringify(playlists));
    } catch (e) {
      console.warn(e);
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem('soundup_tracks', JSON.stringify(tracks));
    } catch (e) {
      console.warn(e);
    }
  }, [tracks]);

  useEffect(() => {
    try {
      localStorage.setItem('soundup_artists', JSON.stringify(artists));
    } catch (e) {
      console.warn(e);
    }
  }, [artists]);

  useEffect(() => {
    try {
      localStorage.setItem('soundup_albums', JSON.stringify(albums));
    } catch (e) {
      console.warn(e);
    }
  }, [albums]);

  const [progress, setProgress] = useState<number>(165); // starts at 2:45 as in screenshot for Rock Classics
  const [volume, setVolume] = useState<number>(0.75);
  const [prevVolume, setPrevVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(['stairway', 'dreamon', 'sweetchild']);

  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isSmartShuffle, setIsSmartShuffle] = useState<boolean>(false);
  const [originalQueue, setOriginalQueue] = useState<Track[]>(mockTracks);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const toggleLyrics = () => setIsLyricsOpen(prev => !prev);

  const [isMiniPlayer, setIsMiniPlayer] = useState<boolean>(false);
  const toggleMiniPlayer = () => setIsMiniPlayer(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMiniPlayer(true);
      }
    };
    // Initialize on mount
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const progressIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (view === 'upload') {
      setIsUploadModalOpen(true);
    } else {
      setViewState(view);
    }
  };

  const openPlaylist = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setViewState('playlist');
  };

  const playTrack = (track: Track, tracksQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);

    const activeQueue = tracksQueue || queue;
    setOriginalQueue(activeQueue);

    if (isSmartShuffle) {
      const reordered = smartReorderQueue(activeQueue, activeQueue.findIndex(t => t.id === track.id) || 0);
      setQueue(reordered);
      setQueueIndex(reordered.findIndex(t => t.id === track.id) || 0);
    } else {
      setQueue(activeQueue);
      const idx = activeQueue.findIndex(t => t.id === track.id);
      if (idx !== -1) {
        setQueueIndex(idx);
      } else {
        setQueue([...activeQueue, track]);
        setQueueIndex(activeQueue.length);
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

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
  };

  const playPrevious = () => {
    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1; // Wrap around
    }

    setQueueIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setProgress(0);
  };

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
    };
  }, [isPlaying, currentTrack, queueIndex, isShuffle, isRepeat]);

  // Synchronize background audio synthesizer with play state & master tracks
  // useEffect(() => {
  //   if (isPlaying && currentTrack) {
  //     backgroundPlayback.start(currentTrack, volume, isMuted);
  //   } else {
  //     backgroundPlayback.stop();
  //   }
  // }, [isPlaying, currentTrack]);

  // useEffect(() => {
  //   backgroundPlayback.setVolume(volume, isMuted);
  // }, [volume, isMuted]);

  // useEffect(() => {
  //   return () => {
  //     backgroundPlayback.stop();
  //   };
  // }, []);

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleLikeTrack = (trackId: string) => {
    setLikedTrackIds(prev => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => {
      const nextVal = !prev;
      if (nextVal) {
        setIsSmartShuffle(false);
        showToast("Shuffle active: Queue will play in random order.");
      } else {
        showToast("Shuffle disabled.");
      }
      return nextVal;
    });
  };

  const toggleSmartShuffle = () => {
    setIsSmartShuffle(prev => {
      const nextVal = !prev;
      if (nextVal) {
        setIsShuffle(false);
        const reordered = smartReorderQueue(queue, queueIndex);
        setQueue(reordered);
        showToast("Smart Shuffle active: Queue dynamically reordered by genre and mood!");
      } else {
        if (currentTrack) {
          const originalIdx = originalQueue.findIndex(t => t.id === currentTrack.id);
          if (originalIdx !== -1) {
            setQueueIndex(originalIdx);
          }
        }
        setQueue(originalQueue);
        showToast("Smart Shuffle disabled: Restored original queue order.");
      }
      return nextVal;
    });
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    // Remove the toast safely after 3 seconds
    setTimeout(() => {
      setToast(prev => {
        if (prev.message === message) {
          return { message: '', show: false };
        }
        return prev;
      });
    }, 3000);
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => {
      const alreadyInQueue = prev?.some(t => t.id === track.id);
      if (alreadyInQueue) {
        return [...prev, { ...track, id: `${track.id}_q_${Date.now()}` }];
      }
      return prev ? [...prev, track] : [track];
    });
    showToast(`Added to queue: "${track.title}" by ${track.artist}`);
  };

  const createPlaylist = (name: string, description: string, coverUrl: string, bgColor?: string, gradientColor?: string, isPrivate?: boolean) => {
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
      gradientColor: gradientColor || '#0e1217',
      isPrivate: isPrivate ?? false
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    return id;
  };

  const updatePlaylist = (id: string, updatedFields: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));
  };

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
        };
      }
      return p;
    }));
  };

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
        };
      }
      return p;
    }));
  };

  const addNewTrack = (t: Track) => {
    setTracks(prev => [t, ...prev]);
  };

  const addNewArtist = (a: Artist) => {
    setArtists(prev => [a, ...prev]);
  };

  const addNewAlbum = (al: Album) => {
    setAlbums(prev => [al, ...prev]);
  };

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
        isSmartShuffle,
        toggleSmartShuffle,
        isRepeat,
        toggleRepeat,
        queue,
        addToQueue,
        toast,
        showToast,
        isLyricsOpen,
        toggleLyrics,
        isMiniPlayer,
        toggleMiniPlayer,
        setIsMiniPlayer,
        allPlaylists: playlists,
        createPlaylist,
        updatePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        allTracks: tracks,
        addNewTrack,
        allArtists: artists,
        addNewArtist,
        allAlbums: albums,
        addNewAlbum,
        isUploadModalOpen,
        setIsUploadModalOpen
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
