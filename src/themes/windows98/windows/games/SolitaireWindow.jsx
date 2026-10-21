import React, { useState, useEffect, useCallback } from 'react';
import Window from '../../components/Window';

const SUITS = [
  { name: 'spades', symbol: '♠', color: 'black' },
  { name: 'hearts', symbol: '♥', color: 'red' },
  { name: 'clubs', symbol: '♣', color: 'black' },
  { name: 'diamonds', symbol: '♦', color: 'red' },
];

const RANKS = [
  { val: 1, label: 'A' },
  { val: 2, label: '2' },
  { val: 3, label: '3' },
  { val: 4, label: '4' },
  { val: 5, label: '5' },
  { val: 6, label: '6' },
  { val: 7, label: '7' },
  { val: 8, label: '8' },
  { val: 9, label: '9' },
  { val: 10, label: '10' },
  { val: 11, label: 'J' },
  { val: 12, label: 'Q' },
  { val: 13, label: 'K' },
];

// Small card icon for TitleBar
export const SolitaireIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="12" height="14" rx="1" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    <path d="M8 4L5 9H11L8 4Z" fill="#CC0000" />
    <text x="3" y="6" fontSize="5" fontFamily="Arial" fill="#CC0000" fontWeight="bold">A</text>
  </svg>
);

// Card View Component with authentic Win98 card back and face
function CardView({ card, isFaceUp = true, isSelected = false, style = {}, onClick, onDoubleClick }) {
  if (!card) return null;

  if (!isFaceUp) {
    // Windows 98 classic royal blue pattern card back
    return (
      <div
        onClick={onClick}
        style={{
          width: '56px',
          height: '80px',
          borderRadius: '3px',
          background: 'linear-gradient(135deg, #000080 0%, #1044A0 50%, #000080 100%)',
          border: '1px solid #000000',
          boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          boxSizing: 'border-box',
          padding: '3px',
          cursor: 'pointer',
          userSelect: 'none',
          position: 'relative',
          ...style,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '1px dashed #FFFFFF',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '10px',
            opacity: 0.8,
          }}
        >
          ♠♥♦♣
        </div>
      </div>
    );
  }

  const isRed = card.color === 'red';
  const textColor = isRed ? '#D00000' : '#000000';

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        width: '56px',
        height: '80px',
        borderRadius: '3px',
        background: isSelected ? '#FFFFCC' : '#FFFFFF',
        border: isSelected ? '2px solid #0000FF' : '1px solid #000000',
        boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        boxSizing: 'border-box',
        padding: '3px 4px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        color: textColor,
        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
        ...style,
      }}
    >
      {/* Top Left Rank & Suit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', lineHeight: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{card.label}</span>
        <span style={{ fontSize: '11px' }}>{card.symbol}</span>
      </div>

      {/* Center Symbol */}
      <div
        style={{
          alignSelf: 'center',
          fontSize: card.val > 10 ? '18px' : '20px',
          lineHeight: '20px',
          fontWeight: card.val > 10 ? 'bold' : 'normal',
        }}
      >
        {card.val > 10 ? card.label : card.symbol}
      </div>

      {/* Bottom Right Inverted Rank & Suit */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          lineHeight: '12px',
          alignSelf: 'flex-end',
          transform: 'rotate(180deg)',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{card.label}</span>
        <span style={{ fontSize: '11px' }}>{card.symbol}</span>
      </div>
    </div>
  );
}

