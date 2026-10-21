import React, { useState, useEffect, useCallback } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';

const SUIT_INFO = [
  { name: 'clubs', symbol: '♣', color: 'black' },
  { name: 'diamonds', symbol: '♦', color: 'red' },
  { name: 'hearts', symbol: '♥', color: 'red' },
  { name: 'spades', symbol: '♠', color: 'black' },
];

const RANK_LABELS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// TitleBar icon
export const FreeCellIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="6" height="5" fill="#FFF" stroke="#000" strokeWidth="0.5" />
    <rect x="9" y="2" width="6" height="5" fill="#FFF" stroke="#000" strokeWidth="0.5" />
    <rect x="5" y="8" width="6" height="6" fill="#FFF" stroke="#000" strokeWidth="0.5" />
    <text x="2" y="6" fontSize="4" fill="#CC0000" fontWeight="bold">♦</text>
    <text x="10" y="6" fontSize="4" fill="#000" fontWeight="bold">♠</text>
    <text x="6" y="13" fontSize="4" fill="#CC0000" fontWeight="bold">♥</text>
  </svg>
);

// King face icon between free cells and foundations
function KingFaceIcon() {
  return (
    <div
      style={{
        width: '38px',
        height: '76px',
        border: '1px inset #DFDFDF',
        background: '#C0C0C0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '2px',
        userSelect: 'none',
      }}
      title="FreeCell"
    >
      <svg width="32" height="42" viewBox="0 0 32 42">
        {/* Crown */}
        <path d="M4 14 L8 6 L16 11 L24 6 L28 14 Z" fill="#FFD700" stroke="#000000" strokeWidth="1" />
        <circle cx="8" cy="6" r="1.5" fill="#FF0000" />
        <circle cx="16" cy="11" r="1.5" fill="#0000FF" />
        <circle cx="24" cy="6" r="1.5" fill="#FF0000" />
        {/* Head */}
        <circle cx="16" cy="22" r="9" fill="#FFE0BD" stroke="#000000" strokeWidth="1" />
        {/* Eyes */}
        <circle cx="13" cy="20" r="1.2" fill="#000000" />
        <circle cx="19" cy="20" r="1.2" fill="#000000" />
        {/* Mustache */}
        <path d="M11 25 Q16 28 21 25 Q16 30 11 25 Z" fill="#8B4513" />
        {/* Beard */}
        <path d="M12 28 Q16 35 20 28 Z" fill="#8B4513" />
        {/* Robe */}
        <path d="M7 32 L25 32 L28 42 L4 42 Z" fill="#800000" stroke="#000000" strokeWidth="1" />
        <path d="M13 32 L19 32 L19 42 L13 42 Z" fill="#FFFFFF" />
      </svg>
      <span
        style={{
          fontSize: '9px',
          fontWeight: 'bold',
          color: '#000080',
          marginTop: '2px',
          fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
        }}
      >
        KING
      </span>
    </div>
  );
}

// Authentic Microsoft FreeCell PRNG algorithm by Jim Horne
function generateFreeCellDeck(gameNum) {
  let seed = gameNum;
  function rand() {
    seed = (seed * 214013 + 2531011) & 0x7fffffff;
    return (seed >> 16) & 0x7fff;
  }

  const cards = [];
  for (let r = 1; r <= 13; r++) {
    for (let s = 0; s < 4; s++) {
      cards.push({
        id: `${s}-${r}`,
        val: r,
        label: RANK_LABELS[r - 1],
        suit: SUIT_INFO[s].name,
        symbol: SUIT_INFO[s].symbol,
        color: SUIT_INFO[s].color,
        suitIndex: s,
      });
    }
  }

  const pool = [...cards];
  const shuffled = [];
  for (let i = 52; i > 0; i--) {
    const j = rand() % i;
    shuffled.push(pool[j]);
    pool[j] = pool[i - 1];
  }
  return shuffled;
}

// Single Card View
function FreeCellCard({ card, isSelected, onClick, onDoubleClick, style }) {
  if (!card) return null;
  const isRed = card.color === 'red';

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        width: '54px',
        height: '76px',
        borderRadius: '3px',
        background: isSelected ? '#FFFFCC' : '#FFFFFF',
        border: isSelected ? '2px solid #0000FF' : '1px solid #000000',
        boxShadow: '1px 1px 2px rgba(0,0,0,0.35)',
        boxSizing: 'border-box',
        cursor: 'pointer',
        userSelect: 'none',
        color: isRed ? '#D00000' : '#000000',
        fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
        position: 'relative',
        ...style,
      }}
    >
      {/* Top Left */}
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: '3px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: '10px',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{card.label}</span>
        <span style={{ fontSize: '10px' }}>{card.symbol}</span>
      </div>

      {/* Center Symbol */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: card.val > 10 ? '15px' : '20px',
          fontWeight: card.val > 10 ? 'bold' : 'normal',
          lineHeight: '20px',
        }}
      >
        {card.val > 10 ? card.label : card.symbol}
      </div>

      {/* Bottom Right - Rotated 180 degrees */}
      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          right: '3px',
          transform: 'rotate(180deg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: '10px',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{card.label}</span>
        <span style={{ fontSize: '10px' }}>{card.symbol}</span>
      </div>
    </div>
  );
}

