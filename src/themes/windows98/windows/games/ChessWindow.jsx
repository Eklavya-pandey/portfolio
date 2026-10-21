import React, { useState, useEffect, useCallback, useRef } from 'react';
import Window from '../../components/Window';

// Small Chess Icon
export const ChessIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="12" width="12" height="3" fill="#000" />
    <path d="M4 12V9C4 7 5 6 5 4C5 3 6 2 8 2C10 2 11 3 11 4C11 6 12 7 12 9V12H4Z" fill="#FFF" stroke="#000" strokeWidth="1" />
    <circle cx="8" cy="3" r="1.5" fill="#CC0000" />
  </svg>
);

// Pixel/Flat Chess Pieces drawn with SVG
function ChessPiece({ type, color }) {
  const isWhite = color === 'w';
  const fillColor = isWhite ? '#FFFFFF' : '#222222';
  const strokeColor = isWhite ? '#000000' : '#CCCCCC';

  switch (type.toLowerCase()) {
    case 'p': // Pawn
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <ellipse cx="17" cy="11" rx="5" ry="5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M12 28 H22 L19 16 H15 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <rect x="10" y="27" width="14" height="3" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'r': // Rook
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <path d="M9 10 H13 V13 H15 V10 H19 V13 H21 V10 H25 V14 H22 L21 26 H13 L12 14 H9 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <rect x="8" y="26" width="18" height="4" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'n': // Knight
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <path d="M12 28 H22 L22 22 C22 17 25 15 25 10 C25 6 20 6 18 8 L14 7 C11 9 10 12 11 15 L14 15 C13 18 11 20 12 28 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="19" cy="11" r="1.2" fill={strokeColor} />
        </svg>
      );
    case 'b': // Bishop
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="17" cy="7" r="2" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <path d="M12 28 H22 L20 18 C22 15 22 11 17 9 C12 11 12 15 14 18 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <line x1="17" y1="12" x2="17" y2="18" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="14" y1="15" x2="20" y2="15" stroke={strokeColor} strokeWidth="1.5" />
          <rect x="9" y="27" width="16" height="3" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'q': // Queen
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="17" cy="7" r="2" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <circle cx="9" cy="9" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <circle cx="25" cy="9" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <path d="M9 13 L13 25 H21 L25 13 L20 18 L17 10 L14 18 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <rect x="8" y="26" width="18" height="4" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'k': // King
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          {/* Cross */}
          <line x1="17" y1="4" x2="17" y2="10" stroke={strokeColor} strokeWidth="2" />
          <line x1="14" y1="7" x2="20" y2="7" stroke={strokeColor} strokeWidth="2" />
          {/* Crown */}
          <path d="M11 13 L12 25 H22 L23 13 C21 16 19 14 17 12 C15 14 13 16 11 13 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <rect x="8" y="26" width="18" height="4" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

// Initial Board State
function getInitialBoard() {
  const b = Array(8).fill(null).map(() => Array(8).fill(null));

  // Black pieces (top: row 0 & 1)
  const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  for (let c = 0; c < 8; c++) {
    b[0][c] = { type: backRank[c], color: 'b' };
    b[1][c] = { type: 'p', color: 'b' };
  }

  // White pieces (bottom: row 6 & 7)
  for (let c = 0; c < 8; c++) {
    b[6][c] = { type: 'p', color: 'w' };
    b[7][c] = { type: backRank[c], color: 'w' };
  }
  return b;
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
  const [board, setBoard] = useState(getInitialBoard);
  const [turn, setTurn] = useState('w'); // 'w' | 'b'
  const [selectedSquare, setSelectedSquare] = useState(null); // [r, c]
  const [legalMoves, setLegalMoves] = useState([]); // array of [r, c]
  const [moveHistory, setMoveHistory] = useState([]); // algebraic strings
  const [castlingRights, setCastlingRights] = useState({
    wK: true,
    wQ: true,
    bK: true,
    bQ: true,
  });
  const [enPassantTarget, setEnPassantTarget] = useState(null); // [r, c] square that can be captured
  const [gameStatus, setGameStatus] = useState('White to move');
  const [isCheck, setIsCheck] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Close dialog on Escape key
  useEffect(() => {
    if (!showAboutDialog) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowAboutDialog(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showAboutDialog]);

  // Keyboard navigation cursor [r, c]
  const [cursorPos, setCursorPos] = useState([6, 4]); // Start at e2
  const boardContainerRef = useRef(null);

  // New game reset
  const handleNewGame = useCallback(() => {
    setBoard(getInitialBoard());
    setTurn('w');
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setCastlingRights({ wK: true, wQ: true, bK: true, bQ: true });
    setEnPassantTarget(null);
    setGameStatus('White to move');
    setIsCheck(false);
    setIsGameOver(false);
    setCursorPos([6, 4]);
  }, []);

  // Is square attacked by opponent color
  const isSquareAttacked = useCallback((r, c, attackerColor, currentBoard) => {
    // 1. Pawn attacks
    const pawnDir = attackerColor === 'w' ? -1 : 1;
    const pawnR = r - pawnDir;
    for (const dc of [-1, 1]) {
      const pc = c + dc;
      if (pawnR >= 0 && pawnR < 8 && pc >= 0 && pc < 8) {
        const piece = currentBoard[pawnR][pc];
        if (piece && piece.color === attackerColor && piece.type === 'p') {
          return true;
        }
      }
    }

    // 2. Knight attacks
    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];
    for (const [dr, dc] of knightOffsets) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const piece = currentBoard[nr][nc];
        if (piece && piece.color === attackerColor && piece.type === 'n') {
          return true;
        }
      }
    }

    // 3. Orthogonal rays (Rook & Queen)
    const ortho = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of ortho) {
      let step = 1;
      while (true) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
        const p = currentBoard[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'r' || p.type === 'q')) {
            return true;
          }
          break;
        }
        step++;
      }
    }

    // 4. Diagonal rays (Bishop & Queen)
    const diag = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diag) {
      let step = 1;
      while (true) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
        const p = currentBoard[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'b' || p.type === 'q')) {
            return true;
          }
          break;
        }
        step++;
      }
    }

    // 5. King attacks
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const p = currentBoard[nr][nc];
          if (p && p.color === attackerColor && p.type === 'k') {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Locate King
  const findKing = useCallback((color, currentBoard) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && p.color === color && p.type === 'k') {
          return [r, c];
        }
      }
    }
    return null;
  }, []);

  // Compute Pseudo-Legal Moves for piece at [r, c]
  const getPseudoLegalMoves = useCallback(
    (r, c, currentBoard, rights, epTarget) => {
      const piece = currentBoard[r][c];
      if (!piece) return [];
      const moves = [];
      const { type, color } = piece;
      const enemyColor = color === 'w' ? 'b' : 'w';

      if (type === 'p') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;

        // 1 step forward
        if (r + dir >= 0 && r + dir < 8 && !currentBoard[r + dir][c]) {
          moves.push([r + dir, c]);
          // 2 steps forward from start
          if (r === startRow && !currentBoard[r + 2 * dir][c]) {
            moves.push([r + 2 * dir, c]);
          }
        }

        // Diagonal captures
        for (const dc of [-1, 1]) {
          const nr = r + dir;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = currentBoard[nr][nc];
            if (target && target.color === enemyColor) {
              moves.push([nr, nc]);
            } else if (epTarget && epTarget[0] === nr && epTarget[1] === nc) {
              moves.push([nr, nc]); // En Passant!
            }
          }
        }
      } else if (type === 'n') {
        const jumps = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1],
        ];
        for (const [dr, dc] of jumps) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = currentBoard[nr][nc];
            if (!target || target.color === enemyColor) {
              moves.push([nr, nc]);
            }
          }
        }
      } else if (type === 'b' || type === 'r' || type === 'q') {
        const directions = [];
        if (type === 'b' || type === 'q') {
          directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        }
        if (type === 'r' || type === 'q') {
          directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
        }
        for (const [dr, dc] of directions) {
          let step = 1;
          while (true) {
            const nr = r + dr * step;
            const nc = c + dc * step;
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
            const target = currentBoard[nr][nc];
            if (!target) {
              moves.push([nr, nc]);
            } else {
              if (target.color === enemyColor) {
                moves.push([nr, nc]);
              }
              break;
            }
            step++;
          }
        }
      } else if (type === 'k') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const target = currentBoard[nr][nc];
              if (!target || target.color === enemyColor) {
                moves.push([nr, nc]);
              }
            }
          }
        }

        // Castling
        const kingRow = color === 'w' ? 7 : 0;
        if (r === kingRow && c === 4) {
          const kRight = color === 'w' ? rights.wK : rights.bK;
          const qRight = color === 'w' ? rights.wQ : rights.bQ;

          // Kingside (e1->g1 / e8->g8)
          if (
            kRight &&
            !currentBoard[kingRow][5] &&
            !currentBoard[kingRow][6] &&
            !isSquareAttacked(kingRow, 4, enemyColor, currentBoard) &&
            !isSquareAttacked(kingRow, 5, enemyColor, currentBoard) &&
            !isSquareAttacked(kingRow, 6, enemyColor, currentBoard)
          ) {
            moves.push([kingRow, 6]);
          }

          // Queenside (e1->c1 / e8->c8)
          if (
            qRight &&
            !currentBoard[kingRow][3] &&
            !currentBoard[kingRow][2] &&
            !currentBoard[kingRow][1] &&
            !isSquareAttacked(kingRow, 4, enemyColor, currentBoard) &&
            !isSquareAttacked(kingRow, 3, enemyColor, currentBoard) &&
            !isSquareAttacked(kingRow, 2, enemyColor, currentBoard)
          ) {
            moves.push([kingRow, 2]);
          }
        }
      }
      return moves;
    },
    [isSquareAttacked]
  );

  // Filter legal moves (cannot leave own king in check)
  const getStrictLegalMoves = useCallback(
    (r, c, currentBoard, rights, epTarget) => {
      const piece = currentBoard[r][c];
      if (!piece) return [];
      const enemyColor = piece.color === 'w' ? 'b' : 'w';
      const pseudo = getPseudoLegalMoves(r, c, currentBoard, rights, epTarget);

      return pseudo.filter(([tr, tc]) => {
        // Simulate move on a cloned board
        const simBoard = currentBoard.map((row) => [...row]);
        simBoard[tr][tc] = piece;
        simBoard[r][c] = null;

        // Handle en passant capture removal
        if (piece.type === 'p' && epTarget && tr === epTarget[0] && tc === epTarget[1]) {
          const capRow = piece.color === 'w' ? tr + 1 : tr - 1;
          simBoard[capRow][tc] = null;
        }

        // Handle castling rook movement in sim
        if (piece.type === 'k' && Math.abs(tc - c) === 2) {
          if (tc === 6) {
            simBoard[tr][5] = simBoard[tr][7];
            simBoard[tr][7] = null;
          } else if (tc === 2) {
            simBoard[tr][3] = simBoard[tr][0];
            simBoard[tr][0] = null;
          }
        }

        const kingPos = findKing(piece.color, simBoard);
        if (!kingPos) return false;
        return !isSquareAttacked(kingPos[0], kingPos[1], enemyColor, simBoard);
      });
    },
    [getPseudoLegalMoves, findKing, isSquareAttacked]
  );

  // Compute all legal moves for a player
  const getAllPlayerMoves = useCallback(
    (color, currentBoard, rights, epTarget) => {
      const all = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (currentBoard[r][c] && currentBoard[r][c].color === color) {
            const moves = getStrictLegalMoves(r, c, currentBoard, rights, epTarget);
            for (const m of moves) {
              all.push({ from: [r, c], to: m });
            }
          }
        }
      }
      return all;
    },
    [getStrictLegalMoves]
  );

  // Execute Move
  const executeMove = (from, to) => {
    const [fr, fc] = from;
    const [tr, tc] = to;
    const piece = board[fr][fc];
    if (!piece) return;

    const nextBoard = board.map((row) => [...row]);
    const enemyColor = turn === 'w' ? 'b' : 'w';
    let isCapture = !!nextBoard[tr][tc];

    // Handle En Passant
    if (piece.type === 'p' && enPassantTarget && tr === enPassantTarget[0] && tc === enPassantTarget[1]) {
      const capRow = turn === 'w' ? tr + 1 : tr - 1;
      nextBoard[capRow][tc] = null;
      isCapture = true;
    }

    // Move piece
    nextBoard[tr][tc] = piece;
    nextBoard[fr][fc] = null;

    // Handle Promotion (auto Queen)
    if (piece.type === 'p' && (tr === 0 || tr === 7)) {
      nextBoard[tr][tc] = { type: 'q', color: turn };
    }

    // Handle Castling
    let castlingString = null;
    if (piece.type === 'k' && Math.abs(tc - fc) === 2) {
      if (tc === 6) {
        // Kingside
        nextBoard[tr][5] = nextBoard[tr][7];
        nextBoard[tr][7] = null;
        castlingString = 'O-O';
      } else if (tc === 2) {
        // Queenside
        nextBoard[tr][3] = nextBoard[tr][0];
        nextBoard[tr][0] = null;
        castlingString = 'O-O-O';
      }
    }

    // Update Castling rights
    const nextRights = { ...castlingRights };
    if (piece.type === 'k') {
      if (turn === 'w') {
        nextRights.wK = false;
        nextRights.wQ = false;
      } else {
        nextRights.bK = false;
        nextRights.bQ = false;
      }
    }
    if (piece.type === 'r') {
      if (fr === 7 && fc === 0) nextRights.wQ = false;
      if (fr === 7 && fc === 7) nextRights.wK = false;
      if (fr === 0 && fc === 0) nextRights.bQ = false;
      if (fr === 0 && fc === 7) nextRights.bK = false;
    }

    // Update En Passant target
    let nextEp = null;
    if (piece.type === 'p' && Math.abs(tr - fr) === 2) {
      nextEp = [turn === 'w' ? fr - 1 : fr + 1, fc];
    }

    // Construct Algebraic Move String
    const colsLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rowsLabels = ['8', '7', '6', '5', '4', '3', '2', '1'];
    let moveNotation = '';
    if (castlingString) {
      moveNotation = castlingString;
    } else {
      const pUpper = piece.type.toUpperCase();
      if (piece.type === 'p') {
        if (isCapture) {
          moveNotation = `${colsLabels[fc]}x${colsLabels[tc]}${rowsLabels[tr]}`;
        } else {
          moveNotation = `${colsLabels[tc]}${rowsLabels[tr]}`;
        }
        if (tr === 0 || tr === 7) moveNotation += '=Q';
      } else {
        moveNotation = `${pUpper}${isCapture ? 'x' : ''}${colsLabels[tc]}${rowsLabels[tr]}`;
      }
    }

    // Next turn
    const nextTurn = enemyColor;

    // Check / Checkmate / Stalemate evaluation on opponent
    const oppKing = findKing(nextTurn, nextBoard);
    const inCheck = oppKing ? isSquareAttacked(oppKing[0], oppKing[1], turn, nextBoard) : false;
    const oppMoves = getAllPlayerMoves(nextTurn, nextBoard, nextRights, nextEp);

    if (inCheck) {
      moveNotation += oppMoves.length === 0 ? '#' : '+';
    }

    setBoard(nextBoard);
    setCastlingRights(nextRights);
    setEnPassantTarget(nextEp);
    setTurn(nextTurn);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory((prev) => [...prev, moveNotation]);
    setIsCheck(inCheck);

    if (oppMoves.length === 0) {
      setIsGameOver(true);
      if (inCheck) {
        setGameStatus(`Checkmate! ${turn === 'w' ? 'White' : 'Black'} wins!`);
      } else {
        setGameStatus('Stalemate! Game is a draw.');
      }
    } else {
      setGameStatus(`${nextTurn === 'w' ? 'White' : 'Black'} to move${inCheck ? ' (CHECK!)' : ''}`);
    }
  };

  // Click on square
  const handleSquareClick = (r, c) => {
    if (isGameOver) return;

    if (selectedSquare) {
      const [sr, sc] = selectedSquare;
      const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);
      if (isLegal) {
        executeMove([sr, sc], [r, c]);
        return;
      }
    }

    const clickedPiece = board[r][c];
    if (clickedPiece && clickedPiece.color === turn) {
      setSelectedSquare([r, c]);
      const moves = getStrictLegalMoves(r, c, board, castlingRights, enPassantTarget);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Keyboard navigation on board
  const handleKeyDown = (e) => {
    const [cr, cc] = cursorPos;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursorPos([Math.max(0, cr - 1), cc]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursorPos([Math.min(7, cr + 1), cc]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCursorPos([cr, Math.max(0, cc - 1)]);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCursorPos([cr, Math.min(7, cc + 1)]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSquareClick(cr, cc);
    }
  };

  const menuItems = [
    {
      label: 'Game',
      items: [
        { label: 'New Game (F2)', onClick: handleNewGame },
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

  return (
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
      hasMenu={true}
      menuItems={menuItems}
      hasStatusBar={true}
      statusText={gameStatus}
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
        }}
      >
        {/* Chess Board Container (Accessible via keyboard Tab & Arrow keys) */}
        <div
          ref={boardContainerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Chess Board"
          style={{
            display: 'inline-block',
            border: '3px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            outline: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 42px)',
              gridTemplateRows: 'repeat(8, 42px)',
              background: '#C0C0C0',
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isLight = (r + c) % 2 === 0;
                const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c;
                const isLegalTarget = legalMoves.some(([mr, mc]) => mr === r && mc === c);
                const isCursor = cursorPos[0] === r && cursorPos[1] === c;

                let bg = isLight ? '#FFF8DC' : '#8B5A2B'; // Classic wood/ivory squares
                if (isSelected) bg = '#FFFF77';
                else if (isLegalTarget) bg = isLight ? '#C1E1C1' : '#6E8B3D';

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => {
                      setCursorPos([r, c]);
                      handleSquareClick(r, c);
                    }}
                    style={{
                      width: '42px',
                      height: '42px',
                      background: bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      boxSizing: 'border-box',
                      border: isCursor ? '2px dashed #0000FF' : 'none',
                    }}
                  >
                    {/* Legal target dot indicator if square is empty */}
                    {isLegalTarget && !cell && (
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.3)',
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
        </div>

        {/* Right Panel: Turn Status, Move List, New Game Button */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '150px',
          }}
        >
          {/* Turn / Check Status Box */}
          <div
            style={{
              padding: '6px 8px',
              background: '#FFFFFF',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              fontSize: '11px',
              fontWeight: 'bold',
              color: isCheck ? '#CC0000' : '#000000',
            }}
          >
            {gameStatus}
          </div>

          {/* New Game Button */}
          <button
            className="win-btn"
            onClick={handleNewGame}
            style={{
              padding: '4px 10px',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            New Game
          </button>

          {/* Moves History List */}
          <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Move History:</div>
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              padding: '4px 6px',
              overflowY: 'auto',
              fontSize: '11px',
              fontFamily: "'Courier New', Courier, monospace",
              maxHeight: '260px',
            }}
          >
            {moveHistory.length === 0 ? (
              <span style={{ color: '#888' }}>No moves yet</span>
            ) : (
              moveHistory.reduce((acc, move, idx) => {
                if (idx % 2 === 0) {
                  acc.push(`${Math.floor(idx / 2) + 1}. ${move}`);
                } else {
                  acc[acc.length - 1] += `  ${move}`;
                }
                return acc;
              }, []).map((line, i) => (
                <div key={`move-${i}`} style={{ lineHeight: '15px' }}>
                  {line}
                </div>
              ))
            )}
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
              padding: '16px 24px',
              zIndex: 100,
              minWidth: '220px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              Chess
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Two-player local chess recreation with standard rules.
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
