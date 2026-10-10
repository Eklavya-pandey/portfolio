import React, { useState, useEffect, useRef, useCallback } from 'react';
import EditorialModal from './EditorialModal';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks } from './EditorialIcons';

// Benchmarking constant (easy to edit)
export const NAVEEN_WPM = 62;

export const TYPING_PROMPTS = [
  "I design clean interfaces for fintech products.",
  "Turning complex data into products people enjoy using.",
  "High density financial dashboards demand microsecond clarity.",
  "Design systems bridge the gap between Figma and production code.",
  "Precision typography and tabular figures make balance sheets legible.",
  "Order execution flows must minimize cognitive load under volatility.",
  "User experience is the competitive moat of modern software.",
  "Monospace grids provide mathematical rhythm to complex interfaces.",
  "From wireframe architecture to tokenized component libraries.",
  "Every millisecond of latency in trade submission creates friction.",
  "Simplicity is the ultimate sophistication in enterprise design.",
  "Designing for speed, trust, and zero-error trade confirmations.",
  "Accessible contrast ratios and tactile keyboard shortcuts empower power users.",
  "Craft is the relentless attention to micro-interactions and spacing.",
  "Lead product designer specializing in high frequency fintech platforms."
];

export default function EditorialTypingTest({ isOpen = true, onClose, themeMode = 'paper', isInline = false }) {
  const [duration, setDuration] = useState(30); // 15 | 30 | 60
  const [prompt, setPrompt] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [personalBest, setPersonalBest] = useState(() => {
    try {
      return parseInt(localStorage.getItem('editorial_typing_pb') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [copied, setCopied] = useState(false);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.innerWidth <= 600;
    } catch {
      return false;
    }
  });

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const resultsCardRef = useRef(null);

  // Pick a random prompt
  const initPrompt = useCallback(() => {
    const random = TYPING_PROMPTS[Math.floor(Math.random() * TYPING_PROMPTS.length)];
    setPrompt(random);
    setUserInput('');
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setCopied(false);
  }, [duration]);

  // Reset or initialize on open / duration change (no autofocus on mount - B1)
  useEffect(() => {
    if (isOpen) {
      initPrompt();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, duration, initPrompt]);

  // Timer loop
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const finishTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    editorialAudio.playSuccess();
  }, []);

  // Compute live metrics
  const calculateMetrics = useCallback(() => {
    const elapsedSeconds = Math.max(1, duration - timeLeft);
    const typedWords = userInput.length / 5;
    const minutes = elapsedSeconds / 60;
    const grossWpm = Math.round(typedWords / minutes) || 0;

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === prompt[i]) {
        correctChars++;
      }
    }

    const accuracy = userInput.length > 0
      ? Math.round((correctChars / userInput.length) * 100)
      : 100;

    const netWpm = Math.max(0, Math.round((correctChars / 5) / minutes)) || 0;

    return { wpm: netWpm, grossWpm, accuracy, correctChars };
  }, [userInput, prompt, duration, timeLeft]);

  const { wpm, accuracy } = calculateMetrics();

  // Update Personal Best
  useEffect(() => {
    if (isFinished && wpm > personalBest) {
      setPersonalBest(wpm);
      try {
        localStorage.setItem('editorial_typing_pb', wpm.toString());
      } catch {}
    }
  }, [isFinished, wpm, personalBest]);

  // Handle keystroke input
  const handleInputChange = (e) => {
    if (isFinished) return;
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    try {
      editorialAudio.playClick();
    } catch {}

    setUserInput(value);

    // If completed typing the prompt before timer ends
    if (value.length >= prompt.length) {
      finishTest();
    }
  };

  // Shortcut for restart: Tab + Enter or button
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && isFinished) {
      e.preventDefault();
      initPrompt();
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  };

  // Copy result text summary
  const handleCopyResult = () => {
    editorialAudio.playSuccess();
    const diff = wpm - NAVEEN_WPM;
    const diffText = diff >= 0 ? `+${diff} WPM faster` : `${Math.abs(diff)} WPM behind`;
    const summary = `⌨️ Speed Typing Benchmark: ${wpm} WPM (${accuracy}% accuracy in ${duration}s mode) | Naveen: ${NAVEEN_WPM} WPM (${diffText}) — naveen.design`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  // Generate PNG Certificate/Card using canvas
  const handleDownloadPng = () => {
    editorialAudio.playSuccess();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isBlueprint = themeMode === 'blueprint';
    const bg = isBlueprint ? '#0B0C0E' : '#E8E8E6';
    const cardBg = isBlueprint ? '#121316' : '#F7F7F5';
    const border = isBlueprint ? '#2D2F38' : '#1A1A1A';
    const textPrimary = isBlueprint ? '#FFFFFF' : '#1A1A1A';
    const textMuted = isBlueprint ? '#8A8D98' : '#6B6B6B';
    const accent = '#FF5E1F';

    // Canvas background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Frame Card
    ctx.fillStyle = cardBg;
    ctx.fillRect(60, 60, canvas.width - 120, canvas.height - 120);
    ctx.strokeStyle = border;
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Corner crosshairs
    const drawCross = (x, y) => {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.lineTo(x + 12, y);
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    };
    drawCross(80, 80);
    drawCross(canvas.width - 80, 80);
    drawCross(80, canvas.height - 80);
    drawCross(canvas.width - 80, canvas.height - 80);

    // Header label
    ctx.fillStyle = accent;
    ctx.fillRect(100, 100, 6, 20);
    ctx.fillStyle = textMuted;
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('SPEED TYPING BENCHMARK // 02', 120, 116);

    ctx.fillStyle = textPrimary;
    ctx.font = '800 36px "JetBrains Mono", monospace';
    ctx.fillText('TYPING PERFORMANCE SPECIFICATION', 100, 170);

    // Divider
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(canvas.width - 100, 200);
    ctx.stroke();

    // Metric 1: WPM
    ctx.fillStyle = accent;
    ctx.font = '800 96px "JetBrains Mono", monospace';
    ctx.fillText(`${wpm}`, 100, 310);
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = textMuted;
    ctx.fillText('NET WORDS PER MINUTE', 105, 345);

    // Metric 2: Accuracy
    ctx.fillStyle = textPrimary;
    ctx.font = '800 96px "JetBrains Mono", monospace';
    ctx.fillText(`${accuracy}%`, 480, 310);
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = textMuted;
    ctx.fillText('TYPING ACCURACY', 485, 345);

    // Metric 3: Mode
    ctx.fillStyle = textPrimary;
    ctx.font = '800 96px "JetBrains Mono", monospace';
    ctx.fillText(`${duration}s`, 840, 310);
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = textMuted;
    ctx.fillText('BENCHMARK DURATION', 845, 345);

    // Divider
    ctx.beginPath();
    ctx.moveTo(100, 390);
    ctx.lineTo(canvas.width - 100, 390);
    ctx.stroke();

    // Comparison strip
    const diff = wpm - NAVEEN_WPM;
    const diffString = diff >= 0 ? `+${diff} WPM FASTER` : `${Math.abs(diff)} WPM BEHIND`;
    ctx.fillStyle = isBlueprint ? '#17181D' : '#E8E8E6';
    ctx.fillRect(100, 420, canvas.width - 200, 80);
    ctx.strokeStyle = border;
    ctx.strokeRect(100, 420, canvas.width - 200, 80);

    ctx.fillStyle = textPrimary;
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText(`NAVEEN: ${NAVEEN_WPM} WPM   |   YOU: ${wpm} WPM   (${diffString})`, 130, 468);

    // Prompt quote
    ctx.fillStyle = textMuted;
    ctx.font = 'italic 16px "JetBrains Mono", monospace';
    ctx.fillText(`"${prompt}"`, 100, 550);

    // Footer
    ctx.fillStyle = textMuted;
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(`VERIFIED ON NAVEEN.DESIGN · ${new Date().toISOString().split('T')[0]} · TABULAR FIGURES`, 100, 620);

    // Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `typing-speed-${wpm}wpm-naveen.png`;
    a.click();
  };

  const typingBody = (
    <div className="editorial-typing-wrap" onKeyDown={handleKeyDown}>
        {/* Top Control Bar: Mode selection & Live Stats */}
        <div className="editorial-typing-bar">
          <div className="editorial-typing-modes">
            <span className="editorial-typing-mode-lbl">TIME:</span>
            {[15, 30, 60].map((sec) => (
              <button
                key={sec}
                type="button"
                className={`editorial-typing-mode-btn ${duration === sec ? 'active' : ''}`}
                onClick={() => {
                  editorialAudio.playClick();
                  setDuration(sec);
                }}
                disabled={isActive}
              >
                {sec}s
              </button>
            ))}
          </div>

          <div className="editorial-typing-stats-strip">
            <div className="editorial-typing-stat">
              <span className="typing-stat-lbl">WPM:</span>
              <span className="typing-stat-val accent">{wpm}</span>
            </div>
            <div className="editorial-typing-stat">
              <span className="typing-stat-lbl">ACC:</span>
              <span className="typing-stat-val">{accuracy}%</span>
            </div>
            <div className="editorial-typing-stat">
              <span className="typing-stat-lbl">TIME:</span>
              <span className="typing-stat-val timer">{timeLeft}s</span>
            </div>
            {personalBest > 0 && (
              <div className="editorial-typing-stat pb-stat">
                <span className="typing-stat-lbl">PB:</span>
                <span className="typing-stat-val pb">{personalBest}</span>
              </div>
            )}
          </div>
        </div>

        {/* Typing Surface */}
        {!isFinished ? (
          <div
            className="editorial-typing-surface"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Hidden Input for Keystroke Capture (no autofocus - B1) */}
            <input
              ref={inputRef}
              type="text"
              className="editorial-typing-hidden-input"
              value={userInput}
              onChange={handleInputChange}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="Type the text shown below"
            />

            {/* Character-by-character render */}
            <div className="editorial-typing-text-display">
              {prompt.split('').map((char, index) => {
                let statusClass = 'untyped';
                if (index < userInput.length) {
                  statusClass = userInput[index] === char ? 'correct' : 'incorrect';
                }
                const isCaret = index === userInput.length;

                return (
                  <span
                    key={index}
                    className={`editorial-char ${statusClass} ${isCaret ? 'has-caret' : ''}`}
                  >
                    {isCaret && <span className="editorial-caret" aria-hidden="true" />}
                    {char}
                  </span>
                );
              })}
              {userInput.length >= prompt.length && (
                <span className="editorial-caret" aria-hidden="true" />
              )}
            </div>

            <div className="editorial-typing-helper">
              <span>{isActive ? '● TEST IN PROGRESS — KEEP TYPING' : 'CLICK OR TYPE ANY KEY TO START'}</span>
              <span>ESC TO EXIT</span>
            </div>
          </div>
        ) : (
          /* Finished Results Card */
          <div className="editorial-typing-results-card" ref={resultsCardRef}>
            <div className="editorial-typing-results-header">
              <span className="editorial-results-badge">TEST COMPLETE</span>
              <span className="editorial-results-meta">{duration}S BENCHMARK MODE</span>
            </div>

            <div className="editorial-typing-metrics-grid">
              <div className="editorial-typing-metric-box">
                <span className="metric-box-val accent">{wpm}</span>
                <span className="metric-box-lbl">NET WPM</span>
              </div>
              <div className="editorial-typing-metric-box">
                <span className="metric-box-val">{accuracy}%</span>
                <span className="metric-box-lbl">ACCURACY</span>
              </div>
              <div className="editorial-typing-metric-box">
                <span className="metric-box-val">{userInput.length}</span>
                <span className="metric-box-lbl">CHARS TYPED</span>
              </div>
            </div>

            {/* Comparison Callout */}
            <div className="editorial-typing-comparison">
              <div className="editorial-typing-comparison-line">
                <span className="comp-lbl">BENCHMARK:</span>
                <span className="comp-val">
                  Naveen: <strong>{NAVEEN_WPM} WPM</strong>. You: <strong>{wpm} WPM</strong>.
                </span>
              </div>
              <span className="comp-delta">
                {wpm >= NAVEEN_WPM
                  ? `🚀 +${wpm - NAVEEN_WPM} WPM ahead of benchmark!`
                  : `⚡ ${NAVEEN_WPM - wpm} WPM to match Naveen.`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="editorial-typing-actions">
              <button
                type="button"
                className="editorial-primary-btn"
                onClick={() => {
                  editorialAudio.playClick();
                  initPrompt();
                  setTimeout(() => inputRef.current?.focus(), 40);
                }}
              >
                RESTART [TAB+ENTER]
              </button>

              <button
                type="button"
                className="editorial-secondary-btn"
                onClick={handleCopyResult}
              >
                {copied ? '✓ COPIED RESULT' : 'COPY SUMMARY'}
              </button>

              <button
                type="button"
                className="editorial-secondary-btn"
                onClick={handleDownloadPng}
              >
                DOWNLOAD PNG
              </button>

              <button
                type="button"
                className="editorial-secondary-btn"
                onClick={() => {
                  editorialAudio.playClose();
                  onClose();
                }}
              >
                CLOSE [ESC]
              </button>
            </div>
          </div>
        )}
      </div>
    );

  if (isInline) {
    return (
      <div className="editorial-playground-tool-card" id="typing-test">
        <EditorialCornerTicks />
        <div className="editorial-tool-card-header">
          <div className="editorial-tool-card-title-group">
            <span className="editorial-tool-card-tag">02 // PERFORMANCE BENCHMARK</span>
            <h3 className="editorial-tool-card-title">Speed Typing Benchmark</h3>
            <p className="editorial-tool-context-line">Check your typing speed and accuracy.</p>
          </div>
          <span
            className="editorial-pg-key-badge"
            tabIndex={0}
            role="button"
            aria-label="Press T"
          >
            <span className="badge-text">T</span>
            <span className="badge-hover-label" aria-hidden="true">Press T</span>
          </span>
        </div>

        {/* Mobile notice and collapsed state (B10) */}
        <div className="editorial-typing-mobile-banner">
          <span className="editorial-typing-mobile-note">Best on desktop, needs a keyboard</span>
          <button
            type="button"
            className="editorial-typing-mobile-toggle-btn"
            onClick={() => setIsMobileCollapsed(prev => !prev)}
            aria-expanded={!isMobileCollapsed}
          >
            {isMobileCollapsed ? 'EXPAND BENCHMARK ▼' : 'COLLAPSE BENCHMARK ▲'}
          </button>
        </div>

        <div className={`editorial-typing-collapsible-content ${isMobileCollapsed ? 'collapsed' : ''}`}>
          {typingBody}
        </div>
      </div>
    );
  }

  return (
    <EditorialModal
      isOpen={isOpen}
      onClose={onClose}
      title="SPEED TYPING BENCHMARK // 02"
      shortcutHint="ESC"
      size="medium"
    >
      {typingBody}
    </EditorialModal>
  );
}