// Generate standard 52-card deck
function generateDeck() {
  const deck = [];
  let id = 0;
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({
        id: `card-${id++}`,
        suit: s.name,
        symbol: s.symbol,
        color: s.color,
        val: r.val,
        label: r.label,
      });
    }
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function SolitaireWindow({
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
  const [stock, setStock] = useState([]);
  const [waste, setWaste] = useState([]);
  const [foundations, setFoundations] = useState([[], [], [], []]);
  const [tableau, setTableau] = useState([[], [], [], [], [], [], []]);
  const [selectedCardInfo, setSelectedCardInfo] = useState(null); // { source: 'waste' | 'tableau' | 'foundation', colIndex, cardIndex }
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Initialize new game
  const dealNewGame = useCallback(() => {
    const deck = generateDeck();
    const newTableau = [[], [], [], [], [], [], []];

    // Deal to tableau (1 card in col 0, 2 in col 1, ..., 7 in col 6)
    for (let c = 0; c < 7; c++) {
      for (let r = 0; r <= c; r++) {
        const card = deck.pop();
        newTableau[c].push({
          card,
          isFaceUp: r === c, // only top card is face-up initially
        });
      }
    }

    setStock(deck);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setTableau(newTableau);
    setSelectedCardInfo(null);
    setHistory([]);
    setIsWon(false);
  }, []);

  useEffect(() => {
    dealNewGame();
  }, [dealNewGame]);

  // Push current state to undo history
  const pushHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-30),
      {
        stock: [...stock],
        waste: [...waste],
        foundations: foundations.map((f) => [...f]),
        tableau: tableau.map((col) => col.map((c) => ({ ...c }))),
      },
    ]);
  };

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setStock(last.stock);
    setWaste(last.waste);
    setFoundations(last.foundations);
    setTableau(last.tableau);
    setSelectedCardInfo(null);
    setIsWon(false);
  };

  // Draw 1 card from Stock to Waste
  const handleStockClick = () => {
    pushHistory();
    if (stock.length > 0) {
      const nextStock = [...stock];
      const drawnCard = nextStock.pop();
      setStock(nextStock);
      setWaste((prev) => [...prev, drawnCard]);
    } else {
      // Recycle waste back to stock
      setStock([...waste].reverse());
      setWaste([]);
    }
    setSelectedCardInfo(null);
  };

  // Check victory condition
  useEffect(() => {
    const totalFoundations = foundations.reduce((acc, f) => acc + f.length, 0);
    if (totalFoundations === 52 && !isWon) {
      setIsWon(true);
    }
  }, [foundations, isWon]);

  // Close dialogs on Escape
  useEffect(() => {
    if (!isWon && !showAboutDialog) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (isWon) setIsWon(false);
        if (showAboutDialog) setShowAboutDialog(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWon, showAboutDialog]);

  // Check if card can be placed on foundation
  const canPlaceOnFoundation = (card, targetPile) => {
    if (!card) return false;
    if (targetPile.length === 0) {
      return card.val === 1; // Ace only
    }
    const topCard = targetPile[targetPile.length - 1];
    return topCard.suit === card.suit && card.val === topCard.val + 1;
  };

  // Check if card stack can be placed on tableau column
  const canPlaceOnTableau = (movingCard, targetCol) => {
    if (!movingCard) return false;
    if (targetCol.length === 0) {
      return movingCard.val === 13; // King only
    }
    const top = targetCol[targetCol.length - 1];
    if (!top.isFaceUp) return false;
    return top.card.color !== movingCard.color && top.card.val === movingCard.val + 1;
  };

  // Double click auto-move to foundations
  const handleAutoMoveFoundation = (card, sourceInfo) => {
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      if (canPlaceOnFoundation(card, foundations[fIdx])) {
        pushHistory();
        // Remove from source
        if (sourceInfo.source === 'waste') {
          setWaste((prev) => prev.slice(0, prev.length - 1));
        } else if (sourceInfo.source === 'tableau') {
          setTableau((prev) => {
            const nextTab = prev.map((col) => [...col]);
            nextTab[sourceInfo.colIndex].pop();
            // Flip newly exposed top card
            const col = nextTab[sourceInfo.colIndex];
            if (col.length > 0) {
              col[col.length - 1].isFaceUp = true;
            }
            return nextTab;
          });
        }
        // Add to foundation
        setFoundations((prev) => {
          const nextF = prev.map((pile) => [...pile]);
          nextF[fIdx].push(card);
          return nextF;
        });
        setSelectedCardInfo(null);
        return true;
      }
    }
    return false;
  };

  // Click handler for Tableau Column target
  const handleTableauColClick = (colIndex) => {
    if (!selectedCardInfo) return;

    let movingCards = [];
    if (selectedCardInfo.source === 'waste') {
      if (waste.length > 0) {
        movingCards = [{ card: waste[waste.length - 1], isFaceUp: true }];
      }
    } else if (selectedCardInfo.source === 'foundation') {
      const fPile = foundations[selectedCardInfo.fIndex];
      if (fPile.length > 0) {
        movingCards = [{ card: fPile[fPile.length - 1], isFaceUp: true }];
      }
    } else if (selectedCardInfo.source === 'tableau') {
      const sourceCol = tableau[selectedCardInfo.colIndex];
      movingCards = sourceCol.slice(selectedCardInfo.cardIndex);
    }

    if (movingCards.length === 0) {
      setSelectedCardInfo(null);
      return;
    }

    const baseCard = movingCards[0].card;
    const targetCol = tableau[colIndex];

    if (canPlaceOnTableau(baseCard, targetCol)) {
      pushHistory();
      // Remove from source
      if (selectedCardInfo.source === 'waste') {
        setWaste((prev) => prev.slice(0, prev.length - 1));
      } else if (selectedCardInfo.source === 'foundation') {
        setFoundations((prev) => {
          const nextF = prev.map((pile) => [...pile]);
          nextF[selectedCardInfo.fIndex].pop();
          return nextF;
        });
      } else if (selectedCardInfo.source === 'tableau') {
        setTableau((prev) => {
          const nextT = prev.map((col) => [...col]);
          nextT[selectedCardInfo.colIndex] = nextT[selectedCardInfo.colIndex].slice(
            0,
            selectedCardInfo.cardIndex
          );
          // Auto flip top card
          const col = nextT[selectedCardInfo.colIndex];
          if (col.length > 0) {
            col[col.length - 1].isFaceUp = true;
          }
          return nextT;
        });
      }

      // Append to target tableau column
      setTableau((prev) => {
        const nextT = prev.map((col) => [...col]);
        nextT[colIndex] = [...nextT[colIndex], ...movingCards];
        return nextT;
      });
      setSelectedCardInfo(null);
    } else {
      setSelectedCardInfo(null);
    }
  };

  // Click handler for Foundation Pile target
  const handleFoundationClick = (fIndex) => {
    if (!selectedCardInfo) return;

    let candidateCard = null;
    if (selectedCardInfo.source === 'waste') {
      if (waste.length > 0) candidateCard = waste[waste.length - 1];
    } else if (selectedCardInfo.source === 'tableau') {
      const col = tableau[selectedCardInfo.colIndex];
      if (selectedCardInfo.cardIndex === col.length - 1) {
        candidateCard = col[col.length - 1].card;
      }
    }

    if (candidateCard && canPlaceOnFoundation(candidateCard, foundations[fIndex])) {
      pushHistory();
      // Remove from source
      if (selectedCardInfo.source === 'waste') {
        setWaste((prev) => prev.slice(0, prev.length - 1));
      } else if (selectedCardInfo.source === 'tableau') {
        setTableau((prev) => {
          const nextT = prev.map((col) => [...col]);
          nextT[selectedCardInfo.colIndex].pop();
          const col = nextT[selectedCardInfo.colIndex];
          if (col.length > 0) {
            col[col.length - 1].isFaceUp = true;
          }
          return nextT;
        });
      }

      // Add to foundation
      setFoundations((prev) => {
        const nextF = prev.map((pile) => [...pile]);
        nextF[fIndex].push(candidateCard);
        return nextF;
      });
      setSelectedCardInfo(null);
    } else {
      setSelectedCardInfo(null);
    }
  };

  const menuItems = [
    {
      label: 'Game',
      items: [
        { label: 'Deal (New Game)', onClick: dealNewGame },
        { label: 'Undo', onClick: handleUndo },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Solitaire',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  return (
    <Window
      id="window-solitaire"
      title="Solitaire"
      icon={<SolitaireIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={620}
      defaultHeight={460}
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
          background: '#008000', // Classic Solitaire green felt
          padding: '12px',
          boxSizing: 'border-box',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          userSelect: 'none',
          position: 'relative',
        }}
      >
        {/* Top Row: Stock, Waste, and 4 Foundations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: '580px' }}>
          {/* Stock & Waste */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Stock Pile */}
            <div
              onClick={handleStockClick}
              style={{
                width: '56px',
                height: '80px',
                borderRadius: '3px',
                border: '1px dashed #004D00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {stock.length > 0 ? (
                <CardView isFaceUp={false} card={stock[stock.length - 1]} />
              ) : (
                <span style={{ color: '#004D00', fontSize: '18px' }}>🔄</span>
              )}
            </div>

            {/* Waste Pile */}
            <div
              style={{
                width: '56px',
                height: '80px',
                borderRadius: '3px',
                border: '1px dashed #004D00',
                position: 'relative',
              }}
            >
              {waste.length > 0 && (
                <CardView
                  card={waste[waste.length - 1]}
                  isFaceUp={true}
                  isSelected={selectedCardInfo?.source === 'waste'}
                  onClick={() => {
                    setSelectedCardInfo({ source: 'waste' });
                  }}
                  onDoubleClick={() => {
                    handleAutoMoveFoundation(waste[waste.length - 1], { source: 'waste' });
                  }}
                />
              )}
            </div>
          </div>

          {/* Foundations (4 piles) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {foundations.map((pile, fIdx) => (
              <div
                key={`f-${fIdx}`}
                onClick={() => handleFoundationClick(fIdx)}
                style={{
                  width: '56px',
                  height: '80px',
                  borderRadius: '3px',
                  border: '1px solid #004D00',
                  background: 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {pile.length > 0 ? (
                  <CardView
                    card={pile[pile.length - 1]}
                    isFaceUp={true}
                    isSelected={selectedCardInfo?.source === 'foundation' && selectedCardInfo?.fIndex === fIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCardInfo({ source: 'foundation', fIndex: fIdx });
                    }}
                  />
                ) : (
                  <span style={{ color: '#004D00', fontSize: '20px', opacity: 0.5 }}>♠</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau (7 Columns) */}
        <div style={{ display: 'flex', gap: '8px', flex: 1, minHeight: '260px' }}>
          {tableau.map((col, colIndex) => (
            <div
              key={`tab-col-${colIndex}`}
              onClick={() => handleTableauColClick(colIndex)}
              style={{
                width: '56px',
                minHeight: '220px',
                position: 'relative',
                border: col.length === 0 ? '1px dashed #004D00' : 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              {col.map((item, cardIndex) => {
                const isSelected =
                  selectedCardInfo?.source === 'tableau' &&
                  selectedCardInfo?.colIndex === colIndex &&
                  cardIndex >= selectedCardInfo?.cardIndex;

                return (
                  <div
                    key={item.card.id}
                    style={{
                      position: 'absolute',
                      top: `${cardIndex * 18}px`,
                      left: '0px',
                      zIndex: cardIndex + 1,
                    }}
                  >
                    <CardView
                      card={item.card}
                      isFaceUp={item.isFaceUp}
                      isSelected={isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.isFaceUp) {
                          setSelectedCardInfo({
                            source: 'tableau',
                            colIndex,
                            cardIndex,
                          });
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (item.isFaceUp && cardIndex === col.length - 1) {
                          handleAutoMoveFoundation(item.card, { source: 'tableau', colIndex });
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Win Dialog (Simple "You win!" dialog, no sound) */}
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
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>You win!</div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>Congratulations! You solved Klondike Solitaire!</p>
            <button
              className="win-btn"
              onClick={dealNewGame}
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
              Deal New Game
            </button>
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
              Solitaire
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Standard Draw-One Klondike Solitaire for Windows 98.
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
