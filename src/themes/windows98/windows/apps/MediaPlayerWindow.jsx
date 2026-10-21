import React, { useEffect, useRef } from 'react';
import Window from '../../components/Window';
import { useWin98Audio } from '../../context/Win98AudioContext';

// Small Media Player Icon
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
    stop,
    seek,
    setVolume,
    toggleMute,
    selectTrack,
    nextTrack,
    prevTrack,
  } = useWin98Audio();

  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Close dialog on Escape key
  useEffect(() => {
    if (!showAboutDialog) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowAboutDialog(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAboutDialog]);

  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Animated Visualizer Spectrum Bars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const barCount = 18;

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < barCount; i++) {
        const x = i * (canvas.width / barCount) + 2;
        const w = canvas.width / barCount - 4;
        let barHeight = 4;

        if (isPlaying) {
          // Dynamic wave animation reacting to playback time
          const t = Date.now() * 0.006 + i * 0.4;
          const factor = Math.abs(Math.sin(t) * Math.cos(t * 0.7));
          barHeight = 6 + factor * (canvas.height - 10);
        }

        const y = canvas.height - barHeight;

        // Gradient from Green to Yellow to Red
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#00FF00');
        grad.addColorStop(0.6, '#FFFF00');
        grad.addColorStop(1, '#FF0000');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, barHeight);
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'Open Track...', onClick: () => selectTrack(0, true) },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Visualization (Spectrum) ✓' },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Windows Media Player',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  const ctrlBtnStyle = {
    padding: '2px 8px',
    background: '#C0C0C0',
    border: '2px solid',
    borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
    fontSize: '11px',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Window
      id="window-media-player"
      title={`${currentTrack ? currentTrack.title : 'Windows Media Player'}`}
      icon={<MediaPlayerIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={540}
      defaultHeight={340}
      hasMenu={true}
      menuItems={menuItems}
      hasStatusBar={true}
      statusText={isPlaying ? `Playing: ${currentTrack?.title}` : 'Stopped'}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#C0C0C0',
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Upper section: Left Visualizer + Right Track List */}
        <div style={{ flex: 1, display: 'flex', gap: '8px', minHeight: 0 }}>
          {/* Visualizer Frame */}
          <div
            style={{
              flex: 1,
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <canvas ref={canvasRef} width={260} height={140} style={{ width: '100%', height: '100%' }} />
          </div>

          {/* Track List Panel */}
          <div
            style={{
              width: '200px',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              background: '#FFFFFF',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                background: '#000080',
                color: '#FFFFFF',
                padding: '2px 4px',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
            >
              Playlist ({tracks.length} tracks)
            </div>
            {tracks.length === 0 ? (
              <div style={{ padding: '8px', fontSize: '11px', color: '#888' }}>No tracks found</div>
            ) : (
              tracks.map((track, idx) => {
                const isCurrent = currentTrackIndex === idx;
                return (
                  <div
                    key={track.id}
                    onClick={() => selectTrack(idx, true)}
                    style={{
                      padding: '4px 6px',
                      background: isCurrent ? '#000080' : 'transparent',
                      color: isCurrent ? '#FFFFFF' : '#000000',
                      cursor: 'pointer',
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      borderBottom: '1px dotted #DFDFDF',
                    }}
                  >
                    {isCurrent ? (isPlaying ? '▶ ' : '⏸ ') : ''}
                    {track.title}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Seek Bar Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            style={{
              flex: 1,
              cursor: 'pointer',
              accentColor: '#000080',
            }}
          />
          <div
            style={{
              fontSize: '11px',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 'bold',
              width: '80px',
              textAlign: 'right',
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Transport Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#C0C0C0',
            border: '2px solid',
            borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
            padding: '4px 8px',
          }}
        >
          {/* Previous, Play, Pause, Stop, Next */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={ctrlBtnStyle} onClick={prevTrack} title="Previous Track">
              ⏮
            </button>
            <button style={ctrlBtnStyle} onClick={play} title="Play">
              ▶
            </button>
            <button style={ctrlBtnStyle} onClick={pause} title="Pause">
              ⏸
            </button>
            <button style={ctrlBtnStyle} onClick={stop} title="Stop">
              ⏹
            </button>
            <button style={ctrlBtnStyle} onClick={nextTrack} title="Next Track">
              ⏭
            </button>
          </div>

          {/* Volume Slider & Mute Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={toggleMute}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '80px', cursor: 'pointer', accentColor: '#000080' }}
            />
          </div>
        </div>

        {/* About Dialog */}
        {showAboutDialog && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              boxShadow: '3px 3px 10px rgba(0,0,0,0.5)',
              padding: '16px 20px',
              zIndex: 100,
              minWidth: '240px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              Windows Media Player
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Windows Media Player 6.4 for Windows 98.
            </p>
            <button
              className="win-btn"
              onClick={() => setShowAboutDialog(false)}
              style={{
                padding: '3px 16px',
                background: '#C0C0C0',
                border: '2px solid',
                borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '11px',
              }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </Window>
  );
}