export default function FreeCellWindow({
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
  const [gameNumber, setGameNumber] = useState(1);
  const [gameInput, setGameInput] = useState('1');
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Free cells (4) & Foundations (4) & Tableau (8 cols: 7, 7, 7, 7, 6, 6, 6, 6 cards)
  const [freeCells, setFreeCells] = useState([null, null, null, null]);
  const [foundations, setFoundations] = useState([[], [], [], []]);
  const [tableau, setTableau] = useState([[], [], [], [], [], [], [], []]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);

  // Local storage statistics
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('win98_freecell_stats');
      return saved ? JSON.parse(saved) : { played: 0, won: 0 };
    } catch {
      return { played: 0, won: 0 };
    }
  });

  // Close dialogs on Escape
  useEffect(() => {
    if (!showGameDialog && !showStatsDialog && !showAboutDialog && !isWon) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showGameDialog) setShowGameDialog(false);
        if (showStatsDialog) setShowStatsDialog(false);
        if (showAboutDialog) setShowAboutDialog(false);
        if (isWon) setIsWon(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGameDialog, showStatsDialog, showAboutDialog, isWon]);

  // Deal game: all 4 free cells empty, columns of 7,7,7,7,6,6,6,6 cards
  const dealGame = useCallback((num) => {
    const deck = generateFreeCellDeck(num);
    const cols = [[], [], [], [], [], [], [], []];

    // Deal 52 cards across 8 columns
    for (let i = 0; i < 52; i++) {
      cols[i % 8].push(deck[i]);
    }

    setFreeCells([null, null, null, null]);
    setFoundations([[], [], [], []]);
    setTableau(cols);
    setSelectedLocation(null);
    setHistory([]);
    setIsWon(false);

    setStats((prev) => {
      const updated = { ...prev, played: prev.played + 1 };
      try {
        localStorage.setItem('win98_freecell_stats', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  useEffect(() => {
    dealGame(gameNumber);
  }, [gameNumber, dealGame]);

  const pushHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-30),
      {
        freeCells: [...freeCells],
        foundations: foundations.map((f) => [...f]),
        tableau: tableau.map((c) => [...c]),
      },
    ]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setFreeCells(last.freeCells);
    setFoundations(last.foundations);
    setTableau(last.tableau);
    setSelectedLocation(null);
    setIsWon(false);
  };

  // Check victory
  useEffect(() => {
    const totalFoundations = foundations.reduce((acc, f) => acc + f.length, 0);
    if (totalFoundations === 52 && !isWon) {
      setIsWon(true);
      setStats((prev) => {
        const updated = { ...prev, won: prev.won + 1 };
        try {
          localStorage.setItem('win98_freecell_stats', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  }, [foundations, isWon]);

  // Foundation placement validation
  const canPlaceOnFoundation = (card, pile) => {
    if (!card) return false;
    if (pile.length === 0) return card.val === 1;
    const top = pile[pile.length - 1];
    return top.suit === card.suit && card.val === top.val + 1;
  };

  // Tableau placement validation
  const canPlaceOnTableau = (card, col) => {
    if (!card) return false;
    if (col.length === 0) return true; // Any card on empty column
    const top = col[col.length - 1];
    return top.color !== card.color && top.val === card.val + 1;
  };

  // Calculate max movable cards using supermove formula
  const getMaxMovable = (isDestinationEmptyCol = false) => {
    const emptyFree = freeCells.filter((c) => c === null).length;
    let emptyCols = tableau.filter((c) => c.length === 0).length;
    if (isDestinationEmptyCol) {
      emptyCols = Math.max(0, emptyCols - 1);
    }
    return (1 + emptyFree) * Math.pow(2, emptyCols);
  };

  // Check if a stack of cards forms a legal descending alternating sequence
  const isLegalSequence = (cards) => {
    for (let i = 0; i < cards.length - 1; i++) {
      const cur = cards[i];
      const next = cards[i + 1];
      if (cur.color === next.color || cur.val !== next.val + 1) {
        return false;
      }
    }
    return true;
  };

  // Auto-move to foundations when safe
  const trySafeAutoMoves = (currentFree, currentFound, currentTab) => {
    let changed = false;
    const nextFree = [...currentFree];
    const nextFound = currentFound.map((f) => [...f]);
    const nextTab = currentTab.map((col) => [...col]);

    // Check min value of opposite-color foundations
    const getSafeRank = (suitColor) => {
      const oppSuits = suitColor === 'red' ? ['spades', 'clubs'] : ['hearts', 'diamonds'];
      let minOpp = 13;
      for (const f of nextFound) {
        if (f.length > 0 && oppSuits.includes(f[0].suit)) {
          minOpp = Math.min(minOpp, f[f.length - 1].val);
        } else if (f.length === 0) {
          minOpp = 0;
        }
      }
      return minOpp + 1;
    };

    // 1. Check free cells
    for (let i = 0; i < 4; i++) {
      const card = nextFree[i];
      if (!card) continue;
      for (let fIdx = 0; fIdx < 4; fIdx++) {
        if (canPlaceOnFoundation(card, nextFound[fIdx])) {
          if (card.val <= 2 || card.val <= getSafeRank(card.color)) {
            nextFound[fIdx].push(card);
            nextFree[i] = null;
            changed = true;
            break;
          }
        }
      }
    }

    // 2. Check bottom cards of tableau
    for (let c = 0; c < 8; c++) {
      const col = nextTab[c];
      if (col.length === 0) continue;
      const card = col[col.length - 1];
      for (let fIdx = 0; fIdx < 4; fIdx++) {
        if (canPlaceOnFoundation(card, nextFound[fIdx])) {
          if (card.val <= 2 || card.val <= getSafeRank(card.color)) {
            nextFound[fIdx].push(card);
            col.pop();
            changed = true;
            break;
          }
        }
      }
    }

    if (changed) {
      setFreeCells(nextFree);
      setFoundations(nextFound);
      setTableau(nextTab);
      // Recurse until no more safe moves
      setTimeout(() => trySafeAutoMoves(nextFree, nextFound, nextTab), 100);
    }
  };

  const removeCardFromSource = (loc) => {
    if (loc.type === 'free') {
      setFreeCells((prev) => {
        const next = [...prev];
        next[loc.index] = null;
        return next;
      });
    } else if (loc.type === 'tab') {
      setTableau((prev) => {
        const next = prev.map((c) => [...c]);
        next[loc.index] = next[loc.index].slice(0, loc.cardIndex);
        return next;
      });
    }
  };

  // Double click auto move (free cell or foundation)
  const handleDoubleClick = (card, source) => {
    // 1. Try foundations first
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      if (canPlaceOnFoundation(card, foundations[fIdx])) {
        pushHistory();
        removeCardFromSource(source);
        const nextFound = foundations.map((f) => [...f]);
        nextFound[fIdx].push(card);
        setFoundations(nextFound);
        setSelectedLocation(null);
        setTimeout(() => trySafeAutoMoves(freeCells, nextFound, tableau), 100);
        return;
      }
    }

    // 2. Try empty free cell
    if (source.type === 'tab') {
      const freeIdx = freeCells.findIndex((c) => c === null);
      if (freeIdx !== -1) {
        pushHistory();
        removeCardFromSource(source);
        const nextFree = [...freeCells];
        nextFree[freeIdx] = card;
        setFreeCells(nextFree);
        setSelectedLocation(null);
        setTimeout(() => trySafeAutoMoves(nextFree, foundations, tableau), 100);
      }
    }
  };

  // Click on free cell
  const handleFreeCellClick = (cellIdx) => {
    if (selectedLocation) {
      if (freeCells[cellIdx] === null) {
        let movingCard = null;
        if (selectedLocation.type === 'free') {
          movingCard = freeCells[selectedLocation.index];
        } else if (selectedLocation.type === 'tab') {
          const col = tableau[selectedLocation.index];
          if (selectedLocation.cardIndex === col.length - 1) {
            movingCard = col[col.length - 1];
          }
        }

        if (movingCard) {
          pushHistory();
          removeCardFromSource(selectedLocation);
          const nextFree = [...freeCells];
          nextFree[cellIdx] = movingCard;
          setFreeCells(nextFree);
          setSelectedLocation(null);
          setTimeout(() => trySafeAutoMoves(nextFree, foundations, tableau), 100);
          return;
        }
      }
      setSelectedLocation(null);
    } else {
      if (freeCells[cellIdx] !== null) {
        setSelectedLocation({ type: 'free', index: cellIdx });
      }
    }
  };

  // Click on foundation
  const handleFoundationClick = (fIdx) => {
    if (!selectedLocation) return;
    let card = null;
    if (selectedLocation.type === 'free') {
      card = freeCells[selectedLocation.index];
    } else if (selectedLocation.type === 'tab') {
      const col = tableau[selectedLocation.index];
      if (selectedLocation.cardIndex === col.length - 1) {
        card = col[col.length - 1];
      }
    }

    if (card && canPlaceOnFoundation(card, foundations[fIdx])) {
      pushHistory();
      removeCardFromSource(selectedLocation);
      const nextFound = foundations.map((pile) => [...pile]);
      nextFound[fIdx].push(card);
      setFoundations(nextFound);
      setSelectedLocation(null);
      setTimeout(() => trySafeAutoMoves(freeCells, nextFound, tableau), 100);
    } else {
      setSelectedLocation(null);
    }
  };

  // Click on tableau column
  const handleTableauClick = (colIdx) => {
    if (!selectedLocation) return;

    let movingCards = [];
    if (selectedLocation.type === 'free') {
      const c = freeCells[selectedLocation.index];
      if (c) movingCards = [c];
    } else if (selectedLocation.type === 'tab') {
      const col = tableau[selectedLocation.index];
      movingCards = col.slice(selectedLocation.cardIndex);
    }

    if (movingCards.length === 0) {
      setSelectedLocation(null);
      return;
    }

    if (!isLegalSequence(movingCards)) {
      setSelectedLocation(null);
      return;
    }

    const baseCard = movingCards[0];
    const targetCol = tableau[colIdx];
    const isDestEmpty = targetCol.length === 0;

    if (canPlaceOnTableau(baseCard, targetCol)) {
      const maxMovable = getMaxMovable(isDestEmpty);
      if (movingCards.length <= maxMovable) {
        pushHistory();
        removeCardFromSource(selectedLocation);
        const nextTab = tableau.map((c) => [...c]);
        nextTab[colIdx] = [...nextTab[colIdx], ...movingCards];
        setTableau(nextTab);
        setSelectedLocation(null);
        setTimeout(() => trySafeAutoMoves(freeCells, foundations, nextTab), 100);
        return;
      }
    }
    setSelectedLocation(null);
  };

  // Calculate cards left
  const totalInFoundations = foundations.reduce((acc, f) => acc + f.length, 0);
  const cardsLeft = 52 - totalInFoundations;

  const menuItems = [
    {
      label: 'Game',
      items: [
        {
          label: 'New Game (F2)',
          onClick: () => {
            const nextNum = Math.floor(Math.random() * 32000) + 1;
            setGameNumber(nextNum);
            setGameInput(nextNum.toString());
          },
        },
        { label: 'Select Game...', onClick: () => setShowGameDialog(true) },
        { label: 'Restart Game', onClick: () => dealGame(gameNumber) },
        { label: 'Statistics...', onClick: () => setShowStatsDialog(true) },
        { label: 'Options...', onClick: () => alert('FreeCell Options: Standard') },
        { isSeparator: true },
        { label: 'Undo', onClick: handleUndo },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About FreeCell',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  return (
    <>
      <Window
        id="window-freecell"
        title={`FreeCell Game #${gameNumber}`}
        icon={<FreeCellIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={isMaximized}
        zIndex={zIndex}
        position={position}
        defaultWidth={640}
        defaultHeight={480}
        resizable={true}
        allowMaximize={true}
        hasMenu={true}
        menuItems={menuItems}
        hasStatusBar={true}
        statusText={`Cards left: ${cardsLeft}`}
        onFocus={onFocus}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#008000',
            padding: '10px',
            boxSizing: 'border-box',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            userSelect: 'none',
            position: 'relative',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          }}
        >
          {/* Top Header: 4 Free Cells, King Face Icon, 4 Foundations */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '600px',
            }}
          >
            {/* 4 Free Cells */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {freeCells.map((cell, idx) => (
                <div
                  key={`free-${idx}`}
                  onClick={() => handleFreeCellClick(idx)}
                  style={{
                    width: '54px',
                    height: '76px',
                    borderRadius: '3px',
                    border: '1px solid #005000',
                    background: 'rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  {cell ? (
                    <FreeCellCard
                      card={cell}
                      isSelected={
                        selectedLocation?.type === 'free' && selectedLocation?.index === idx
                      }
                      onDoubleClick={() =>
                        handleDoubleClick(cell, { type: 'free', index: idx })
                      }
                    />
                  ) : (
                    <span style={{ color: '#005000', fontSize: '10px', fontWeight: 'bold' }}>
                      FREE
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Small King Face Icon in center */}
            <KingFaceIcon />

            {/* 4 Foundations */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {foundations.map((pile, idx) => (
                <div
                  key={`found-${idx}`}
                  onClick={() => handleFoundationClick(idx)}
                  style={{
                    width: '54px',
                    height: '76px',
                    borderRadius: '3px',
                    border: '1px solid #005000',
                    background: 'rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  {pile.length > 0 ? (
                    <FreeCellCard card={pile[pile.length - 1]} />
                  ) : (
                    <span style={{ color: '#005000', fontSize: '18px', opacity: 0.6 }}>
                      {SUIT_INFO[idx].symbol}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 8 Tableau Columns (Fresh deal: 7, 7, 7, 7, 6, 6, 6, 6 cards) */}
          <div style={{ display: 'flex', gap: '6px', flex: 1, minHeight: '280px' }}>
            {tableau.map((col, colIdx) => (
              <div
                key={`tab-${colIdx}`}
                onClick={() => handleTableauClick(colIdx)}
                style={{
                  width: '54px',
                  minHeight: '260px',
                  position: 'relative',
                  border: col.length === 0 ? '1px dashed #005000' : 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                {col.map((card, cardIdx) => {
                  const isSelected =
                    selectedLocation?.type === 'tab' &&
                    selectedLocation?.index === colIdx &&
                    cardIdx >= selectedLocation?.cardIndex;

                  return (
                    <div
                      key={card.id}
                      style={{
                        position: 'absolute',
                        top: `${cardIdx * 19}px`,
                        left: '0px',
                        zIndex: cardIdx + 1,
                      }}
                    >
                      <FreeCellCard
                        card={card}
                        isSelected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLocation({ type: 'tab', index: colIdx, cardIndex: cardIdx });
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (cardIdx === col.length - 1) {
                            handleDoubleClick(card, { type: 'tab', index: colIdx, cardIndex: cardIdx });
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Win Dialog */}
          {isWon && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#C0C0C0',
                boxShadow:
                  '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
                padding: '3px',
                zIndex: 99,
                textAlign: 'center',
                minWidth: '240px',
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
                  textAlign: 'left',
                }}
              >
                FreeCell
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                  You win!
                </div>
                <p style={{ margin: '0 0 14px 0' }}>
                  Congratulations! FreeCell Game #{gameNumber} solved!
                </p>
                <button
                  onClick={() => dealGame(gameNumber + 1)}
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
                  Next Game
                </button>
              </div>
            </div>
          )}
        </div>
      </Window>

      {/* Select Game Number Dialog */}
      {showGameDialog && (
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
          onClick={() => setShowGameDialog(false)}
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
              Select Game
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span>Game #:</span>
                <input
                  type="number"
                  min="1"
                  max="32000"
                  value={gameInput}
                  onChange={(e) => setGameInput(e.target.value)}
                  style={{
                    width: '80px',
                    padding: '1px 3px',
                    border: '2px inset #DFDFDF',
                    fontSize: '11px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                <button
                  onClick={() => {
                    const num = parseInt(gameInput, 10);
                    if (!isNaN(num) && num > 0) {
                      setGameNumber(num);
                      dealGame(num);
                    }
                    setShowGameDialog(false);
                  }}
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
                  onClick={() => setShowGameDialog(false)}
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
            </div>
          </div>
        </div>
      )}

      {/* Statistics Dialog */}
      {showStatsDialog && (
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
          onClick={() => setShowStatsDialog(false)}
        >
          <div
            className="win95-window win-dialog"
            style={{
              width: '240px',
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
              FreeCell Statistics
            </div>
            <div style={{ padding: '12px 14px' }}>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', marginBottom: '12px' }}>
                <tbody>
                  <tr>
                    <td>Total Played:</td>
                    <td style={{ fontWeight: 'bold' }}>{stats.played}</td>
                  </tr>
                  <tr>
                    <td>Total Won:</td>
                    <td style={{ fontWeight: 'bold' }}>{stats.won}</td>
                  </tr>
                  <tr>
                    <td>Winning %:</td>
                    <td style={{ fontWeight: 'bold' }}>
                      {stats.played > 0 ? `${Math.round((stats.won / stats.played) * 100)}%` : '0%'}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowStatsDialog(false)}
                  style={{
                    padding: '2px 16px',
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

      {/* About FreeCell Dialog */}
      <AboutAppDialog
        isOpen={showAboutDialog}
        appName="FreeCell"
        version="Version 4.10.1998"
        icon={<FreeCellIconSmall />}
        description="Technically every game is winnable. Practically, no."
        onClose={() => setShowAboutDialog(false)}
      />
    </>
  );
}
