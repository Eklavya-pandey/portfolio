import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '../../components/Window';

// Difficulty presets
const PRESETS = {
  beginner: { rows: 9, cols: 9, mines: 10, name: 'Beginner', defaultWidth: 200, defaultHeight: 280 },
  intermediate: { rows: 16, cols: 16, mines: 40, name: 'Intermediate', defaultWidth: 320, defaultHeight: 400 },
  expert: { rows: 16, cols: 30, mines: 99, name: 'Expert', defaultWidth: 570, defaultHeight: 400 },
};

// 7-Segment LED Digit Display (3 digits)
function LedCounter({ value }) {
  const clamped = Math.max(-99, Math.min(999, value));
  let str = clamped.toString();
  if (clamped >= 0) {
    str = str.padStart(3, '0');
  } else {
    str = '-' + Math.abs(clamped).toString().padStart(2, '0');
  }

  return (
    <div
      style={{
        background: '#000000',
        padding: '1px 3px',
        color: '#FF0000',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '22px',
        fontWeight: '900',
        lineHeight: '22px',
        letterSpacing: '2px',
        boxShadow: '1px 1px 0px #808080 inset, -1px -1px 0px #FFFFFF inset',
        display: 'inline-block',
        userSelect: 'none',
      }}
    >
      {str}
    </div>
  );
}

// Pixel Minesweeper Icon
export const MinesweeperIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" fill="#C0C0C0" stroke="#000" strokeWidth="1" />
    <circle cx="8" cy="8" r="4" fill="#000" />
    <rect x="7" y="2" width="2" height="12" fill="#000" />
    <rect x="2" y="7" width="12" height="2" fill="#000" />
    <rect x="4" y="4" width="2" height="2" fill="#FFF" />
  </svg>
);

