import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';

// Difficulty presets with exact dimensions fitting the grid and HUD
const PRESETS = {
  beginner: { rows: 9, cols: 9, mines: 10, name: 'Beginner', width: 178, height: 260 },
  intermediate: { rows: 16, cols: 16, mines: 40, name: 'Intermediate', width: 290, height: 372 },
  expert: { rows: 16, cols: 30, mines: 99, name: 'Expert', width: 514, height: 372 },
};

// 7-segment single digit SVG component
const SEGMENT_MAP = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'e', 'd', 'c', 'g'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
  '-': ['g'],
  ' ': [],
};

function SevenSegmentDigit({ char = '0' }) {
  const activeSegments = SEGMENT_MAP[char] || [];
  const onColor = '#FF0000';
  const offColor = '#300000';

  return (
    <svg width="13" height="23" viewBox="0 0 13 23" style={{ display: 'block' }}>
      {/* a: top */}
      <polygon
        points="2,2 3,1 9,1 10,2 8.5,3.5 3.5,3.5"
        fill={activeSegments.includes('a') ? onColor : offColor}
      />
      {/* b: top-right */}
      <polygon
        points="10.5,2.5 11.5,3.5 11.5,9.5 10.5,10.5 9,9 9,4"
        fill={activeSegments.includes('b') ? onColor : offColor}
      />
      {/* c: bottom-right */}
      <polygon
        points="10.5,11.5 11.5,12.5 11.5,18.5 10.5,19.5 9,18 9,13"
        fill={activeSegments.includes('c') ? onColor : offColor}
      />
      {/* d: bottom */}
      <polygon
        points="2,20 3.5,18.5 8.5,18.5 10,20 9,21 3,21"
        fill={activeSegments.includes('d') ? onColor : offColor}
      />
      {/* e: bottom-left */}
      <polygon
        points="1.5,11.5 3,13 3,18 1.5,19.5 0.5,18.5 0.5,12.5"
        fill={activeSegments.includes('e') ? onColor : offColor}
      />
      {/* f: top-left */}
      <polygon
        points="1.5,2.5 3,4 3,9 1.5,10.5 0.5,9.5 0.5,3.5"
        fill={activeSegments.includes('f') ? onColor : offColor}
      />
      {/* g: middle */}
      <polygon
        points="2,11 3,10 9,10 10,11 9,12 3,12"
        fill={activeSegments.includes('g') ? onColor : offColor}
      />
    </svg>
  );
}

function SevenSegmentCounter({ value = 0 }) {
  const clamped = Math.max(-99, Math.min(999, value));
  let str = '';
  if (clamped < 0) {
    str = '-' + Math.abs(clamped).toString().padStart(2, '0');
  } else {
    str = clamped.toString().padStart(3, '0');
  }

  return (
    <div
      style={{
        background: '#000000',
        padding: '2px 3px',
        display: 'flex',
        gap: '2px',
        border: '1px solid',
        borderColor: '#808080 #FFFFFF #FFFFFF #808080',
        boxSizing: 'border-box',
      }}
    >
      <SevenSegmentDigit char={str[0]} />
      <SevenSegmentDigit char={str[1]} />
      <SevenSegmentDigit char={str[2]} />
    </div>
  );
}

// Authentic Win98 Smiley Face SVG
function SmileyFace({ state = 'smile' }) {
  // state: 'smile' | 'scared' | 'dead' | 'win'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      {/* Head */}
      <circle cx="10" cy="10" r="9" fill="#FFFF00" stroke="#000000" strokeWidth="1" />

      {state === 'win' ? (
        // Sunglasses
        <>
          <polygon points="4,6 9,6 8,11 5,11" fill="#000000" />
          <polygon points="11,6 16,6 15,11 12,11" fill="#000000" />
          <line x1="9" y1="7" x2="11" y2="7" stroke="#000000" strokeWidth="1.5" />
          <path d="M5 14 Q10 18 15 14" stroke="#000000" strokeWidth="1.2" fill="none" />
        </>
      ) : state === 'dead' ? (
        // Dead: X eyes and frown
        <>
          <line x1="5.5" y1="6.5" x2="8.5" y2="9.5" stroke="#000000" strokeWidth="1.5" />
          <line x1="8.5" y1="6.5" x2="5.5" y2="9.5" stroke="#000000" strokeWidth="1.5" />
          <line x1="11.5" y1="6.5" x2="14.5" y2="9.5" stroke="#000000" strokeWidth="1.5" />
          <line x1="14.5" y1="6.5" x2="11.5" y2="9.5" stroke="#000000" strokeWidth="1.5" />
          <path d="M6 15 Q10 11 14 15" stroke="#000000" strokeWidth="1.2" fill="none" />
        </>
      ) : state === 'scared' ? (
        // Surprised: open eyes and open mouth
        <>
          <circle cx="7" cy="7" r="1.5" fill="#000000" />
          <circle cx="13" cy="7" r="1.5" fill="#000000" />
          <circle cx="10" cy="14" r="2.5" fill="#000000" />
        </>
      ) : (
        // Normal Smile
        <>
          <circle cx="7" cy="7" r="1.5" fill="#000000" />
          <circle cx="13" cy="7" r="1.5" fill="#000000" />
          <path d="M6 12 Q10 17 14 12" stroke="#000000" strokeWidth="1.2" fill="none" />
        </>
      )}
    </svg>
  );
}

