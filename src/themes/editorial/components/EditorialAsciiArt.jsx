import React, { useState, useEffect, useRef, useCallback } from 'react';
import EditorialModal from './EditorialModal';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks } from './EditorialIcons';

export const CHARSETS = {
  blocks: {
    id: 'blocks',
    name: 'Blocks',
    chars: ' ░▒▓█'
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    chars: ' .:-=+*#%@'
  },
  letters: {
    id: 'letters',
    name: 'Letters',
    chars: ' .`^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
  },
  dots: {
    id: 'dots',
    name: 'Dots',
    chars: ' ·:;*#'
  }
};

export default function EditorialAsciiArt({ isOpen = true, onClose, isInline = false }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [columns, setColumns] = useState(120);
  const [charsetKey, setCharsetKey] = useState('classic');
  const [isInverted, setIsInverted] = useState(false);
  const [isColorMode, setIsColorMode] = useState(false);
  const [brightness, setBrightness] = useState(0); // -100 to 100
  const [contrast, setContrast] = useState(0); // -100 to 100
  const [asciiLines, setAsciiLines] = useState([]); // array of lines or array of colored tokens
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fileDragOver, setFileDragOver] = useState(false);
  const [fontSize, setFontSize] = useState(8);
  const [isNewImageReveal, setIsNewImageReveal] = useState(false);

  const hiddenCanvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const loadedImageRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const viewportRef = useRef(null);
  const probeRef = useRef(null);

  // Stop webcam tracks
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
    setWebcamError(null);
  }, []);

  // Clean up on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopWebcam();
    }
  }, [isOpen, stopWebcam]);

  // Sizing calculation: fill the whole canvas box without black side patches
  const calculateFit = useCallback(() => {
    if (!viewportRef.current || !asciiLines.length || columns <= 0) return;

    const viewport = viewportRef.current;
    // Canvas inner width and height minus 16px padding on each side
    const canvasInnerWidth = Math.max(20, viewport.clientWidth - 32);
    const canvasInnerHeight = Math.max(20, viewport.clientHeight - 32);
    const rows = asciiLines.length;

    // Measure single character width at 20px font-size using true monospace
    let singleCharRatio = 0.60;
    if (probeRef.current) {
      const probeRect = probeRef.current.getBoundingClientRect();
      if (probeRect.width > 0) {
        // probe contains 100 characters at 20px font-size
        const measured = (probeRect.width / 100) / 20;
        if (measured > 0.3 && measured < 1.2) {
          singleCharRatio = measured;
        }
      }
    }

    // Font-size so that cols * charWidth = canvas inner width
    const fontSizeForWidth = canvasInnerWidth / (columns * singleCharRatio);

    // Font-size so that rows * (fontSize * 0.6) = canvas inner height
    const fontSizeForHeight = canvasInnerHeight / (rows * 0.6);

    // Fill the whole box: take max so neither width nor height leaves black patches
    const fitSize = Math.max(fontSizeForWidth, fontSizeForHeight);
    setFontSize(Math.max(1, Math.min(60, fitSize)));
  }, [asciiLines, columns]);

  // Recalculate on window resize, column change, charset change, and after generating text
  useEffect(() => {
    calculateFit();
  }, [calculateFit, asciiLines, columns, charsetKey]);

  useEffect(() => {
    if (!viewportRef.current) return;
    const observer = new ResizeObserver(() => {
      calculateFit();
    });
    observer.observe(viewportRef.current);
    window.addEventListener('resize', calculateFit);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => calculateFit());
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateFit);
    };
  }, [calculateFit]);

  // Load an image element into memory and process
  const processImage = useCallback(() => {
    const img = loadedImageRef.current;
    if (!img) return;

    setIsProcessing(true);

    try {
      const canvas = hiddenCanvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const targetWidth = Math.max(20, Math.min(200, columns));
      // Natural aspect ratio (height / width)
      // With line-height: 0.6 and char ratio ~0.6, character cells are ~1:1 square.
      const aspect = img.naturalHeight / img.naturalWidth || img.height / img.width || 1;
      const targetHeight = Math.max(10, Math.round(targetWidth * aspect));

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw and apply brightness/contrast
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imgData.data;

      // Analyze raw downsampled brightness distribution
      let maxLum = 0, sumLum = 0;
      const count = targetWidth * targetHeight;
      for (let i = 0; i < data.length; i += 4) {
        const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (l > maxLum) maxLum = l;
        sumLum += l;
      }
      const avgLum = sumLum / Math.max(1, count);

      const activeChars = CHARSETS[charsetKey]?.chars || CHARSETS.classic.chars;
      const charRamp = isInverted ? activeChars.split('').reverse().join('') : activeChars;
      const rampLength = charRamp.length;

      // Contrast factor calculation
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      const lines = [];
      let textAccumulator = '';

      for (let y = 0; y < targetHeight; y++) {
        const lineTokens = [];
        let lineString = '';

        for (let x = 0; x < targetWidth; x++) {
          const idx = (y * targetWidth + x) * 4;
          let r = data[idx];
          let g = data[idx + 1];
          let b = data[idx + 2];

          // Apply brightness
          r = Math.min(255, Math.max(0, r + brightness * 1.5));
          g = Math.min(255, Math.max(0, g + brightness * 1.5));
          b = Math.min(255, Math.max(0, b + brightness * 1.5));

          // Apply contrast
          r = Math.min(255, Math.max(0, factor * (r - 128) + 128));
          g = Math.min(255, Math.max(0, factor * (g - 128) + 128));
          b = Math.min(255, Math.max(0, factor * (b - 128) + 128));

          // Standard Luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          let norm = lum / 255;
          if (avgLum < 40 && maxLum > 0) {
            // Adaptive perceptual gamma for low-luminance / dark-background images
            // Automatically reveals fine text & character outlines across the whole canvas
            const gamma = 0.35;
            norm = Math.pow(Math.min(1, Math.max(0, lum / Math.max(50, maxLum))), gamma);
          }

          const charIndex = Math.min(
            rampLength - 1,
            Math.max(0, Math.floor(norm * rampLength))
          );
          const char = charRamp[charIndex];

          lineString += char;
          if (isColorMode) {
            lineTokens.push({
              char,
              color: `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
            });
          }
        }

        if (isColorMode) {
          lines.push(lineTokens);
        } else {
          lines.push(lineString);
        }
        textAccumulator += lineString + '\n';
      }

      setAsciiLines(lines);
      setRawText(textAccumulator);
    } catch (err) {
      console.error('Error generating ASCII art:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [columns, charsetKey, isInverted, isColorMode, brightness, contrast]);

  // Debounced trigger for parameter changes
  const triggerDebouncedProcess = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      processImage();
    }, 80);
  }, [processImage]);

  useEffect(() => {
    if (loadedImageRef.current) {
      triggerDebouncedProcess();
    }
  }, [columns, charsetKey, isInverted, isColorMode, brightness, contrast, triggerDebouncedProcess]);

  // Handle image load from URL or File
  const handleLoadImageSrc = useCallback((src) => {
    stopWebcam();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImageRef.current = img;
      setImageSrc(src);
      setIsNewImageReveal(true);
      processImage();
    };
    img.src = src;
  }, [stopWebcam, processImage]);

  // Auto-load demo image on initial mount
  useEffect(() => {
    handleLoadImageSrc('/assets/ascii-demo.jpg');
  }, [handleLoadImageSrc]);

  // Handle local file selection
  const handleFileSelect = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB.');
      return;
    }
    editorialAudio.playClick();
    const reader = new FileReader();
    reader.onload = (e) => {
      handleLoadImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Demo image trigger
  const handleUseDemo = () => {
    editorialAudio.playClick();
    handleLoadImageSrc('/assets/ascii-demo.jpg');
  };

  // Webcam stream start
  const handleStartWebcam = async () => {
    editorialAudio.playClick();
    setWebcamError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Webcam not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      setIsWebcamActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 50);
    } catch (err) {
      console.warn('Webcam access error:', err);
      setWebcamError('Camera access unavailable. Check permissions or upload an image.');
    }
  };

  // Snapshot from active webcam
  const handleCaptureWebcam = () => {
    editorialAudio.playClick();
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    handleLoadImageSrc(dataUrl);
  };

  // Copy raw ASCII text
  const handleCopyText = () => {
    if (!rawText) return;
    editorialAudio.playSuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Download raw .txt file
  const handleDownloadTxt = () => {
    if (!rawText) return;
    editorialAudio.playSuccess();
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${columns}col.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download high-resolution PNG using canvas
  const handleDownloadPng = () => {
    if (!asciiLines.length) return;
    editorialAudio.playSuccess();

    const charWidth = 7.5;
    const charHeight = 12;
    const padding = 32;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(columns * charWidth + padding * 2);
    canvas.height = Math.round(asciiLines.length * charHeight + padding * 2 + 30);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark terminal background
    ctx.fillStyle = '#0B0C0E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle technical grid
    ctx.strokeStyle = '#1F2128';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    // Font settings
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';

    // Header stamp
    ctx.fillStyle = '#FF5E1F';
    ctx.fillText('NAVEEN.DESIGN // ASCII TERMINAL RASTER', padding, 16);

    // Draw characters
    const startY = padding + 18;
    if (isColorMode) {
      asciiLines.forEach((lineTokens, rowIdx) => {
        const y = startY + rowIdx * charHeight;
        lineTokens.forEach((token, colIdx) => {
          const x = padding + colIdx * charWidth;
          ctx.fillStyle = token.color;
          ctx.fillText(token.char, x, y);
        });
      });
    } else {
      ctx.fillStyle = '#EDEDED';
      asciiLines.forEach((lineText, rowIdx) => {
        const y = startY + rowIdx * charHeight;
        ctx.fillText(lineText, padding, y);
      });
    }

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ascii-art-${columns}col.png`;
    a.click();
  };

  // Clear workspace
  const handleClear = () => {
    editorialAudio.playClick();
    stopWebcam();
    setImageSrc(null);
    loadedImageRef.current = null;
    setAsciiLines([]);
    setRawText('');
  };

  const asciiBody = (
    <div className="editorial-ascii-layout">
      {/* Hidden canvas for image processing */}
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />

      {/* Hidden character measurement element for exact fit-to-width */}
      <span
        ref={probeRef}
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          visibility: 'hidden',
          pointerEvents: 'none',
          fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Space Mono', 'Courier New', monospace",
          fontSize: '20px',
          lineHeight: 1,
          letterSpacing: 0,
          whiteSpace: 'pre'
        }}
        aria-hidden="true"
      >
        {'0123456789'.repeat(10)}
      </span>

        {/* LEFT PANEL: CONTROLS */}
        <div className="editorial-ascii-controls-pane">
          {/* Section: Image Input */}
          <div className="editorial-ascii-group">
            <span className="editorial-ascii-group-title">IMAGE SOURCE</span>

            {/* Drag & Drop Zone */}
            <label
              className={`editorial-ascii-dropzone ${fileDragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setFileDragOver(true);
              }}
              onDragLeave={() => setFileDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setFileDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="editorial-ascii-file-input"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <span className="dropzone-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="dropzone-text">DROP IMAGE OR CLICK</span>
              <span className="dropzone-sub">PNG, JPG, WEBP (MAX 5MB)</span>
            </label>

            {/* Quick Demo & Webcam Buttons */}
            <div className="editorial-ascii-btn-row">
              <button
                type="button"
                className="editorial-secondary-btn"
                onClick={handleUseDemo}
                title="Load demo high-contrast silhouette photo (/assets/ascii-demo.jpg)"
              >
                USE DEMO
              </button>

              <button
                type="button"
                className={`editorial-secondary-btn ${isWebcamActive ? 'active' : ''}`}
                onClick={isWebcamActive ? stopWebcam : handleStartWebcam}
              >
                {isWebcamActive ? 'STOP CAM' : 'WEBCAM'}
              </button>
            </div>

            {/* Webcam Privacy Notice before click (B8) */}
            <p className="editorial-ascii-webcam-note">
              Webcam stays on your device. Nothing is uploaded.
            </p>

            {/* Webcam Live Capture Feed */}
            {isWebcamActive && (
              <div className="editorial-ascii-webcam-box">
                <video
                  ref={videoRef}
                  className="editorial-ascii-video"
                  autoPlay
                  playsInline
                  muted
                />
                <button
                  type="button"
                  className="editorial-primary-btn"
                  onClick={handleCaptureWebcam}
                >
                  📸 CAPTURE FRAME
                </button>
              </div>
            )}

            {webcamError && (
              <div className="editorial-ascii-error-badge">
                {webcamError}
              </div>
            )}
          </div>

          {/* Section: Raster Density & Charset */}
          <div className="editorial-ascii-group">
            <span className="editorial-ascii-group-title">RASTER RESOLUTION</span>

            <div className="editorial-ascii-slider-row">
              <div className="slider-header">
                <span className="slider-lbl">COLUMNS / DENSITY</span>
                <span className="slider-val">{columns} COLS</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="2"
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value, 10))}
                className="editorial-ascii-slider"
              />
            </div>

            <div className="editorial-ascii-charset-pills">
              <span className="slider-lbl">CHARSET</span>
              <div className="pills-grid">
                {Object.values(CHARSETS).map((cs) => (
                  <button
                    key={cs.id}
                    type="button"
                    className={`editorial-ascii-pill ${charsetKey === cs.id ? 'active' : ''}`}
                    onClick={() => {
                      editorialAudio.playClick();
                      setCharsetKey(cs.id);
                    }}
                  >
                    {cs.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Image Tuning Sliders */}
          <div className="editorial-ascii-group">
            <span className="editorial-ascii-group-title">IMAGE TUNING</span>

            <div className="editorial-ascii-slider-row">
              <div className="slider-header">
                <span className="slider-lbl">BRIGHTNESS</span>
                <span className="slider-val">{brightness > 0 ? `+${brightness}` : brightness}</span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                className="editorial-ascii-slider"
              />
            </div>

            <div className="editorial-ascii-slider-row">
              <div className="slider-header">
                <span className="slider-lbl">CONTRAST</span>
                <span className="slider-val">{contrast > 0 ? `+${contrast}` : contrast}</span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                className="editorial-ascii-slider"
              />
            </div>

            <div className="editorial-ascii-toggles-row">
              <button
                type="button"
                className={`editorial-ascii-pill ${isInverted ? 'active' : ''}`}
                onClick={() => {
                  editorialAudio.playClick();
                  setIsInverted((prev) => !prev);
                }}
              >
                {isInverted ? '● INVERTED' : '○ INVERT'}
              </button>

              <button
                type="button"
                className={`editorial-ascii-pill ${isColorMode ? 'active' : ''}`}
                onClick={() => {
                  editorialAudio.playClick();
                  setIsColorMode((prev) => !prev);
                }}
              >
                {isColorMode ? '● COLOR MATRIX' : '○ MONO'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: PREVIEW & EXPORTS */}
        <div className="editorial-ascii-preview-pane">
          {/* Action Toolbar */}
          <div className="editorial-ascii-actions-bar">
            <div className="editorial-ascii-actions-left">
              <button
                type="button"
                className="editorial-primary-btn"
                onClick={handleCopyText}
                disabled={!rawText}
                aria-disabled={!rawText}
              >
                {copied ? '✓ COPIED TEXT' : 'COPY TEXT'}
              </button>
              <button
                type="button"
                className="editorial-secondary-btn"
                onClick={handleDownloadPng}
                disabled={!rawText}
                aria-disabled={!rawText}
              >
                DOWNLOAD PNG
              </button>
              <button
                type="button"
                className="editorial-secondary-btn"
                onClick={handleDownloadTxt}
                disabled={!rawText}
                aria-disabled={!rawText}
              >
                DOWNLOAD TXT
              </button>
            </div>

            <button
              type="button"
              className="editorial-clear-btn"
              onClick={handleClear}
              disabled={!imageSrc}
              aria-disabled={!imageSrc}
            >
              CLEAR
            </button>
          </div>

          {/* ASCII Output Viewport */}
          <div className="editorial-ascii-viewport" ref={viewportRef}>
            {isProcessing && (
              <div className="editorial-ascii-spinner-overlay">
                <span>PROCESSING RASTER MATRIX...</span>
              </div>
            )}

            {asciiLines.length > 0 ? (
              <pre
                className={`editorial-ascii-pre ${isNewImageReveal ? 'ascii-revealing' : ''}`}
                onAnimationEnd={() => setIsNewImageReveal(false)}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 0.6,
                }}
              >
                {isColorMode
                  ? asciiLines.map((row, rIdx) => (
                      <div
                        key={rIdx}
                        className="editorial-ascii-line"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: 0.6,
                        }}
                      >
                        {row.map((t, cIdx) => (
                          <span key={cIdx} style={{ color: t.color }}>
                            {t.char}
                          </span>
                        ))}
                      </div>
                    ))
                  : rawText}
              </pre>
            ) : (
              <div className="editorial-ascii-placeholder">
                <span className="placeholder-icon">▦</span>
                <span className="placeholder-title">NO IMAGE LOADED</span>
                <p className="placeholder-desc">
                  Drop any picture into the dropzone or click <strong>USE DEMO</strong> to generate instant terminal ASCII art.
                </p>
              </div>
            )}
          </div>

          {/* Footer Specifications */}
          <div className="editorial-ascii-footer-bar">
            <span>CANVAS RASTER SPEC: {columns} COLS × {asciiLines.length} ROWS · FONT {fontSize.toFixed(1)}PX (FILL FIT)</span>
            <span>LINE-HEIGHT 0.6 TABULAR PROPORTION</span>
          </div>
        </div>
      </div>
    );

  if (isInline) {
    return (
      <div className="editorial-playground-tool-card" id="ascii-studio">
        <EditorialCornerTicks />
        <div className="editorial-tool-card-header">
          <div className="editorial-tool-card-title-group">
            <span className="editorial-tool-card-tag">03 // CANVAS RASTER MATRIX</span>
            <h3 className="editorial-tool-card-title">Terminal ASCII Art Studio</h3>
            <p className="editorial-tool-context-line">Turn any image into ASCII art, right in your browser.</p>
          </div>
          <span
            className="editorial-pg-key-badge"
            tabIndex={0}
            role="button"
            aria-label="Press A"
          >
            <span className="badge-text">A</span>
            <span className="badge-hover-label" aria-hidden="true">Press A</span>
          </span>
        </div>
        {asciiBody}
      </div>
    );
  }

  return (
    <EditorialModal
      isOpen={isOpen}
      onClose={onClose}
      title="CANVAS ASCII TERMINAL STUDIO // 03"
      shortcutHint="ESC"
      size="large"
    >
      {asciiBody}
    </EditorialModal>
  );
}
