import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export const WIN98_TRACKS = [
  {
    id: 'track-01',
    title: 'Track 01 - Ambient Waves',
    artist: 'Naveen Pandey',
    src: '/assets/audio/track-01.mp3',
    bitrate: '128',
    sampleRate: '44',
  },
  {
    id: 'track-02',
    title: 'Track 02 - Digital Sunset',
    artist: 'Naveen Pandey',
    src: '/assets/audio/track-02.mp3',
    bitrate: '128',
    sampleRate: '44',
  },
  {
    id: 'track-03',
    title: 'Track 03 - Cyber Pulse',
    artist: 'Naveen Pandey',
    src: '/assets/audio/track-03.mp3',
    bitrate: '128',
    sampleRate: '44',
  },
];

const Win98AudioContext = createContext(null);

export function Win98AudioProvider({ children }) {
  const [tracks, setTracks] = useState(WIN98_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load persisted volume & mute from localStorage
  const [volume, setVolumeState] = useState(() => {
    try {
      const saved = localStorage.getItem('win98_audio_volume');
      if (saved !== null) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0 && val <= 1) return val;
      }
    } catch {}
    return 0.75;
  });

  const [isMuted, setIsMutedState] = useState(() => {
    try {
      return localStorage.getItem('win98_audio_muted') === 'true';
    } catch {}
    return false;
  });

  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const currentTrack = tracks[currentTrackIndex];
    if (currentTrack) {
      audio.src = currentTrack.src;
    }
    audio.volume = isMuted ? 0 : volume;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      // Auto-advance to next track
      setCurrentTrackIndex((prev) => {
        const nextIdx = (prev + 1) % tracks.length;
        if (tracks[nextIdx]) {
          audio.src = tracks[nextIdx].src;
          audio.play().catch(() => setIsPlaying(false));
          setIsPlaying(true);
        }
        return nextIdx;
      });
    };

    const onError = () => {
      // Handle file missing or network error
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Update volume & mute on audio element and persist
  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
    try {
      localStorage.setItem('win98_audio_volume', clamped.toString());
    } catch {}
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMutedState((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      try {
        localStorage.setItem('win98_audio_muted', next.toString());
      } catch {}
      return next;
    });
  }, [volume]);

  // Track selection and playback controls
  const play = useCallback(() => {
    if (!audioRef.current || tracks.length === 0) return;
    const audio = audioRef.current;
    if (!audio.src || audio.src === window.location.href) {
      const track = tracks[currentTrackIndex];
      if (track) audio.src = track.src;
    }
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((e) => {
      console.warn('Playback prevented or file unavailable:', e);
      setIsPlaying(false);
    });
  }, [tracks, currentTrackIndex]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const seek = useCallback((timeInSec) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timeInSec;
    setCurrentTime(timeInSec);
  }, []);

  const selectTrack = useCallback((index, shouldPlay = true) => {
    if (index < 0 || index >= tracks.length || !audioRef.current) return;
    setCurrentTrackIndex(index);
    const audio = audioRef.current;
    audio.src = tracks[index].src;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (shouldPlay) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(false);
    }
  }, [tracks]);

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    selectTrack(nextIdx, isPlaying);
  }, [currentTrackIndex, tracks.length, isPlaying, selectTrack]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    selectTrack(prevIdx, isPlaying);
  }, [currentTrackIndex, tracks.length, isPlaying, selectTrack]);

  const currentTrack = tracks[currentTrackIndex] || null;

  return (
    <Win98AudioContext.Provider
      value={{
        tracks,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        play,
        pause,
        togglePlay,
        stop,
        seek,
        setVolume,
        toggleMute,
        selectTrack,
        nextTrack,
        prevTrack,
      }}
    >
      {children}
    </Win98AudioContext.Provider>
  );
}

export function useWin98Audio() {
  const context = useContext(Win98AudioContext);
  if (!context) {
    throw new Error('useWin98Audio must be used within a Win98AudioProvider');
  }
  return context;
}