// Minesweeper 16px Icon
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
  const [config, setConfig] = useState(PRESETS.beginner);
  const [allowMarks, setAllowMarks] = useState(true);

  const [grid, setGrid] = useState([]);
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'won' | 'lost'
  const [flagsCount, setFlagsCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [faceState, setFaceState] = useState('smile'); // 'smile' | 'scared' | 'dead' | 'win'
  const [isCellMouseDown, setIsCellMouseDown] = useState(false);

  const [showBestTimes, setShowBestTimes] = useState(false);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const [customRows, setCustomRows] = useState(9);
  const [customCols, setCustomCols] = useState(9);
  const [customMines, setCustomMines] = useState(10);

  const [bestTimes, setBestTimes] = useState(() => {
    try {
      const saved = localStorage.getItem('win98_minesweeper_scores_v2');
      return saved
        ? JSON.parse(saved)
        : {
            beginner: { time: 999, name: 'Anonymous Intern' },
            intermediate: { time: 999, name: 'Anonymous Intern' },
            expert: { time: 999, name: 'Anonymous Intern' },
          };
    } catch {
      return {
        beginner: { time: 999, name: 'Anonymous Intern' },
        intermediate: { time: 999, name: 'Anonymous Intern' },
        expert: { time: 999, name: 'Anonymous Intern' },
      };
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
          isFlagged: false, // true = flag
          isQuestion: false, // true = ? mark
          neighborMines: 0,
          isExploded: false,
          isFalseFlag: false,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setGameState('ready');
    setFlagsCount(0);
    setTimer(0);
    setFaceState('smile');
    setIsCellMouseDown(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initBoard(config);
  }, [config, initBoard]);

  // Global mouseup to reset scared smiley
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsCellMouseDown(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

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

    const totalCells = rows * cols;
    const maxSafeZone = totalCells - mines >= 9;

    while (planted < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      const isSafeZone = maxSafeZone && Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1;
      const isExactFirstClick = r === safeR && c === safeC;

      if (!g[r][c].isMine && !isExactFirstClick && !isSafeZone) {
        g[r][c].isMine = true;
        planted++;
      }
    }

    // Fallback if needed to place remaining mines
    if (planted < mines) {
      for (let r = 0; r < rows && planted < mines; r++) {
        for (let c = 0; c < cols && planted < mines; c++) {
          if (!g[r][c].isMine && !(r === safeR && c === safeC)) {
            g[r][c].isMine = true;
            planted++;
          }
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

    // Clicked a mine: Game Over
    if (g[r][c].isMine) {
      g[r][c].isExploded = true;
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
      setFaceState('win');
      for (let row of g) {
        for (let cell of row) {
          if (cell.isMine) cell.isFlagged = true;
        }
      }
      setFlagsCount(config.mines);

      // Save best time
      const finalTime = timer === 0 ? 1 : timer;
      if (level !== 'custom' && bestTimes[level] && finalTime < bestTimes[level].time) {
        const nextScores = {
          ...bestTimes,
          [level]: { time: finalTime, name: 'Anonymous Intern' },
        };
        setBestTimes(nextScores);
        try {
          localStorage.setItem('win98_minesweeper_scores_v2', JSON.stringify(nextScores));
        } catch {}
      }
    }

    setGrid(g);
  };

  // Right-click cycle: unflagged -> flagged -> question mark (if allowed) -> unflagged
  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    const g = grid.map((row) => row.map((item) => ({ ...item })));
    const target = g[r][c];

    if (!target.isFlagged && !target.isQuestion) {
      // Set Flag
      target.isFlagged = true;
      target.isQuestion = false;
      setFlagsCount((prev) => prev + 1);
    } else if (target.isFlagged) {
      // Set Question Mark (if enabled) or clear
      target.isFlagged = false;
      setFlagsCount((prev) => prev - 1);
      if (allowMarks) {
        target.isQuestion = true;
      }
    } else if (target.isQuestion) {
      // Clear
      target.isQuestion = false;
    }

    setGrid(g);
  };

  // Chording: clicking a revealed number cell with both mouse buttons or middle click
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

  const setDifficulty = (presetKey) => {
    setLevel(presetKey);
    setConfig(PRESETS[presetKey]);
  };

  const applyCustomDifficulty = (e) => {
    e.preventDefault();
    const rows = Math.max(9, Math.min(24, parseInt(customRows, 10) || 9));
    const cols = Math.max(9, Math.min(30, parseInt(customCols, 10) || 9));
    const maxMines = Math.floor(rows * cols * 0.85);
    const mines = Math.max(10, Math.min(maxMines, parseInt(customMines, 10) || 10));

    const newCfg = {
      rows,
      cols,
      mines,
      name: 'Custom',
      width: Math.max(178, cols * 16 + 34),
      height: rows * 16 + 116,
    };
    setLevel('custom');
    setConfig(newCfg);
    setShowCustomDialog(false);
  };

  // Keyboard shortcut F2 = New Game
  useEffect(() => {
    if (!isOpen || !isActive) return;
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        initBoard(config);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isActive, config, initBoard]);

  // Menu items
  const menuItems = [
    {
      label: 'Game',
      items: [
        { label: 'New (F2)', onClick: () => initBoard(config) },
        { isSeparator: true },
        {
          label: 'Beginner',
          checked: level === 'beginner',
          onClick: () => setDifficulty('beginner'),
        },
        {
          label: 'Intermediate',
          checked: level === 'intermediate',
          onClick: () => setDifficulty('intermediate'),
        },
        {
          label: 'Expert',
          checked: level === 'expert',
          onClick: () => setDifficulty('expert'),
        },
        {
          label: 'Custom...',
          checked: level === 'custom',
          onClick: () => setShowCustomDialog(true),
        },
        { isSeparator: true },
        {
          label: 'Marks (?)',
          checked: allowMarks,
          onClick: () => setAllowMarks((v) => !v),
        },
        {
          label: 'Color',
          checked: true,
          disabled: true,
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

  const currentFace =
    gameState === 'lost'
      ? 'dead'
      : gameState === 'won'
      ? 'win'
      : isCellMouseDown
      ? 'scared'
      : 'smile';

  return (
    <>
      <Window
        id="window-minesweeper"
        title="Minesweeper"
        icon={<MinesweeperIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={false}
        zIndex={zIndex}
        position={position}
        defaultWidth={config.width}
        defaultHeight={config.height}
        resizable={false}
        allowMaximize={false}
        hasMenu={true}
        menuItems={menuItems}
        onFocus={onFocus}
        onMinimize={onMinimize}
        onClose={onClose}
      >
        <div
          style={{
            padding: '6px',
            background: '#C0C0C0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
            userSelect: 'none',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          }}
        >
          {/* Header HUD: Sunken Border containing Counter, Smiley, Timer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: `${config.cols * 16 + 6}px`,
              padding: '4px 6px',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              boxSizing: 'border-box',
              marginBottom: '6px',
            }}
          >
            {/* Mines Left Counter */}
            <SevenSegmentCounter value={config.mines - flagsCount} />

            {/* Smiley Button with raised 2px bevel */}
            <button
              onClick={() => initBoard(config)}
              style={{
                width: '26px',
                height: '26px',
                background: '#C0C0C0',
                boxShadow:
                  '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
              title="Reset Game"
              aria-label="Reset Game"
            >
              <SmileyFace state={currentFace} />
            </button>

            {/* Timer Counter */}
            <SevenSegmentCounter value={timer} />
          </div>

          {/* Minesweeper Playfield Grid with Sunken 3px Border */}
          <div
            style={{
              border: '3px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              display: 'inline-block',
              background: '#C0C0C0',
              boxSizing: 'border-box',
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
                  const isRevealed = cell.isRevealed;

                  return (
                    <div
                      key={`${r}-${c}`}
                      onMouseDown={(e) => {
                        if (e.button === 0 && !cell.isRevealed) {
                          setIsCellMouseDown(true);
                        }
                      }}
                      onClick={(e) => {
                        if (!cell.isRevealed) {
                          revealCell(r, c);
                        } else {
                          handleChord(r, c);
                        }
                      }}
                      onAuxClick={(e) => {
                        // Middle click chording
                        if (e.button === 1) {
                          e.preventDefault();
                          handleChord(r, c);
                        }
                      }}
                      onContextMenu={(e) => handleRightClick(e, r, c)}
                      style={{
                        width: '16px',
                        height: '16px',
                        boxSizing: 'border-box',
                        // Raised 2px bevel for unrevealed, flat 1px grey border for revealed
                        border: isRevealed ? '1px solid #7B7B7B' : '2px solid',
                        borderColor: isRevealed
                          ? '#7B7B7B'
                          : '#FFFFFF #808080 #808080 #FFFFFF',
                        background: cell.isExploded
                          ? '#FF0000'
                          : '#C0C0C0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: getNumberColor(cell.neighborMines),
                        cursor: 'default',
                        userSelect: 'none',
                      }}
                    >
                      {cell.isFlagged && !cell.isRevealed ? (
                        <span style={{ color: '#FF0000', fontSize: '10px' }}>🚩</span>
                      ) : cell.isQuestion && !cell.isRevealed ? (
                        <span style={{ color: '#000000', fontSize: '11px', fontWeight: 'bold' }}>?</span>
                      ) : cell.isFalseFlag ? (
                        <span style={{ color: '#CC0000', fontSize: '11px' }}>❌</span>
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
        </div>
      </Window>

      {/* Best Times Dialog */}
      {showBestTimes && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
          onClick={() => setShowBestTimes(false)}
        >
          <div
            className="win95-window win-dialog"
            style={{
              width: '260px',
              background: '#C0C0C0',
              boxShadow:
                '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
              padding: '3px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              fontSize: '11px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
                color: '#FFFFFF',
                padding: '2px 4px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Fastest Mine Sweepers</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td>Beginner:</td>
                    <td>{bestTimes.beginner.time} seconds</td>
                    <td style={{ color: '#555' }}>{bestTimes.beginner.name}</td>
                  </tr>
                  <tr>
                    <td>Intermediate:</td>
                    <td>{bestTimes.intermediate.time} seconds</td>
                    <td style={{ color: '#555' }}>{bestTimes.intermediate.name}</td>
                  </tr>
                  <tr>
                    <td>Expert:</td>
                    <td>{bestTimes.expert.time} seconds</td>
                    <td style={{ color: '#555' }}>{bestTimes.expert.name}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowBestTimes(false)}
                  style={{
                    width: '65px',
                    height: '22px',
                    background: '#C0C0C0',
                    boxShadow:
                      '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
                    border: 'none',
                    fontSize: '11px',
                    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                    cursor: 'pointer',
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Game Dialog */}
      {showCustomDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
          onClick={() => setShowCustomDialog(false)}
        >
          <div
            className="win95-window win-dialog"
            style={{
              width: '220px',
              background: '#C0C0C0',
              boxShadow:
                '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
              padding: '3px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              fontSize: '11px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
                color: '#FFFFFF',
                padding: '2px 4px',
                fontWeight: 'bold',
              }}
            >
              Custom Field
            </div>
            <form onSubmit={applyCustomDifficulty} style={{ padding: '12px 14px', margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                <span>Height:</span>
                <input
                  type="number"
                  min="9"
                  max="24"
                  value={customRows}
                  onChange={(e) => setCustomRows(e.target.value)}
                  style={{ width: '50px', padding: '1px 3px', border: '2px inset #DFDFDF' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                <span>Width:</span>
                <input
                  type="number"
                  min="9"
                  max="30"
                  value={customCols}
                  onChange={(e) => setCustomCols(e.target.value)}
                  style={{ width: '50px', padding: '1px 3px', border: '2px inset #DFDFDF' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                <span>Mines:</span>
                <input
                  type="number"
                  min="10"
                  max="668"
                  value={customMines}
                  onChange={(e) => setCustomMines(e.target.value)}
                  style={{ width: '50px', padding: '1px 3px', border: '2px inset #DFDFDF' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '2px 12px',
                    background: '#C0C0C0',
                    boxShadow:
                      '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
                    border: 'none',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomDialog(false)}
                  style={{
                    padding: '2px 12px',
                    background: '#C0C0C0',
                    boxShadow:
                      '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
                    border: 'none',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* About Minesweeper Dialog */}
      <AboutAppDialog
        isOpen={showAboutDialog}
        appName="Minesweeper"
        version="Version 4.10.1998"
        icon={<MinesweeperIconSmall />}
        description="One wrong click and everything blows up. Familiar feeling."
        onClose={() => setShowAboutDialog(false)}
      />
    </>
  );
}
