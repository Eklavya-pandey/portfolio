import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';

// Small Chess Icon for TitleBar
export const ChessIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="12" width="12" height="3" fill="#000" />
    <path
      d="M4 12V9C4 7 5 6 5 4C5 3 6 2 8 2C10 2 11 3 11 4C11 6 12 7 12 9V12H4Z"
      fill="#FFF"
      stroke="#000"
      strokeWidth="1"
    />
    <circle cx="8" cy="3" r="1.5" fill="#CC0000" />
  </svg>
);

// High-contrast, authentic vector chess piece set
function ChessPiece({ type, color }) {
  const isWhite = color === 'w';
  const fill = isWhite ? '#FFFFFF' : '#222222';
  const stroke = isWhite ? '#000000' : '#E0E0E0';
  const accent = isWhite ? '#C0C0C0' : '#444444';

  switch (type.toLowerCase()) {
    case 'p': // Pawn
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <ellipse cx="17" cy="11" rx="5" ry="5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M12 28 H22 L19 16 H15 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="10" y="27" width="14" height="3" rx="1" fill={accent} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'r': // Rook
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <path
            d="M9 10 H13 V13 H15 V10 H19 V13 H21 V10 H25 V14 H22 L21 26 H13 L12 14 H9 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <rect x="8" y="26" width="18" height="4" rx="1" fill={accent} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'n': // Knight
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <path
            d="M12 28 H22 L22 22 C22 17 25 15 25 10 C25 6 20 6 18 8 L14 7 C11 9 10 12 11 15 L14 15 C13 18 11 20 12 28 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle cx="19" cy="11" r="1.5" fill={stroke} />
        </svg>
      );
    case 'b': // Bishop
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="17" cy="7" r="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path
            d="M12 28 H22 L20 18 C22 15 22 11 17 9 C12 11 12 15 14 18 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <line x1="17" y1="12" x2="17" y2="18" stroke={stroke} strokeWidth="1.5" />
          <line x1="14" y1="15" x2="20" y2="15" stroke={stroke} strokeWidth="1.5" />
          <rect x="9" y="27" width="16" height="3" rx="1" fill={accent} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'q': // Queen
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="17" cy="7" r="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="9" cy="9" r="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="25" cy="9" r="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path
            d="M9 13 L13 25 H21 L25 13 L20 18 L17 10 L14 18 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <rect x="8" y="26" width="18" height="4" rx="1" fill={accent} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'k': // King
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <line x1="17" y1="4" x2="17" y2="10" stroke={stroke} strokeWidth="2" />
          <line x1="14" y1="7" x2="20" y2="7" stroke={stroke} strokeWidth="2" />
          <path
            d="M11 13 L12 25 H22 L23 13 C21 16 19 14 17 12 C15 14 13 16 11 13 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <rect x="8" y="26" width="18" height="4" rx="1" fill={accent} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

// Evaluation values for AI
const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Positional bonuses (higher for center & advancing)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0,
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

function evaluateBoard(game) {
  let totalScore = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let value = PIECE_VALUES[piece.type] || 0;
      const squareIndex = piece.color === 'w' ? (7 - r) * 8 + c : r * 8 + c;

      if (piece.type === 'p') {
        value += PAWN_TABLE[squareIndex];
      } else if (piece.type === 'n') {
        value += KNIGHT_TABLE[squareIndex];
      }

      if (piece.color === 'b') {
        totalScore += value;
      } else {
        totalScore -= value;
      }
    }
  }
  return totalScore;
}

