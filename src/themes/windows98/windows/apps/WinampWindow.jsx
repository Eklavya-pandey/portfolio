import React, { useState, useEffect, useRef } from 'react';
import Window from '../../components/Window';
import { useWin98Audio } from '../../context/Win98AudioContext';

// Small Winamp Lightning Bolt Icon
export const WinampIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" rx="2" fill="#202020" />
    <path d="M9 1L3 9H8L7 15L13 7H8L9 1Z" fill="#FFFF00" stroke="#FF9900" strokeWidth="0.5" />
  </svg>
);

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function WinampWindow({
  isOpen,
  isActive,
  zIndex,
  position,
  onFocus,
  onMinimize,
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

  // Visual EQ bands (10 bands)
  const [eqValues, setEqValues] = useState([0, 2, 4, 1, -1, 3, 5, 2, 0, -2]);
  const [eqOn, setEqOn] = useState(true);
  const [eqAuto, setEqAuto] = useState(false);

  // Marquee scroll offset
  const [marqueeOffset, setMarqueeOffset] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMarqueeOffset((prev) => (prev + 1) % 300);
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const marqueeText = currentTrack
    ? `${currentTrackIndex + 1}. ${currentTrack.title} (${currentTrack.bitrate}kbps, ${currentTrack.sampleRate}kHz) *** WINAMP *** `
    : 'WINAMP - NO TRACK LOADED *** ';

  const winampBtnStyle = {
    background: 'linear-gradient(180deg, #505050 0%, #202020 100%)',
    border: '1px solid #707070',
    color: '#E0E0E0',
    fontSize: '10px',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '2px',
    userSelect: 'none',
  };

  return (
    <Window
      id="window-winamp"
      title="WINAMP"
      icon={<WinampIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={false}
      zIndex={zIndex}
      position={position}
      defaultWidth={380}
      defaultHeight={460}
      hasMenu={false}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={() => {}}
      onClose={onClose}
      style={{
        background: '#222226',
        border: '2px solid #505054',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #2A2A2E 0%, #1A1A1E 100%)',
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontFamily: "'Courier New', Courier, monospace",
          color: '#00FF00',
          userSelect: 'none',
          overflow: 'auto',
        }}
      >
        {/* Winamp Top Chassis: LCD Display Screen */}
        <div
          style={{
            background: '#000000',
            border: '2px solid #101010',
            boxShadow: '2px 2px 0px #404040 inset, -1px -1px 0px #000 inset',
            padding: '6px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            borderRadius: '2px',
          }}
        >
          {/* Top Line: Digital Time + Bitrate + Sample Rate + Stereo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Green LCD Time */}
            <div
              style={{
                fontSize: '20px',
                fontWeight: '900',
                color: isPlaying ? '#00FF00' : '#008800',
                letterSpacing: '2px',
              }}
            >
              {formatTime(currentTime)}
            </div>

            {/* Readouts */}
            <div style={{ fontSize: '9px', color: '#00AA00', textAlign: 'right', lineHeight: '11px' }}>
              <div>{currentTrack?.bitrate || '128'} KBPS</div>
              <div>{currentTrack?.sampleRate || '44'} KHZ</div>
            </div>

            <div
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#FFFF00',
                border: '1px solid #FFFF00',
                padding: '1px 3px',
                borderRadius: '1px',
              }}
            >
              STEREO
            </div>
          </div>

          {/* Marquee Ticker */}
          <div
            style={{
              background: '#0A0A0A',
              border: '1px solid #202020',
              padding: '2px 4px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              color: '#00FF44',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                transform: `translateX(-${marqueeOffset}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              {marqueeText.repeat(3)}
            </div>
          </div>
        </div>

        {/* Seek Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            style={{
              flex: 1,
              cursor: 'pointer',
              accentColor: '#00FF00',
              height: '8px',
            }}
          />
        </div>

        {/* Volume & Balance Sliders */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#AAA' }}>
            <span>VOL</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '80px', accentColor: '#00FF00', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#AAA' }}>
            <span>BAL</span>
            <input
              type="range"
              min="-1"
              max="1"
              defaultValue="0"
              style={{ width: '60px', accentColor: '#00FF00', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Main Transport Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
            background: '#1A1A1E',
            padding: '4px',
            border: '1px solid #333',
            borderRadius: '2px',
          }}
        >
          <button style={winampBtnStyle} onClick={prevTrack} title="Previous">|&lt;&lt;</button>
          <button style={{ ...winampBtnStyle, color: isPlaying ? '#00FF00' : '#E0E0E0' }} onClick={play} title="Play">&gt;</button>
          <button style={winampBtnStyle} onClick={pause} title="Pause">||</button>
          <button style={winampBtnStyle} onClick={stop} title="Stop">■</button>
          <button style={winampBtnStyle} onClick={nextTrack} title="Next">&gt;&gt;|</button>
          <button style={winampBtnStyle} onClick={() => selectTrack(0, true)} title="Eject/Open">▲</button>
        </div>

        {/* Winamp Equalizer (10 Bands) */}
        <div
          style={{
            background: '#18181C',
            border: '1px solid #38383C',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            borderRadius: '2px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: '#00AA00', fontWeight: 'bold' }}>WINAMP EQUALIZER</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setEqOn((p) => !p)}
                style={{
                  ...winampBtnStyle,
                  fontSize: '8px',
                  color: eqOn ? '#00FF00' : '#666',
                }}
              >
                ON
              </button>
              <button
                onClick={() => setEqAuto((p) => !p)}
                style={{
                  ...winampBtnStyle,
                  fontSize: '8px',
                  color: eqAuto ? '#00FF00' : '#666',
                }}
              >
                AUTO
              </button>
            </div>
          </div>

          {/* 10 Band Vertical Sliders */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
            {['PRE', '60', '170', '310', '600', '1K', '3K', '6K', '12K', '16K'].map((label, idx) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  value={eqValues[idx] || 0}
                  onChange={(e) => {
                    const next = [...eqValues];
                    next[idx] = parseInt(e.target.value, 10);
                    setEqValues(next);
                  }}
                  style={{
                    writingMode: 'bt-lr', // bottom-to-top
                    WebkitAppearance: 'slider-vertical',
                    width: '12px',
                    height: '46px',
                    accentColor: '#00FF00',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: '7px', color: '#888' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Winamp Playlist Window */}
        <div
          style={{
            background: '#000000',
            border: '1px solid #333',
            flex: 1,
            minHeight: '80px',
            padding: '4px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '9px', color: '#FFFF00', marginBottom: '4px', borderBottom: '1px dotted #333' }}>
            WINAMP PLAYLIST ({tracks.length} items)
          </div>
          {tracks.length === 0 ? (
            <div style={{ fontSize: '10px', color: '#666' }}>No tracks found</div>
          ) : (
            tracks.map((t, idx) => {
              const isCur = currentTrackIndex === idx;
              return (
                <div
                  key={t.id}
                  onClick={() => selectTrack(idx, true)}
                  style={{
                    padding: '2px 4px',
                    background: isCur ? '#000080' : 'transparent',
                    color: isCur ? '#00FF00' : '#CCCCCC',
                    fontSize: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    {idx + 1}. {t.title}
                  </span>
                  <span>{isCur && isPlaying ? '▶' : ''}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Window>
  );
}
