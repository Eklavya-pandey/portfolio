import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';
import { useWin98Audio } from '../../context/Win98AudioContext';
import { useSound } from '../../../../context/SoundContext';

export const MediaPlayerIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#000080" stroke="#000" strokeWidth="0.5" />
    <circle cx="8" cy="8" r="4" fill="#C0C0C0" />
    <path d="M7 5.5L10.5 8L7 10.5V5.5Z" fill="#000080" />
  </svg>
);

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function MediaPlayerWindow({
  isOpen,
  isActive,
  isMaximized,
  zIndex,
  position,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
}) {
  const {
    allMediaList,
    registerPlayer,
    requestPlayback,
    notifyPaused,
    addCustomTrack,
    emptyMessage,
  } = useWin98Audio();
  const { playSound } = useSound();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const mediaRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const animRef = useRef(null);

  const currentItem = allMediaList[currentIndex] || null;
  const isVideo = currentItem?.type === 'video';

  // Register pause callback with coordinator
  useEffect(() => {
    const unregister = registerPlayer('mediaplayer', () => {
      if (mediaRef.current) {
        mediaRef.current.pause();
      }
      setIsPlaying(false);
      setStatusMessage('Stopped');
    });
    return unregister;
  }, [registerPlayer]);

  // Handle Play
  const handlePlay = useCallback(() => {
    if (!mediaRef.current || !currentItem) return;
    requestPlayback('mediaplayer');
    setStatusMessage('Buffering...');
    mediaRef.current.play().then(() => {
      setIsPlaying(true);
      setStatusMessage('Playing');
    }).catch(() => {
      setIsPlaying(false);
      setStatusMessage('Stopped');
    });
  }, [currentItem, requestPlayback]);

  // Handle Pause
  const handlePause = useCallback(() => {
    if (!mediaRef.current) return;
    mediaRef.current.pause();
    setIsPlaying(false);
    setStatusMessage('Stopped');
    notifyPaused('mediaplayer');
  }, [notifyPaused]);

  // Toggle Play/Pause
  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePause, handlePlay]);

  // Handle Stop
  const handleStop = useCallback(() => {
    if (!mediaRef.current) return;
    mediaRef.current.pause();
    mediaRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    setStatusMessage('Stopped');
    notifyPaused('mediaplayer');
  }, [notifyPaused]);

  // Handle Seek
  const handleSeek = (timeSec) => {
    if (!mediaRef.current) return;
    mediaRef.current.currentTime = timeSec;
    setCurrentTime(timeSec);
  };

  // Skip Next / Prev
  const handleNext = useCallback(() => {
    if (allMediaList.length === 0) return;
    const nextIdx = (currentIndex + 1) % allMediaList.length;
    setCurrentIndex(nextIdx);
    setCurrentTime(0);
    // If was playing, auto-play next track
    if (isPlaying) {
      setTimeout(() => {
        handlePlay();
      }, 50);
    }
  }, [allMediaList, currentIndex, isPlaying, handlePlay]);

  const handlePrev = useCallback(() => {
    if (allMediaList.length === 0) return;
    const prevIdx = (currentIndex - 1 + allMediaList.length) % allMediaList.length;
    setCurrentIndex(prevIdx);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => {
        handlePlay();
      }, 50);
    }
  }, [allMediaList, currentIndex, isPlaying, handlePlay]);

  // Rewind (-5s) & Fast-forward (+5s)
  const handleRewind = () => {
    if (!mediaRef.current) return;
    const next = Math.max(0, mediaRef.current.currentTime - 5);
    handleSeek(next);
  };

  const handleFastForward = () => {
    if (!mediaRef.current) return;
    const next = Math.min(duration, mediaRef.current.currentTime + 5);
    handleSeek(next);
  };

  // Fullscreen video toggle
  const handleToggleFullscreen = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  // File Picker
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const added = addCustomTrack(file, file.type.startsWith('video') ? 'video' : 'audio');
      if (added) {
        setCurrentIndex(0);
        setTimeout(() => {
          handlePlay();
        }, 100);
      }
    }
    e.target.value = '';
  };

  // Sync volume with media element
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Media events
  const onTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration || 0);
    }
  };

  const onEnded = () => {
    // Auto advance to next track
    handleNext();
  };

  // Animated visualizer for audio files
  useEffect(() => {
    if (isVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const barCount = 20;

    let animId;
    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < barCount; i++) {
        const x = i * (canvas.width / barCount) + 2;
        const w = canvas.width / barCount - 4;
        let barHeight = 4;

        if (isPlaying) {
          const t = Date.now() * 0.007 + i * 0.45;
          const factor = Math.abs(Math.sin(t) * Math.cos(t * 0.8));
          barHeight = 6 + factor * (canvas.height - 14);
        }

        const y = canvas.height - barHeight;

        // Win98 gradient (green to yellow to red)
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#00C800');
        grad.addColorStop(0.65, '#FFFF00');
        grad.addColorStop(1, '#FF2200');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, Math.max(1, w), barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, isVideo]);

  // Menu bar items matching classic Windows Media Player
  const menuItems = [
    {
      label: 'File',
      items: [
        {
          label: 'Open...',
          shortcut: 'Ctrl+O',
          onClick: () => {
            if (fileInputRef.current) fileInputRef.current.click();
          },
        },
        { isSeparator: true },
        {
          label: 'Exit',
          onClick: () => {
            handleStop();
            if (onClose) onClose();
          },
        },
      ],
    },
    {
      label: 'View',
      items: [
        {
          label: 'Playlist',
          checked: showPlaylist,
          onClick: () => setShowPlaylist((prev) => !prev),
        },
        {
          label: 'Full Screen',
          shortcut: 'Alt+Enter',
          disabled: !isVideo,
          onClick: handleToggleFullscreen,
        },
      ],
    },
    {
      label: 'Play',
      items: [
        {
          label: isPlaying ? 'Pause' : 'Play',
          shortcut: 'Ctrl+P',
          onClick: handleTogglePlay,
        },
        {
          label: 'Stop',
          shortcut: 'Ctrl+S',
          onClick: handleStop,
        },
        { isSeparator: true },
        {
          label: 'Previous',
          shortcut: 'Ctrl+B',
          onClick: handlePrev,
        },
        {
          label: 'Next',
          shortcut: 'Ctrl+F',
          onClick: handleNext,
        },
        { isSeparator: true },
        {
          label: isMuted ? 'Unmute' : 'Mute',
          checked: isMuted,
          onClick: () => setIsMuted((prev) => !prev),
        },
      ],
    },
    {
      label: 'Favorites',
      items: [
        {
          label: 'Add to Favorites...',
          onClick: () => playSound('ding'),
        },
      ],
    },
    {
      label: 'Go',
      items: [
        {
          label: 'Back',
          disabled: true,
        },
        {
          label: 'Forward',
          disabled: true,
        },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Windows Media Player',
          onClick: () => setShowAbout(true),
        },
      ],
    },
  ];

  const currentTrackTitle = currentItem ? currentItem.name : emptyMessage;
  const statusLine = `${statusMessage} | ${currentTrackTitle} (${formatTime(currentTime)} / ${formatTime(duration)})`;

  return (
    <>
      <Window
        id="media-player-window"
        title="Windows Media Player"
        icon={<MediaPlayerIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={isMaximized}
        zIndex={zIndex}
        position={position}
        defaultWidth={560}
        defaultHeight={420}
        minWidth={440}
        minHeight={320}
        resizable={true}
        hasMenu={true}
        menuItems={menuItems}
        hasStatusBar={true}
        statusText={statusLine}
        onFocus={onFocus}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={() => {
          handleStop();
          if (onClose) onClose();
        }}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Hidden Audio/Video Media Element */}
        <video
          ref={mediaRef}
          src={currentItem?.path || ''}
          style={{ display: isVideo ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'contain' }}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onDoubleClick={handleToggleFullscreen}
        />

        <div
          style={{
            alignSelf: 'stretch',
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            background: '#C0C0C0',
            overflow: 'hidden',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
            fontSize: '11px',
          }}
        >
          {/* Main Player Area */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '4px',
              gap: '4px',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            {/* Display / Video Screen Area */}
            <div
              onDoubleClick={isVideo ? handleToggleFullscreen : undefined}
              style={{
                flex: 1,
                minHeight: '140px',
                background: '#000000',
                border: '2px solid',
                borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                boxShadow: '1px 1px 0px black inset',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {allMediaList.length === 0 ? (
                <div
                  style={{
                    color: '#808080',
                    fontSize: '11px',
                    textAlign: 'center',
                    padding: '16px',
                  }}
                >
                  {emptyMessage}
                </div>
              ) : isVideo ? null : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    position: 'relative',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={100}
                    style={{
                      width: '80%',
                      height: '70%',
                      background: '#000000',
                    }}
                  />
                  <div
                    style={{
                      color: '#00FF00',
                      fontSize: '11px',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '0 8px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '90%',
                    }}
                  >
                    {currentTrackTitle}
                  </div>
                </div>
              )}
            </div>

            {/* Seek Slider Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '2px 4px',
              }}
            >
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: '14px',
                  accentColor: '#000080',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '10px', color: '#000000', minWidth: '70px', textAlign: 'right' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Controls Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px 4px',
                borderTop: '1px solid #808080',
                boxShadow: '0 1px 0 0 white inset',
              }}
            >
              {/* Playback Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {/* Play / Pause */}
                <button
                  onClick={handleTogglePlay}
                  title={isPlaying ? 'Pause' : 'Play'}
                  style={{
                    width: '28px',
                    height: '24px',
                    background: '#C0C0C0',
                    boxShadow: isPlaying
                      ? '1px 1px 0px black inset, -1px -1px 0px white inset, 2px 2px 0px #808080 inset, -2px -2px 0px #DFDFDF inset'
                      : '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {isPlaying ? (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <rect x="1" y="1" width="3" height="8" fill="black" />
                      <rect x="6" y="1" width="3" height="8" fill="black" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M2 1L9 5L2 9V1Z" fill="black" />
                    </svg>
                  )}
                </button>

                {/* Stop */}
                <button
                  onClick={handleStop}
                  title="Stop"
                  style={{
                    width: '28px',
                    height: '24px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <rect width="8" height="8" fill="black" />
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <rect width="8" height="8" fill="black" />
                  </svg>
                </button>

                {/* Previous */}
                <button
                  onClick={handlePrev}
                  title="Previous"
                  style={{
                    width: '24px',
                    height: '24px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <rect x="1" y="2" width="2" height="6" fill="black" />
                    <path d="M8 2L4 5L8 8V2Z" fill="black" />
                  </svg>
                </button>

                {/* Rewind */}
                <button
                  onClick={handleRewind}
                  title="Rewind (-5s)"
                  style={{
                    width: '24px',
                    height: '24px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M5 2L1 5L5 8V2Z" fill="black" />
                    <path d="M9 2L5 5L9 8V2Z" fill="black" />
                  </svg>
                </button>

                {/* Fast Forward */}
                <button
                  onClick={handleFastForward}
                  title="Fast Forward (+5s)"
                  style={{
                    width: '24px',
                    height: '24px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M1 2L5 5L1 8V2Z" fill="black" />
                    <path d="M5 2L9 5L5 8V2Z" fill="black" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  onClick={handleNext}
                  title="Next"
                  style={{
                    width: '24px',
                    height: '24px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 2L6 5L2 8V2Z" fill="black" />
                    <rect x="7" y="2" width="2" height="6" fill="black" />
                  </svg>
                </button>
              </div>

              {/* Volume & Mute */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  style={{
                    width: '22px',
                    height: '22px',
                    background: '#C0C0C0',
                    boxShadow: isMuted
                      ? '1px 1px 0px black inset, -1px -1px 0px white inset, 2px 2px 0px #808080 inset, -2px -2px 0px #DFDFDF inset'
                      : '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4H4L7 2V10L4 8H2V4Z" fill="black" />
                    {!isMuted && <path d="M9 4C10 5 10 7 9 8" stroke="black" strokeWidth="1" />}
                  </svg>
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  style={{
                    width: '60px',
                    height: '14px',
                    accentColor: '#000080',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Docked Playlist Panel on the right (toggleable) */}
          {showPlaylist && (
            <div
              style={{
                width: '180px',
                borderLeft: '1px solid #808080',
                boxShadow: '1px 0 0 0 white inset',
                display: 'flex',
                flexDirection: 'column',
                background: '#FFFFFF',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  background: '#C0C0C0',
                  padding: '3px 6px',
                  fontWeight: 700,
                  borderBottom: '1px solid #808080',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Playlist</span>
                <span
                  onClick={() => setShowPlaylist(false)}
                  style={{ cursor: 'pointer', fontWeight: 700 }}
                  title="Close Playlist"
                >
                  ✕
                </span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {allMediaList.length === 0 ? (
                  <div style={{ padding: '8px', color: '#808080', fontStyle: 'italic', fontSize: '10px' }}>
                    {emptyMessage}
                  </div>
                ) : (
                  allMediaList.map((item, idx) => {
                    const isSelected = idx === currentIndex;
                    return (
                      <div
                        key={`${item.path}-${idx}`}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setTimeout(() => handlePlay(), 50);
                        }}
                        style={{
                          padding: '3px 6px',
                          background: isSelected ? '#000080' : 'transparent',
                          color: isSelected ? '#FFFFFF' : '#000000',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '11px',
                        }}
                      >
                        {idx + 1}. {item.name}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </Window>

      {/* About Dialog */}
      <AboutAppDialog
        isOpen={showAbout}
        appName="Windows Media Player"
        version="Version 6.4 (Windows 98)"
        icon={<MediaPlayerIconSmall />}
        description="Buffering since 1998."
        onClose={() => setShowAbout(false)}
      />
    </>
  );
}
