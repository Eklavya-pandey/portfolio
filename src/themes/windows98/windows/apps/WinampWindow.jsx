import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';
import { useWin98Audio } from '../../context/Win98AudioContext';
import { useSound } from '../../../../context/SoundContext';

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

const EQ_FREQS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
const EQ_LABELS = ['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'];

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
    musicList,
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
  const [balance, setBalance] = useState(0); // -1 (Left) to +1 (Right)
  const [preampVal, setPreampVal] = useState(0); // -12 to +12 dB
  const [eqValues, setEqValues] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 10 bands
  const [eqOn, setEqOn] = useState(true);
  const [eqAuto, setEqAuto] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showEq, setShowEq] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [marqueePos, setMarqueePos] = useState(0);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Web Audio Nodes
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const preampNodeRef = useRef(null);
  const filterNodesRef = useRef([]);
  const pannerNodeRef = useRef(null);
  const analyserNodeRef = useRef(null);

  const currentTrack = musicList[currentIndex] || null;

  // Initialize Web Audio Graph lazily on user gesture
  const initWebAudio = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      // Preamp Gain
      const preamp = ctx.createGain();
      preamp.gain.value = Math.pow(10, preampVal / 20);
      preampNodeRef.current = preamp;

      // 10-band BiquadFilters
      const filters = EQ_FREQS.map((freq, i) => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1.4;
        filter.gain.value = eqOn ? eqValues[i] : 0;
        return filter;
      });
      filterNodesRef.current = filters;

      // Stereo Panner (if supported)
      let panner = null;
      if (ctx.createStereoPanner) {
        panner = ctx.createStereoPanner();
        panner.pan.value = balance;
        pannerNodeRef.current = panner;
      }

      // Analyser Node
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserNodeRef.current = analyser;

      // Connect graph: source -> preamp -> filters -> panner -> analyser -> destination
      let lastNode = source.connect(preamp);
      for (const filter of filters) {
        lastNode = lastNode.connect(filter);
      }
      if (panner) {
        lastNode = lastNode.connect(panner);
      }
      lastNode.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn('Could not initialize Web Audio in Winamp:', e);
    }
  };

  // Register pause callback with coordinator
  useEffect(() => {
    const unregister = registerPlayer('winamp', () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    });
    return unregister;
  }, [registerPlayer]);

  // Handle Play
  const handlePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    initWebAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    requestPlayback('winamp');
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, [currentTrack, requestPlayback]);

  // Handle Pause
  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    notifyPaused('winamp');
  }, [notifyPaused]);

  // Handle Stop
  const handleStop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    notifyPaused('winamp');
  }, [notifyPaused]);

  // Handle Seek
  const handleSeek = (timeSec) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timeSec;
    setCurrentTime(timeSec);
  };

  // Skip Next / Prev
  const handleNext = useCallback(() => {
    if (musicList.length === 0) return;
    const nextIdx = (currentIndex + 1) % musicList.length;
    setCurrentIndex(nextIdx);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => {
        handlePlay();
      }, 50);
    }
  }, [musicList, currentIndex, isPlaying, handlePlay]);

  const handlePrev = useCallback(() => {
    if (musicList.length === 0) return;
    const prevIdx = (currentIndex - 1 + musicList.length) % musicList.length;
    setCurrentIndex(prevIdx);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => {
        handlePlay();
      }, 50);
    }
  }, [musicList, currentIndex, isPlaying, handlePlay]);

  // Volume & Balance effects
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (pannerNodeRef.current) {
      pannerNodeRef.current.pan.value = balance;
    }
  }, [balance]);

  // Preamp effect
  useEffect(() => {
    if (preampNodeRef.current) {
      preampNodeRef.current.gain.value = Math.pow(10, preampVal / 20);
    }
  }, [preampVal]);

  // EQ BiquadFilters effect
  useEffect(() => {
    filterNodesRef.current.forEach((filter, i) => {
      if (filter) {
        filter.gain.value = eqOn ? eqValues[i] : 0;
      }
    });
  }, [eqValues, eqOn]);

  // Audio element events
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const onEnded = () => {
    handleNext();
  };

  // Eject File Picker
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const added = addCustomTrack(file, 'audio');
      if (added) {
        setCurrentIndex(0);
        setTimeout(() => handlePlay(), 80);
      }
    }
    e.target.value = '';
  };

  // Marquee scroll
  const marqueeText = currentTrack
    ? `${currentIndex + 1}. ${currentTrack.name} (${formatTime(duration)})  ***  WINAMP 2.81  ***  `
    : emptyMessage;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMarqueePos((prev) => (prev + 1) % (marqueeText.length || 1));
    }, 220);
    return () => clearInterval(interval);
  }, [isPlaying, marqueeText]);

  const visibleMarquee = marqueeText.slice(marqueePos) + marqueeText.slice(0, marqueePos);

  // Spectrum Visualizer inside LCD
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const barCount = 16;
    const dataArray = new Uint8Array(barCount);

    let animId;
    const render = () => {
      ctx.fillStyle = '#0F1E14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (analyserNodeRef.current && isPlaying) {
        analyserNodeRef.current.getByteFrequencyData(dataArray);
      } else {
        dataArray.fill(0);
      }

      for (let i = 0; i < barCount; i++) {
        const x = i * (canvas.width / barCount) + 1;
        const w = Math.max(1, canvas.width / barCount - 2);
        let h = 2;
        if (isPlaying) {
          const raw = dataArray[i] || 0;
          h = Math.max(2, (raw / 255) * (canvas.height - 4));
        }

        const y = canvas.height - h;
        // Green Winamp LCD phosphor bars
        ctx.fillStyle = '#00FF41';
        ctx.fillRect(x, y, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <>
      <Window
        id="winamp-window"
        title="WINAMP"
        icon={<WinampIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={false}
        zIndex={zIndex}
        position={position}
        defaultWidth={275}
        defaultHeight="auto"
        resizable={false}
        hasMenu={false}
        hasStatusBar={false}
        showMinimize={true}
        showMaximize={true}
        onFocus={onFocus}
        onMinimize={onMinimize}
        onClose={() => {
          handleStop();
          if (onClose) onClose();
        }}
      >
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack?.path || ''}
          crossOrigin="anonymous"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
        />

        {/* Hidden File Input for Eject */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Winamp Main Shell */}
        <div
          style={{
            width: '269px',
            background: '#23272A',
            border: '2px solid #101214',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            padding: '3px',
            boxSizing: 'border-box',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
            userSelect: 'none',
          }}
        >
          {/* LCD Screen Display */}
          <div
            style={{
              background: '#0F1E14',
              border: '1px solid #3E464D',
              borderRadius: '2px',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            {/* Top LCD Row: Time display & Marquee */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              {/* Green Time LED */}
              <div
                style={{
                  background: '#07100B',
                  border: '1px solid #1E3A28',
                  padding: '2px 4px',
                  color: '#00FF41',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
              >
                {formatTime(currentTime)}
              </div>

              {/* Scrolling Title Marquee */}
              <div
                style={{
                  flex: 1,
                  background: '#07100B',
                  border: '1px solid #1E3A28',
                  padding: '2px 4px',
                  color: '#00FF41',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                  height: '14px',
                  lineHeight: '14px',
                }}
              >
                {visibleMarquee.slice(0, 26)}
              </div>

              {/* KBPS / KHZ Indicator */}
              <div style={{ color: '#00FF41', fontSize: '9px', fontWeight: 700 }}>
                128k
              </div>
            </div>

            {/* Bottom LCD Row: Spectrum Visualizer & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '24px' }}>
              <canvas
                ref={canvasRef}
                width={120}
                height={24}
                style={{
                  width: '120px',
                  height: '24px',
                  background: '#07100B',
                  border: '1px solid #1E3A28',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '9px', color: '#00FF41' }}>
                <span>{isPlaying ? 'PLAY' : 'STOP'}</span>
                <span>STEREO</span>
              </div>
            </div>
          </div>

          {/* Seek Bar */}
          <div style={{ padding: '0 2px' }}>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '10px',
                accentColor: '#00FF41',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Volume and Balance Sliders */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', fontSize: '9px', color: '#B0B0B0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ width: '60px', height: '8px', accentColor: '#00FF41' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>BAL</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value))}
                style={{ width: '60px', height: '8px', accentColor: '#00FF41' }}
              />
            </div>
          </div>

          {/* Transport Controls Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {/* Prev */}
              <button
                onClick={handlePrev}
                title="Previous"
                style={{ width: '23px', height: '18px', background: '#3A3F45', border: '1px solid #1C1E22', color: '#FFF', fontSize: '10px', cursor: 'pointer' }}
              >
                |◀
              </button>
              {/* Play */}
              <button
                onClick={handlePlay}
                title="Play"
                style={{ width: '23px', height: '18px', background: '#3A3F45', border: '1px solid #1C1E22', color: '#FFF', fontSize: '10px', cursor: 'pointer' }}
              >
                ▶
              </button>
              {/* Pause */}
              <button
                onClick={handlePause}
                title="Pause"
                style={{ width: '23px', height: '18px', background: '#3A3F45', border: '1px solid #1C1E22', color: '#FFF', fontSize: '10px', cursor: 'pointer' }}
              >
                ❚❚
              </button>
              {/* Stop */}
              <button
                onClick={handleStop}
                title="Stop"
                style={{ width: '23px', height: '18px', background: '#3A3F45', border: '1px solid #1C1E22', color: '#FFF', fontSize: '10px', cursor: 'pointer' }}
              >
                ■
              </button>
              {/* Next */}
              <button
                onClick={handleNext}
                title="Next"
                style={{ width: '23px', height: '18px', background: '#3A3F45', border: '1px solid #1C1E22', color: '#FFF', fontSize: '10px', cursor: 'pointer' }}
              >
                ▶|
              </button>
              {/* Eject */}
              <button
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                title="Eject (Open File)"
                style={{ width: '23px', height: '18px', background: '#3A3F45', border: '1px solid #1C1E22', color: '#FFF', fontSize: '10px', cursor: 'pointer' }}
              >
                ⏏
              </button>
            </div>

            {/* Toggle EQ & PL Buttons */}
            <div style={{ display: 'flex', gap: '3px' }}>
              <button
                onClick={() => setShowEq(!showEq)}
                style={{
                  width: '22px',
                  height: '18px',
                  background: showEq ? '#00FF41' : '#3A3F45',
                  color: showEq ? '#000' : '#FFF',
                  border: '1px solid #1C1E22',
                  fontSize: '9px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Toggle Equalizer"
              >
                EQ
              </button>
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                style={{
                  width: '22px',
                  height: '18px',
                  background: showPlaylist ? '#00FF41' : '#3A3F45',
                  color: showPlaylist ? '#000' : '#FFF',
                  border: '1px solid #1C1E22',
                  fontSize: '9px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Toggle Playlist"
              >
                PL
              </button>
              <button
                onClick={() => setShowAbout(true)}
                style={{
                  width: '20px',
                  height: '18px',
                  background: '#3A3F45',
                  color: '#FFFF00',
                  border: '1px solid #1C1E22',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="About Winamp"
              >
                ?
              </button>
            </div>
          </div>

          {/* 10-Band Equalizer Panel */}
          {showEq && (
            <div
              style={{
                marginTop: '4px',
                padding: '4px',
                background: '#1D2124',
                border: '1px solid #3E464D',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setEqOn(!eqOn)}
                    style={{
                      padding: '1px 4px',
                      background: eqOn ? '#00FF41' : '#3A3F45',
                      color: eqOn ? '#000' : '#FFF',
                      border: '1px solid #111',
                      fontSize: '9px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ON
                  </button>
                  <button
                    onClick={() => setEqAuto(!eqAuto)}
                    style={{
                      padding: '1px 4px',
                      background: eqAuto ? '#00FF41' : '#3A3F45',
                      color: eqAuto ? '#000' : '#FFF',
                      border: '1px solid #111',
                      fontSize: '9px',
                      cursor: 'pointer',
                    }}
                  >
                    AUTO
                  </button>
                </div>
                <span style={{ fontSize: '9px', color: '#00FF41', fontWeight: 700 }}>
                  WINAMP EQUALIZER
                </span>
              </div>

              {/* Sliders: PRE + 10 Bands */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', padding: '2px 0' }}>
                {/* Preamp */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={preampVal}
                    onChange={(e) => setPreampVal(parseFloat(e.target.value))}
                    style={{
                      writingMode: 'vertical-lr',
                      direction: 'rtl',
                      width: '12px',
                      height: '46px',
                      accentColor: '#00FF41',
                    }}
                  />
                  <span style={{ fontSize: '7px', color: '#AAA' }}>PRE</span>
                </div>

                {/* 10 Bands */}
                {EQ_LABELS.map((lbl, idx) => (
                  <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={eqValues[idx]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEqValues((prev) => {
                          const next = [...prev];
                          next[idx] = val;
                          return next;
                        });
                      }}
                      style={{
                        writingMode: 'vertical-lr',
                        direction: 'rtl',
                        width: '12px',
                        height: '46px',
                        accentColor: '#00FF41',
                      }}
                    />
                    <span style={{ fontSize: '7px', color: '#AAA' }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlist Panel */}
          {showPlaylist && (
            <div
              style={{
                marginTop: '4px',
                padding: '4px',
                background: '#0F1E14',
                border: '1px solid #3E464D',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                maxHeight: '120px',
                overflowY: 'auto',
              }}
            >
              <div style={{ color: '#00FF41', fontSize: '9px', fontWeight: 700, borderBottom: '1px solid #1E3A28', paddingBottom: '2px' }}>
                WINAMP PLAYLIST ({musicList.length} TRACKS)
              </div>
              {musicList.length === 0 ? (
                <div style={{ padding: '6px 2px', color: '#808080', fontSize: '10px', fontStyle: 'italic' }}>
                  {emptyMessage}
                </div>
              ) : (
                musicList.map((tr, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <div
                      key={`${tr.path}-${idx}`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setTimeout(() => handlePlay(), 50);
                      }}
                      style={{
                        padding: '2px 4px',
                        background: isSelected ? '#003300' : 'transparent',
                        color: isSelected ? '#00FF41' : '#88AA88',
                        cursor: 'pointer',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{idx + 1}. {tr.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </Window>

      {/* About Dialog */}
      <AboutAppDialog
        isOpen={showAbout}
        appName="Winamp"
        version="Version 2.81 (Windows 98)"
        icon={<WinampIconSmall />}
        description="It really whips the llama's patience."
        onClose={() => setShowAbout(false)}
      />
    </>
  );
}
