import React, { useState, useEffect, useCallback } from 'react';
import Window from '../../components/Window';

const SUIT_INFO = [
  { name: 'clubs', symbol: '♣', color: 'black' },
  { name: 'diamonds', symbol: '♦', color: 'red' },
  { name: 'hearts', symbol: '♥', color: 'red' },
  { name: 'spades', symbol: '♠', color: 'black' },
];

const RANK_LABELS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Small FreeCell Icon
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

// Authentic Microsoft FreeCell PRNG algorithm by Jim Horne
function generateFreeCellDeck(gameNum) {
  let seed = gameNum;
  function rand() {
    seed = (seed * 214013 + 2531011) & 0x7fffffff;
    return (seed >> 16) & 0x7fff;
  }

  // 52 cards
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
        boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        boxSizing: 'border-box',
        padding: '2px 3px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        userSelect: 'none',
        color: isRed ? '#D00000' : '#000000',
        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', lineHeight: '11px' }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{card.label}</span>
        <span style={{ fontSize: '10px' }}>{card.symbol}</span>
      </div>
      <div style={{ alignSelf: 'center', fontSize: '18px', lineHeight: '18px' }}>
        {card.symbol}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          lineHeight: '11px',
          alignSelf: 'flex-end',
          transform: 'rotate(180deg)',
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
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const [freeCells, setFreeCells] = useState([null, null, null, null]);
  const [foundations, setFoundations] = useState([[], [], [], []]);
  const [tableau, setTableau] = useState([[], [], [], [], [], [], [], []]);

  const [selectedLocation, setSelectedLocation] = useState(null); // { type: 'free'|'tab'|'found', index, cardIndex }
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);

  // Close dialogs on Escape
  useEffect(() => {
    if (!showGameDialog && !showAboutDialog && !isWon) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showGameDialog) setShowGameDialog(false);
        if (showAboutDialog) setShowAboutDialog(false);
        if (isWon) setIsWon(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGameDialog, showAboutDialog, isWon]);

  // Initialize deal based on gameNumber
  const dealGame = useCallback((num) => {
    const deck = generateFreeCellDeck(num);
    const cols = [[], [], [], [], [], [], [], []];

    for (let i = 0; i < 52; i++) {
      cols[i % 8].push(deck[i]);
    }

    setFreeCells([null, null, null, null]);
    setFoundations([[], [], [], []]);
    setTableau(cols);
    setSelectedLocation(null);
    setHistory([]);
    setIsWon(false);
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

  // Check victory (all 52 cards on foundations)
  useEffect(() => {
    const totalFoundations = foundations.reduce((acc, f) => acc + f.length, 0);
    if (totalFoundations === 52 && !isWon) {
      setIsWon(true);
    }
  }, [foundations, isWon]);

  // Check foundation placement rule
  const canPlaceOnFoundation = (card, pile) => {
    if (!card) return false;
    if (pile.length === 0) return card.val === 1;
    const top = pile[pile.length - 1];
    return top.suit === card.suit && card.val === top.val + 1;
  };

  // Check tableau placement rule
  const canPlaceOnTableau = (card, col) => {
    if (!card) return false;
    if (col.length === 0) return true; // Any card on empty col
    const top = col[col.length - 1];
    return top.color !== card.color && top.val === card.val + 1;
  };

  // Calculate max movable cards in a sequence
  const getMaxMovable = () => {
    const emptyFree = freeCells.filter((c) => c === null).length;
    const emptyCols = tableau.filter((c) => c.length === 0).length;
    return (1 + emptyFree) * Math.pow(2, emptyCols);
  };

  // Double click auto move
  const handleAutoMove = (card, source) => {
    // 1. Try foundations first
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      if (canPlaceOnFoundation(card, foundations[fIdx])) {
        pushHistory();
        removeCardFromSource(source);
        setFoundations((prev) => {
          const next = prev.map((pile) => [...pile]);
          next[fIdx].push(card);
          return next;
        });
        setSelectedLocation(null);
        return;
      }
    }
    // 2. Try empty free cell
    if (source.type === 'tab') {
      const freeIdx = freeCells.findIndex((c) => c === null);
      if (freeIdx !== -1) {
        pushHistory();
        removeCardFromSource(source);
        setFreeCells((prev) => {
          const next = [...prev];
          next[freeIdx] = card;
          return next;
        });
        setSelectedLocation(null);
      }
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

  // Handle Free Cell Click
  const handleFreeCellClick = (cellIdx) => {
    if (selectedLocation) {
      if (freeCells[cellIdx] === null) {
        // Move single card to free cell
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
          setFreeCells((prev) => {
            const next = [...prev];
            next[cellIdx] = movingCard;
            return next;
          });
          setSelectedLocation(null);
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

  // Handle Foundation Click
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
      setFoundations((prev) => {
        const next = prev.map((pile) => [...pile]);
        next[fIdx].push(card);
        return next;
      });
      setSelectedLocation(null);
    } else {
      setSelectedLocation(null);
    }
  };

  // Handle Tableau Column Click
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

    const baseCard = movingCards[0];
    const targetCol = tableau[colIdx];

    // Check legality and move limit
    if (canPlaceOnTableau(baseCard, targetCol)) {
      const maxMovable = getMaxMovable();
      if (movingCards.length <= maxMovable) {
        pushHistory();
        removeCardFromSource(selectedLocation);
        setTableau((prev) => {
          const next = prev.map((c) => [...c]);
          next[colIdx] = [...next[colIdx], ...movingCards];
          return next;
        });
        setSelectedLocation(null);
        return;
      }
    }
    setSelectedLocation(null);
  };

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
        { label: 'Select Game #...', onClick: () => setShowGameDialog(true) },
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
      hasMenu={true}
      menuItems={menuItems}
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
        }}
      >
        {/* Top Header: 4 Free Cells & 4 Foundations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: '600px' }}>
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
                  border: '1px solid #004D00',
                  background: 'rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {cell ? (
                  <FreeCellCard
                    card={cell}
                    isSelected={selectedLocation?.type === 'free' && selectedLocation?.index === idx}
                    onDoubleClick={() => handleAutoMove(cell, { type: 'free', index: idx })}
                  />
                ) : (
                  <span style={{ color: '#004D00', fontSize: '10px' }}>FREE</span>
                )}
              </div>
            ))}
          </div>

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
                  border: '1px solid #004D00',
                  background: 'rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {pile.length > 0 ? (
                  <FreeCellCard card={pile[pile.length - 1]} />
                ) : (
                  <span style={{ color: '#004D00', fontSize: '18px' }}>
                    {SUIT_INFO[idx].symbol}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 8 Tableau Columns */}
        <div style={{ display: 'flex', gap: '6px', flex: 1, minHeight: '280px' }}>
          {tableau.map((col, colIdx) => (
            <div
              key={`tab-${colIdx}`}
              onClick={() => handleTableauClick(colIdx)}
              style={{
                width: '54px',
                minHeight: '260px',
                position: 'relative',
                border: col.length === 0 ? '1px dashed #004D00' : 'none',
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
                          handleAutoMove(card, { type: 'tab', index: colIdx, cardIndex: cardIdx });
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Game Number Dialog */}
        {showGameDialog && (
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
              minWidth: '200px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>Select Game</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px' }}>Game #:</span>
              <input
                type="number"
                min="1"
                max="32000"
                value={gameInput}
                onChange={(e) => setGameInput(e.target.value)}
                style={{
                  width: '80px',
                  padding: '2px 4px',
                  fontSize: '11px',
                  background: '#FFFFFF',
                  border: '2px solid',
                  borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button
                className="win-btn"
                onClick={() => {
                  const num = parseInt(gameInput, 10);
                  if (!isNaN(num) && num > 0) {
                    setGameNumber(num);
                    dealGame(num);
                  }
                  setShowGameDialog(false);
                }}
                style={{
                  padding: '2px 10px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                OK
              </button>
              <button
                className="win-btn"
                onClick={() => setShowGameDialog(false)}
                style={{
                  padding: '2px 10px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Win Dialog */}
        {isWon && (
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
              zIndex: 99,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>You win!</div>
            <p style={{ fontSize: '12px', margin: '0 0 12px 0' }}>Congratulations! FreeCell Game #{gameNumber} solved!</p>
            <button
              className="win-btn"
              onClick={() => dealGame(gameNumber + 1)}
              style={{
                padding: '4px 16px',
                background: '#C0C0C0',
                border: '2px solid',
                borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '11px',
              }}
            >
              Next Game
            </button>
          </div>
        )}
        {/* About Dialog (Credit line in the About box only: FreeCell, by Jim Horne) */}
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
              minWidth: '240px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              FreeCell
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 10px 0', fontStyle: 'italic' }}>
              FreeCell, by Jim Horne.
            </p>
            <p style={{ fontSize: '11px', margin: '0 0 14px 0', color: '#333333' }}>
              Windows 98 Portfolio Edition
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
