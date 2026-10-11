import React, { useState, useEffect } from 'react';
import { editorialMusic } from '../editorialMusic';
import { editorialAudio } from '../editorialAudio';
import { IconMusic } from './EditorialIcons';

/**
 * Editorial Floating Hover Music Widget
 * Automatically plays background music upon arrival.
 * Provides on-hover controls: Pause / Play, Mute / Unmute, Stop.
 * Permanently accessible on the website without opening the Tools menu.
 */
export default function EditorialMusicHoverButton({ mode = 'paper' }) {
  const [musicState, setMusicState] = useState(() => editorialMusic.getState());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    return editorialMusic.subscribe((state) => {
      setMusicState(state);
    });
  }, []);

  const { isPlaying, isUnavailable, isMuted } = musicState;

  if (isUnavailable) {
    return null;
  }

  const handlePausePlay = (e) => {
    e.stopPropagation();
    editorialAudio.playClick();
    if (isPlaying) {
      editorialMusic.pause();
    } else {
      editorialMusic.play();
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    editorialAudio.playClick();
    editorialMusic.toggleMute();
  };

  const handleStop = (e) => {
    e.stopPropagation();
    editorialAudio.playClick();
    editorialMusic.stop();
  };

  const getStatusText = () => {
    if (isMuted) return 'MUTED';
    if (isPlaying) return 'PLAYING';
    return 'PAUSED';
  };

  return (
    <aside
      className={`editorial-music-hover-widget ${isPlaying ? 'is-playing' : 'is-paused'} ${isMuted ? 'is-muted' : ''}`}
      data-mode={mode}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Background Soundtrack Controls"
    >
      {/* Main interactive pill */}
      <div
        className="editorial-music-pill"
        onClick={handlePausePlay}
        role="region"
        aria-label="Background Music"
      >
        <div className="editorial-music-pill-left">
          <span className="editorial-music-pill-icon" aria-hidden="true">
            <IconMusic size={14} />
          </span>

          {/* Animated Equalizer Bars */}
          <span className="editorial-music-bars-indicator" aria-hidden="true">
            <span className={`music-bar bar-1 ${isPlaying && !isMuted ? 'animating' : 'idle'}`} />
            <span className={`music-bar bar-2 ${isPlaying && !isMuted ? 'animating' : 'idle'}`} />
            <span className={`music-bar bar-3 ${isPlaying && !isMuted ? 'animating' : 'idle'}`} />
          </span>

          <span className="editorial-music-pill-label">
            SOUNDTRACK <span className="editorial-music-status-dot">●</span>{' '}
            <span className="editorial-music-status-text">{getStatusText()}</span>
          </span>
        </div>

        {/* Action Controls - Always visible on hover or focus */}
        <div className="editorial-music-hover-controls" onClick={(e) => e.stopPropagation()}>
          {/* Pause / Play */}
          <button
            type="button"
            className="editorial-music-btn ctrl-playpause"
            onClick={handlePausePlay}
            title={isPlaying ? 'Pause music' : 'Play music'}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <>
                <span className="btn-symbol">❚❚</span>
                <span className="btn-text">PAUSE</span>
              </>
            ) : (
              <>
                <span className="btn-symbol">▶</span>
                <span className="btn-text">PLAY</span>
              </>
            )}
          </button>

          {/* Mute / Unmute */}
          <button
            type="button"
            className={`editorial-music-btn ctrl-mute ${isMuted ? 'active-muted' : ''}`}
            onClick={handleMuteToggle}
            title={isMuted ? 'Unmute music' : 'Mute music'}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          >
            <span className="btn-symbol">{isMuted ? '🔊' : '🔇'}</span>
            <span className="btn-text">{isMuted ? 'UNMUTE' : 'MUTE'}</span>
          </button>

          {/* Stop */}
          <button
            type="button"
            className="editorial-music-btn ctrl-stop"
            onClick={handleStop}
            title="Stop music and reset track"
            aria-label="Stop music"
          >
            <span className="btn-symbol">◼</span>
            <span className="btn-text">STOP</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