export default function MinesweeperWindow({
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
  const [level, setLevel] = useState('beginner');
  const config = PRESETS[level];

  const [grid, setGrid] = useState([]);
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'won' | 'lost'
  const [flagsCount, setFlagsCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [faceState, setFaceState] = useState('normal'); // 'normal' | 'scared' | 'dead' | 'won'
  const [showBestTimes, setShowBestTimes] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [bestTimes, setBestTimes] = useState(() => {
    try {
      const saved = localStorage.getItem('win98_minesweeper_scores');
      return saved ? JSON.parse(saved) : { beginner: 999, intermediate: 999, expert: 999 };
    } catch {
      return { beginner: 999, intermediate: 999, expert: 999 };
    }
  });

  const timerRef = useRef(null);

  // Initialize fresh empty grid
  const initBoard = useCallback((currentConfig) => {
    const { rows, cols } = currentConfig;
    const newGrid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          isExploded: false,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setGameState('ready');
    setFlagsCount(0);
    setTimer(0);
    setFaceState('normal');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initBoard(config);
  }, [config, initBoard]);

  // Close dialog on Escape key
  useEffect(() => {
    if (!showBestTimes && !showAboutDialog) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showBestTimes) setShowBestTimes(false);
        if (showAboutDialog) setShowAboutDialog(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBestTimes, showAboutDialog]);

  // Timer interval
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((t) => Math.min(999, t + 1));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Seed mines ensuring first click (safeR, safeC) is never a mine
  const seedMines = (initialGrid, safeR, safeC, currentConfig) => {
    const { rows, cols, mines } = currentConfig;
    const g = initialGrid.map((row) => row.map((cell) => ({ ...cell })));
    let planted = 0;

    while (planted < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      // Ensure safe cell and its immediate neighbors are safe on first click for beginner experience
      const isSafeZone = Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1;
      if (!g[r][c].isMine && (!isSafeZone || mines >= rows * cols - 9)) {
        if (!g[r][c].isMine && !(r === safeR && c === safeC)) {
          g[r][c].isMine = true;
          planted++;
        }
      }
    }

    // Calculate neighbor counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (g[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc].isMine) {
              count++;
            }
          }
        }
        g[r][c].neighborMines = count;
      }
    }
    return g;
  };

  // Reveal cell cascade
  const revealCell = (r, c) => {
    if (gameState === 'won' || gameState === 'lost') return;

    let currentGrid = grid;
    if (gameState === 'ready') {
      currentGrid = seedMines(grid, r, c, config);
      setGameState('playing');
    }

    const target = currentGrid[r][c];
    if (target.isRevealed || target.isFlagged) return;

    const g = currentGrid.map((row) => row.map((cell) => ({ ...cell })));

    // Clicked a mine -> Game Over
    if (g[r][c].isMine) {
      g[r][c].isExploded = true;
      // Reveal all mines
      for (let row of g) {
        for (let cell of row) {
          if (cell.isMine) cell.isRevealed = true;
          if (cell.isFlagged && !cell.isMine) cell.isFalseFlag = true;
        }
      }
      setGrid(g);
      setGameState('lost');
      setFaceState('dead');
      return;
    }

    // Flood fill algorithm for 0 neighbor cells
    const queue = [[r, c]];
    g[r][c].isRevealed = true;

    while (queue.length > 0) {
      const [cr, cc] = queue.shift();
      if (g[cr][cc].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
              const neighbor = g[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }

    // Check for victory
    let nonMineUnrevealed = 0;
    for (let row of g) {
      for (let cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          nonMineUnrevealed++;
        }
      }
    }

    if (nonMineUnrevealed === 0) {
      // Won!
      setGameState('won');
      setFaceState('won');
      // Flag remaining mines
      for (let row of g) {
        for (let cell of row) {
          if (cell.isMine) cell.isFlagged = true;
        }
      }
      setFlagsCount(config.mines);

      // Save best time
      const finalTime = timer === 0 ? 1 : timer;
      if (finalTime < bestTimes[level]) {
        const nextScores = { ...bestTimes, [level]: finalTime };
        setBestTimes(nextScores);
        try {
          localStorage.setItem('win98_minesweeper_scores', JSON.stringify(nextScores));
        } catch {}
      }
    }

    setGrid(g);
  };

  // Toggle flag on right click
  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    const g = grid.map((row) => row.map((item) => ({ ...item })));
    const target = g[r][c];
    if (!target.isFlagged) {
      target.isFlagged = true;
      setFlagsCount((prev) => prev + 1);
    } else {
      target.isFlagged = false;
      setFlagsCount((prev) => prev - 1);
    }
    setGrid(g);
  };

  // Chording: clicking a revealed number whose surrounding flag count matches its neighbor count
  const handleChord = (r, c) => {
    if (gameState !== 'playing') return;
    const cell = grid[r][c];
    if (!cell.isRevealed || cell.neighborMines === 0) return;

    let flagCount = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          if (grid[nr][nc].isFlagged) flagCount++;
        }
      }
    }

    if (flagCount === cell.neighborMines) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
            if (!grid[nr][nc].isRevealed && !grid[nr][nc].isFlagged) {
              revealCell(nr, nc);
            }
          }
        }
      }
    }
  };

  const getNumberColor = (count) => {
    const colors = [
      'transparent',
      '#0000FF', // 1: Blue
      '#008000', // 2: Green
      '#FF0000', // 3: Red
      '#000080', // 4: Navy
      '#800000', // 5: Maroon
      '#008080', // 6: Teal
      '#000000', // 7: Black
      '#808080', // 8: Gray
    ];
    return colors[count] || '#000000';
  };

  // Menu bar items
  const menuItems = [
    {
      label: 'Game',
      items: [
        { label: 'New (F2)', onClick: () => initBoard(config) },
        { isSeparator: true },
        {
          label: `Beginner (9x9) ${level === 'beginner' ? '✓' : ''}`,
          onClick: () => {
            setLevel('beginner');
            initBoard(PRESETS.beginner);
          },
        },
        {
          label: `Intermediate (16x16) ${level === 'intermediate' ? '✓' : ''}`,
          onClick: () => {
            setLevel('intermediate');
            initBoard(PRESETS.intermediate);
          },
        },
        {
          label: `Expert (16x30) ${level === 'expert' ? '✓' : ''}`,
          onClick: () => {
            setLevel('expert');
            initBoard(PRESETS.expert);
          },
        },
        { isSeparator: true },
        { label: 'Best Times...', onClick: () => setShowBestTimes(true) },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Minesweeper',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  return (
    <Window
      id="window-minesweeper"
      title="Minesweeper"
      icon={<MinesweeperIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={config.defaultWidth}
      defaultHeight={config.defaultHeight}
      hasMenu={true}
      menuItems={menuItems}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        style={{
          padding: '6px',
          background: '#C0C0C0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
      >
        {/* Header HUD: Mine Counter, Smiley Button, Timer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: config.cols * 16 + 12,
            maxWidth: '100%',
            padding: '4px 6px',
            background: '#C0C0C0',
            border: '2px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            boxSizing: 'border-box',
          }}
        >
          <LedCounter value={config.mines - flagsCount} />

          {/* Smiley Reset Button */}
          <button
            onClick={() => initBoard(config)}
            style={{
              width: '26px',
              height: '26px',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              padding: 0,
            }}
            title="Reset Game"
            aria-label="Reset Game"
          >
            {faceState === 'dead' ? '😵' : faceState === 'won' ? '😎' : faceState === 'scared' ? '😮' : '😊'}
          </button>

          <LedCounter value={timer} />
        </div>

        {/* Minesweeper Playfield Grid */}
        <div
          style={{
            border: '3px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            display: 'inline-block',
            background: '#C0C0C0',
            userSelect: 'none',
          }}
          onMouseDown={() => {
            if (gameState === 'playing') setFaceState('scared');
          }}
          onMouseUp={() => {
            if (gameState === 'playing') setFaceState('normal');
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${config.cols}, 16px)`,
              gridTemplateRows: `repeat(${config.rows}, 16px)`,
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isDown = cell.isRevealed;
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => {
                      if (!cell.isRevealed) revealCell(r, c);
                      else handleChord(r, c);
                    }}
                    onContextMenu={(e) => handleRightClick(e, r, c)}
                    style={{
                      width: '16px',
                      height: '16px',
                      boxSizing: 'border-box',
                      border: isDown ? '1px solid #7B7B7B' : '2px solid',
                      borderColor: isDown ? '#7B7B7B' : '#FFFFFF #808080 #808080 #FFFFFF',
                      background: cell.isExploded ? '#FF0000' : isDown ? '#C0C0C0' : '#C0C0C0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: getNumberColor(cell.neighborMines),
                      cursor: 'pointer',
                    }}
                  >
                    {cell.isFlagged && !cell.isRevealed ? (
                      <span style={{ color: '#FF0000', fontSize: '11px', lineHeight: '11px' }}>🚩</span>
                    ) : cell.isFalseFlag ? (
                      <span style={{ color: '#000', fontSize: '11px' }}>❌</span>
                    ) : cell.isRevealed && cell.isMine ? (
                      <span style={{ fontSize: '10px' }}>💣</span>
                    ) : cell.isRevealed && cell.neighborMines > 0 ? (
                      cell.neighborMines
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Best Times Dialog */}
        {showBestTimes && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              padding: '12px 16px',
              zIndex: 100,
              minWidth: '220px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>Fastest Mine Sweepers</div>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Beginner: {bestTimes.beginner < 999 ? `${bestTimes.beginner} seconds` : 'Anonymous (999s)'}</div>
              <div>Intermediate: {bestTimes.intermediate < 999 ? `${bestTimes.intermediate} seconds` : 'Anonymous (999s)'}</div>
              <div>Expert: {bestTimes.expert < 999 ? `${bestTimes.expert} seconds` : 'Anonymous (999s)'}</div>
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <button
                className="win-btn"
                onClick={() => setShowBestTimes(false)}
                style={{
                  padding: '3px 14px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

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
              minWidth: '220px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              Minesweeper
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Classic Windows 98 game recreation.
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
