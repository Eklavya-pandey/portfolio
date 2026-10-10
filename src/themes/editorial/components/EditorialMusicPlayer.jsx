import React, { useState, useEffect, useRef, useCallback } from 'react';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks, IconClose } from './EditorialIcons';

/**
 * TRACKS CONFIGURATION ARRAY
 * Add, remove, or edit royalty-free tracks here.
 * Files reside in /public/assets/audio/ (referenced as /assets/audio/)
 */
export const TRACKS = [
  {
    title: 'DEEP WORK // LOFI BEATS',
    artist: 'STUDIO AMBIENT',
    src: '/assets/audio/track-01.mp3'
  },
  {
    title: 'MIDNIGHT SYNTH // FLOW STATE',
    artist: 'NEO-TOKYO LABS',
    src: '/assets/audio/track-02.mp3'
  },
  {
    title: 'ANALOG DRIFT // ZERO VOCALS',
    artist: 'CADENCE DYNAMICS',
    src: '/assets/audio/track-03.mp3'
  }
];

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * EditorialMusicPlayer
 * Standalone background music player with Web Audio API AnalyserNode visualizer.
 * Completely independent from UI sound effects.
 */
export default function EditorialMusicPlayer({
  isOpen,
  onClose,
  onPlaybackChange,
  themeMode = 'paper'
}) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const animFrameRef = useRef(null);
  const peaksRef = useRef([]);

  const currentTrack = TRACKS[currentTrackIndex] || TRACKS[0];

  // Notify parent of playback state change (for toolbar animated EQ)
  useEffect(() => {
    if (onPlaybackChange) {
      onPlaybackChange(isPlaying);
    }
  }, [isPlaying, onPlaybackChange]);

  // Initialize Web Audio Context and AnalyserNode on first user interaction
  const initWebAudio = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64; // 32 frequency bins
        analyser.smoothingTimeConstant = 0.78;

        if (audioRef.current && !sourceNodeRef.current) {
          try {
            const source = ctx.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            sourceNodeRef.current = source;
          } catch (e) {
            // Already connected or browser policy limitation
          }
        }

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
      }

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (err) {
      console.warn('Web Audio initialization:', err);
    }
  }, []);

  // Update volume and mute state on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update loop property
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Handle Play/Pause
  const togglePlay = useCallback(async () => {
    editorialAudio.playClick();
    const audio = audioRef.current;
    if (!audio) return;

    initWebAudio();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback prevented by browser policy:', err);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, initWebAudio]);

  // Handle Next Track
  const handleNext = useCallback(() => {
    editorialAudio.playClick();
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);
    // Auto-play next track if already playing
    setTimeout(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  }, [currentTrackIndex, isPlaying]);

  // Handle Previous Track
  const handlePrev = useCallback(() => {
    editorialAudio.playClick();
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTime(0);
    setTimeout(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  }, [currentTrackIndex, isPlaying]);

  // Handle Track Ended
  const handleEnded = useCallback(() => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      // Auto-advance to next track in playlist
      handleNext();
    }
  }, [isLooping, handleNext]);

  // Seek handler
  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Canvas Spectrum Visualizer rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth || 310;
    const displayHeight = canvas.clientHeight || 44;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    const numBars = 20;
    const barWidth = 7;
    const barGap = (displayWidth - (numBars * barWidth)) / (numBars - 1);

    // Initialize peak tracker
    if (peaksRef.current.length !== numBars) {
      peaksRef.current = new Array(numBars).fill(0);
    }

    const isBlueprint = themeMode === 'blueprint';
    const barColor = isBlueprint ? '#93A4B8' : '#1A1A1A';
    const peakColor = '#FF5E1F';
    const baselineColor = isBlueprint ? '#2D2F38' : '#E0E0DC';

    const renderFrame = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Draw subtle technical grid baseline
      ctx.strokeStyle = baselineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, displayHeight - 1);
      ctx.lineTo(displayWidth, displayHeight - 1);
      ctx.stroke();

      // Fetch audio frequency data if analyser is active
      const analyser = analyserRef.current;
      const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      }

      for (let i = 0; i < numBars; i++) {
        let value = 0;
        if (dataArray && isPlaying) {
          // Sample frequency bins with bias toward musical midrange
          const binIndex = Math.min(dataArray.length - 1, Math.floor(Math.pow(i / numBars, 1.2) * dataArray.length));
          value = dataArray[binIndex] / 255;
        }

        // Height calculation (minimum 3px when playing, 1px baseline when idle)
        const minHeight = isPlaying ? 3 : 1;
        const maxHeight = displayHeight - 6;
        const barHeight = Math.max(minHeight, value * maxHeight);

        // Update peak value with gravity decay
        if (barHeight >= peaksRef.current[i]) {
          peaksRef.current[i] = barHeight;
        } else {
          peaksRef.current[i] = Math.max(0, peaksRef.current[i] - 0.7);
        }

        const x = i * (barWidth + barGap);
        const y = displayHeight - barHeight;

        // Draw bar body
        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw orange peak cap (2px thick)
        if (isPlaying && peaksRef.current[i] > 3) {
          const peakY = Math.max(0, displayHeight - peaksRef.current[i] - 2);
          ctx.fillStyle = peakColor;
          ctx.fillRect(x, peakY, barWidth, 2);
        }
      }

      // Keep animation running only when open and playing
      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      } else {
        // Render one static resting frame when paused
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      }
    };

    renderFrame();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isOpen, isPlaying, themeMode]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Persistent HTML5 Audio element - keeps playing even when popover is closed */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
            setIsLoaded(true);
          }
        }}
        onEnded={handleEnded}
        onError={(e) => {
          console.warn('Audio stream fallback notice for:', currentTrack.src, e);
        }}
      />

      {/* Popover Mini Player (opens above floating toolbar, becomes bottom sheet on mobile) */}
      {isOpen && (
        <div
          className="editorial-music-popover"
          role="dialog"
          aria-label="Background Music Mini Player"
        >
          <EditorialCornerTicks />
          {/* Mobile Bottom-Sheet Drag Handle */}
          <div className="editorial-music-drag-handle" aria-hidden="true" />

          {/* Header */}
          <div className="editorial-music-header">
            <div className="editorial-music-header-title">
              <span className={`editorial-music-indicator ${isPlaying ? 'pulse' : ''}`}>●</span>
              <span className="editorial-music-heading">BG AUDIO // 04</span>
              <span className="editorial-music-track-count">
                [{currentTrackIndex + 1}/{TRACKS.length}]
              </span>
            </div>
            <div className="editorial-music-header-actions">
              <span className="editorial-music-key-badge">M</span>
              <button
                type="button"
                className="editorial-music-close-btn"
                onClick={() => {
                  editorialAudio.playClose();
                  onClose();
                }}
                aria-label="Close music player"
                title="Close player (Music will continue playing)"
              >
                <IconClose size={12} />
              </button>
            </div>
          </div>

          {/* Track Info */}
          <div className="editorial-music-info">
            <div className="editorial-music-title" title={currentTrack.title}>
              {currentTrack.title}
            </div>
            <div className="editorial-music-meta">
              <span className="editorial-music-artist">{currentTrack.artist}</span>
              <span className="editorial-music-badge">CALM · NO VOCALS</span>
            </div>
          </div>

          {/* Canvas Spectrum Visualizer */}
          <div className="editorial-music-visualizer-container">
            <canvas
              ref={canvasRef}
              className="editorial-music-canvas"
              title="Web Audio AnalyserNode Spectrum"
            />
          </div>

          {/* Time & Progress Bar */}
          <div className="editorial-music-progress-section">
            <div
              className="editorial-music-progress-bar"
              onClick={handleSeek}
              role="slider"
              aria-label="Music track seek bar"
              aria-valuemin="0"
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              title="Click to seek"
            >
              <div
                className="editorial-music-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="editorial-music-progress-head"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
            <div className="editorial-music-time-row">
              <span className="editorial-music-time-current">
                {formatTime(currentTime)}
              </span>
              <span className="editorial-music-time-sep">/</span>
              <span className="editorial-music-time-duration">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Main Controls Row: PREV, PLAY/PAUSE, NEXT, LOOP */}
          <div className="editorial-music-controls-row">
            <button
              type="button"
              className="editorial-music-btn-ctrl"
              onClick={handlePrev}
              title="Previous Track"
              aria-label="Previous Track"
            >
              ⏮ PREV
            </button>

            <button
              type="button"
              className={`editorial-music-btn-play ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlay}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '❚❚ PAUSE' : '▶ PLAY'}
            </button>

            <button
              type="button"
              className="editorial-music-btn-ctrl"
              onClick={handleNext}
              title="Next Track"
              aria-label="Next Track"
            >
              NEXT ⏭
            </button>

            <button
              type="button"
              className={`editorial-music-btn-ctrl ${isLooping ? 'active-loop' : ''}`}
              onClick={() => {
                editorialAudio.playClick();
                setIsLooping(prev => !prev);
              }}
              title={isLooping ? 'Track Loop Active (Click to switch to auto-advance next track)' : 'Auto-advance playlist (Click to loop track)'}
              aria-label="Toggle Track Loop"
            >
              {isLooping ? '↻ LOOP' : '→ AUTO'}
            </button>
          </div>

          {/* Volume and Mute Row */}
          <div className="editorial-music-volume-row">
            <button
              type="button"
              className={`editorial-music-mute-btn ${isMuted ? 'muted' : ''}`}
              onClick={() => {
                editorialAudio.playClick();
                setIsMuted(prev => !prev);
              }}
              title={isMuted ? 'Unmute Background Music' : 'Mute Background Music'}
              aria-label="Mute toggle"
            >
              {isMuted ? 'UNMUTE' : 'MUTE'}
            </button>

            <div className="editorial-music-volume-slider-wrap">
              <span className="editorial-music-vol-icon">VOL</span>
              <input
                type="range"
                className="editorial-music-volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (isMuted && val > 0) setIsMuted(false);
                }}
                aria-label="Background music volume"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
              <span className="editorial-music-vol-val">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>

          {/* Popover Footer Notice */}
          <div className="editorial-music-footer">
            <span className="editorial-music-footer-tag">INDEPENDENT SFX & MUSIC</span>
            <span className="editorial-music-footer-hint">KEEP PLAYING IN BG</span>
          </div>
        </div>
      )}
    </>
  );
}