// Minimax with Alpha-Beta Pruning for Black
function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Find best move for Black
function findBestMove(game, level = 'Medium') {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Easy: pick random move 30% of the time, else depth 1
  if (level === 'Easy') {
    if (Math.random() < 0.35) {
      return moves[Math.floor(Math.random() * moves.length)];
    }
    let bestScore = -Infinity;
    let bestMove = moves[0];
    for (const m of moves) {
      game.move(m);
      const score = evaluateBoard(game) + (Math.random() * 20 - 10);
      game.undo();
      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    }
    return bestMove;
  }

  // Medium: Depth 2
  // Hard: Depth 3
  const depth = level === 'Hard' ? 3 : 2;
  let bestScore = -Infinity;
  let bestMoves = [];

  for (const move of moves) {
    game.move(move);
    const score = minimax(game, depth - 1, -Infinity, Infinity, false);
    game.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export default function ChessWindow({
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
  const [game, setGame] = useState(() => new Chess());
  const [boardState, setBoardState] = useState(() => game.board());
  const [selectedSquare, setSelectedSquare] = useState(null); // 'e2'
  const [legalMoves, setLegalMoves] = useState([]); // array of 'e4'
  const [lastMove, setLastMove] = useState(null); // { from: 'e2', to: 'e4' }
  const [level, setLevel] = useState('Medium'); // 'Easy' | 'Medium' | 'Hard'
  const [isThinking, setIsThinking] = useState(false);

  // Promotion Dialog state: { from, to }
  const [pendingPromotion, setPendingPromotion] = useState(null);

  // Game over state
  const [gameOverInfo, setGameOverInfo] = useState(null); // { title, message }
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const computerTimerRef = useRef(null);

  // New Game handler
  const handleNewGame = useCallback(() => {
    if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
    const newG = new Chess();
    setGame(newG);
    setBoardState(newG.board());
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setIsThinking(false);
    setPendingPromotion(null);
    setGameOverInfo(null);
  }, []);

  // Computer Move
  const triggerComputerMove = useCallback(
    (currentGame) => {
      setIsThinking(true);
      if (computerTimerRef.current) clearTimeout(computerTimerRef.current);

      computerTimerRef.current = setTimeout(() => {
        if (currentGame.isGameOver()) {
          setIsThinking(false);
          return;
        }

        const best = findBestMove(currentGame, level);
        if (best) {
          currentGame.move(best);
          setGame(new Chess(currentGame.fen()));
          setBoardState(currentGame.board());
          setLastMove({ from: best.from, to: best.to });
          setIsThinking(false);

          // Check for game over after computer move
          if (currentGame.isGameOver()) {
            if (currentGame.isCheckmate()) {
              setGameOverInfo({
                title: 'Checkmate',
                message: "You lost to a computer. It's fine.",
              });
            } else if (currentGame.isDraw()) {
              setGameOverInfo({
                title: 'Draw',
                message: 'The game ended in a draw.',
              });
            }
          }
        } else {
          setIsThinking(false);
        }
      }, 400);
    },
    [level]
  );

  // Clean up timer
  useEffect(() => {
    return () => {
      if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
    };
  }, []);

  // Execute human player move
  const applyPlayerMove = (from, to, promotion = 'q') => {
    try {
      const move = game.move({ from, to, promotion });
      if (move) {
        setGame(new Chess(game.fen()));
        setBoardState(game.board());
        setLastMove({ from, to });
        setSelectedSquare(null);
        setLegalMoves([]);
        setPendingPromotion(null);

        // Check if player won
        if (game.isGameOver()) {
          if (game.isCheckmate()) {
            setGameOverInfo({
              title: 'Checkmate',
              message: 'Beginner\'s luck.',
            });
          } else if (game.isDraw()) {
            setGameOverInfo({
              title: 'Draw',
              message: 'The game ended in a draw.',
            });
          }
          return;
        }

        // Trigger computer turn
        triggerComputerMove(game);
      }
    } catch {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Square Click handler
  const handleSquareClick = (r, c) => {
    if (isThinking || gameOverInfo || pendingPromotion) return;
    if (game.turn() !== 'w') return; // Human is White only

    const file = String.fromCharCode('a'.charCodeAt(0) + c);
    const rank = (8 - r).toString();
    const square = `${file}${rank}`;

    // If already selected and clicking target square
    if (selectedSquare) {
      if (legalMoves.includes(square)) {
        // Check for pawn promotion
        const piece = game.get(selectedSquare);
        if (piece && piece.type === 'p' && square[1] === '8') {
          setPendingPromotion({ from: selectedSquare, to: square });
          return;
        }
        applyPlayerMove(selectedSquare, square);
        return;
      }
    }

    // Select White piece
    const piece = game.get(square);
    if (piece && piece.color === 'w') {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Undo (undoes both White and Black moves so player is back on their turn)
  const handleUndo = () => {
    if (isThinking) return;
    if (computerTimerRef.current) clearTimeout(computerTimerRef.current);

    game.undo(); // Undo Black's move
    game.undo(); // Undo White's move
    setGame(new Chess(game.fen()));
    setBoardState(game.board());
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setGameOverInfo(null);
  };

  // Resign
  const handleResign = () => {
    if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
    setGameOverInfo({
      title: 'Resignation',
      message: "You lost to a computer. It's fine.",
    });
  };

  // Menu items
  const menuItems = [
    {
      label: 'Game',
      items: [
        { label: 'New Game (F2)', onClick: handleNewGame },
        { label: 'Undo', onClick: handleUndo },
        { isSeparator: true },
        {
          label: 'Level: Easy',
          checked: level === 'Easy',
          onClick: () => setLevel('Easy'),
        },
        {
          label: 'Level: Medium',
          checked: level === 'Medium',
          onClick: () => setLevel('Medium'),
        },
        {
          label: 'Level: Hard',
          checked: level === 'Hard',
          onClick: () => setLevel('Hard'),
        },
        { isSeparator: true },
        { label: 'Resign', onClick: handleResign },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Chess',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  // Status text for status bar
  const statusLine = isThinking
    ? 'Computer is thinking...'
    : gameOverInfo
    ? gameOverInfo.title
    : game.isCheck()
    ? 'White to move (CHECK!)'
    : 'White to move';

  // Format move history into numbered list (1. e4 e5)
  const history = game.history();
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] || '',
    });
  }

  // Files and ranks coordinates
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <>
      <Window
        id="window-chess"
        title="Chess"
        icon={<ChessIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={isMaximized}
        zIndex={zIndex}
        position={position}
        defaultWidth={560}
        defaultHeight={460}
        resizable={true}
        allowMaximize={true}
        hasMenu={true}
        menuItems={menuItems}
        hasStatusBar={true}
        statusText={statusLine}
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
            gap: '12px',
            overflow: 'auto',
            userSelect: 'none',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          }}
        >
          {/* Board with Edge Coordinates (a-h, 1-8) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '3px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              background: '#C0C0C0',
              flexShrink: 0,
            }}
          >
            {/* Top Files Coordinate Row */}
            <div style={{ display: 'flex', paddingLeft: '16px', height: '14px', alignItems: 'center' }}>
              {files.map((f) => (
                <div
                  key={`top-${f}`}
                  style={{
                    width: '42px',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#404040',
                  }}
                >
                  {f}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex' }}>
              {/* Left Ranks Coordinate Column */}
              <div
                style={{
                  width: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                {ranks.map((r) => (
                  <div key={`left-${r}`} style={{ fontSize: '10px', fontWeight: 'bold', color: '#404040' }}>
                    {r}
                  </div>
                ))}
              </div>

              {/* 8x8 Board Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 42px)',
                  gridTemplateRows: 'repeat(8, 42px)',
                  border: '1px solid #404040',
                }}
              >
                {boardState.map((row, r) =>
                  row.map((cell, c) => {
                    const isLight = (r + c) % 2 === 0;
                    const square = `${files[c]}${ranks[r]}`;
                    const isSelected = selectedSquare === square;
                    const isLegalTarget = legalMoves.includes(square);
                    const isLastMoveSquare =
                      lastMove && (lastMove.from === square || lastMove.to === square);

                    // Check highlight for checked king
                    const isKingInCheck =
                      cell &&
                      cell.type === 'k' &&
                      cell.color === game.turn() &&
                      game.isCheck();

                    let bg = isLight ? '#FFF8DC' : '#8B5A2B';
                    if (isKingInCheck) bg = '#FF6B6B';
                    else if (isSelected) bg = '#FFFF77';
                    else if (isLastMoveSquare) bg = isLight ? '#FFFACD' : '#A27D4E';

                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => handleSquareClick(r, c)}
                        style={{
                          width: '42px',
                          height: '42px',
                          background: bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isThinking ? 'wait' : 'pointer',
                          position: 'relative',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Legal Target Dot Indicator */}
                        {isLegalTarget && !cell && (
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'rgba(0, 0, 0, 0.3)',
                              pointerEvents: 'none',
                            }}
                          />
                        )}

                        {/* Capture Target Ring */}
                        {isLegalTarget && cell && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: '3px',
                              borderRadius: '50%',
                              border: '2px solid rgba(200, 0, 0, 0.6)',
                              pointerEvents: 'none',
                            }}
                          />
                        )}

                        {/* Chess Piece */}
                        {cell && <ChessPiece type={cell.type} color={cell.color} />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Ranks Coordinate Column */}
              <div
                style={{
                  width: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                {ranks.map((r) => (
                  <div key={`right-${r}`} style={{ fontSize: '10px', fontWeight: 'bold', color: '#404040' }}>
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Files Coordinate Row */}
            <div style={{ display: 'flex', paddingLeft: '16px', height: '14px', alignItems: 'center' }}>
              {files.map((f) => (
                <div
                  key={`bot-${f}`}
                  style={{
                    width: '42px',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#404040',
                  }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Match Details & Numbered Move History */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minWidth: '150px',
            }}
          >
            {/* Status Box */}
            <div
              style={{
                padding: '6px 8px',
                background: '#FFFFFF',
                boxShadow:
                  '1px 1px 0px #808080 inset, -1px -1px 0px #DFDFDF inset, 2px 2px 0px #000000 inset, -2px -2px 0px #FFFFFF inset',
                fontSize: '11px',
                fontWeight: 'bold',
                color: game.isCheck() ? '#CC0000' : '#000000',
              }}
            >
              {statusLine}
            </div>

            {/* Match Level Indicator */}
            <div style={{ fontSize: '11px', color: '#333333' }}>
              Difficulty: <strong>{level}</strong> | Computer: <strong>Black</strong>
            </div>

            {/* Move History Numbered List */}
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Move History:</div>
            <div
              style={{
                flex: 1,
                background: '#FFFFFF',
                boxShadow:
                  '1px 1px 0px #808080 inset, -1px -1px 0px #DFDFDF inset, 2px 2px 0px #000000 inset, -2px -2px 0px #FFFFFF inset',
                padding: '6px 8px',
                overflowY: 'auto',
                fontSize: '11px',
                fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                maxHeight: '260px',
              }}
            >
              {movePairs.length === 0 ? (
                <span style={{ color: '#888888' }}>Game in progress...</span>
              ) : (
                movePairs.map((pair) => (
                  <div
                    key={`turn-${pair.num}`}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      lineHeight: '16px',
                    }}
                  >
                    <span style={{ width: '22px', color: '#666666' }}>{pair.num}.</span>
                    <span style={{ width: '48px', fontWeight: 'bold' }}>{pair.white}</span>
                    <span style={{ width: '48px' }}>{pair.black}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Window>

      {/* Promotion Dialog */}
      {pendingPromotion && (
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
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
                color: '#FFFFFF',
                padding: '2px 4px',
                fontWeight: 'bold',
              }}
            >
              Pawn Promotion
            </div>
            <div style={{ padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ marginBottom: '10px' }}>Choose promotion piece:</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[
                  { type: 'q', label: 'Queen' },
                  { type: 'r', label: 'Rook' },
                  { type: 'b', label: 'Bishop' },
                  { type: 'n', label: 'Knight' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() =>
                      applyPlayerMove(pendingPromotion.from, pendingPromotion.to, item.type)
                    }
                    style={{
                      padding: '4px 8px',
                      background: '#C0C0C0',
                      boxShadow:
                        '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
                      border: 'none',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <ChessPiece type={item.type} color="w" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Message Dialog */}
      {gameOverInfo && (
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
          onClick={() => setGameOverInfo(null)}
        >
          <div
            className="win95-window win-dialog"
            style={{
              width: '280px',
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
              {gameOverInfo.title}
            </div>
            <div style={{ padding: '16px 20px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '12px' }}>
                {gameOverInfo.message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  onClick={handleNewGame}
                  style={{
                    padding: '3px 14px',
                    background: '#C0C0C0',
                    boxShadow:
                      '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
                    border: 'none',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  New Game
                </button>
                <button
                  onClick={() => setGameOverInfo(null)}
                  style={{
                    padding: '3px 14px',
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Chess Dialog */}
      <AboutAppDialog
        isOpen={showAboutDialog}
        appName="Chess"
        version="Version 4.10.1998"
        icon={<ChessIconSmall />}
        description="A game of wits against silicon. Silicon usually wins."
        onClose={() => setShowAboutDialog(false)}
      />
    </>
  );
}
