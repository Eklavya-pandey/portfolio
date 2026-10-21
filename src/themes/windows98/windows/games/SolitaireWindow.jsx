import React, { useState, useEffect, useCallback, useRef } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';

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

// TitleBar icon
export const SolitaireIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="12" height="14" rx="1" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    <path d="M8 4L5 9H11L8 4Z" fill="#CC0000" />
    <text x="3" y="6" fontSize="5" fontFamily="Arial" fill="#CC0000" fontWeight="bold">A</text>
  </svg>
);

// Card View Component
function CardView({
  card,
  isFaceUp = true,
  isSelected = false,
  style = {},
  onClick,
  onDoubleClick,
  onDragStart,
  draggable = false,
}) {
  if (!card) return null;

  // Blue cross-hatch pattern for card back
  if (!isFaceUp) {
    return (
      <div
        onClick={onClick}
        style={{
          width: '56px',
          height: '80px',
          borderRadius: '3px',
          background: '#000080',
          border: '1px solid #000000',
          boxShadow: '1px 1px 2px rgba(0,0,0,0.4)',
          boxSizing: 'border-box',
          padding: '2px',
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
            border: '1px solid #FFFFFF',
            borderRadius: '2px',
            background:
              'repeating-linear-gradient(45deg, #000080, #000080 3px, #1044A0 3px, #1044A0 6px), repeating-linear-gradient(-45deg, #000080, #000080 3px, #1044A0 3px, #1044A0 6px)',
            boxSizing: 'border-box',
          }}
        />
      </div>
    );
  }

  const isRed = card.color === 'red';
  const textColor = isRed ? '#D00000' : '#000000';

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      draggable={draggable}
      style={{
        width: '56px',
        height: '80px',
        borderRadius: '3px',
        background: isSelected ? '#FFFFCC' : '#FFFFFF',
        border: isSelected ? '2px solid #0000FF' : '1px solid #000000',
        boxShadow: '1px 1px 2px rgba(0,0,0,0.35)',
        boxSizing: 'border-box',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        color: textColor,
        fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
        ...style,
      }}
    >
      {/* Top Left Rank and Suit */}
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
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{card.label}</span>
        <span style={{ fontSize: '11px' }}>{card.symbol}</span>
      </div>

      {/* Center Symbol */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: card.val > 10 ? '16px' : '22px',
          fontWeight: card.val > 10 ? 'bold' : 'normal',
          lineHeight: '22px',
        }}
      >
        {card.val > 10 ? card.label : card.symbol}
      </div>

      {/* Bottom Right Rank and Suit - rotated 180 degrees */}
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
  const [selectedCardInfo, setSelectedCardInfo] = useState(null);
  const [history, setHistory] = useState([]);

  // Options & Stats
  const [drawThree, setDrawThree] = useState(false);
  const [scoringMode, setScoringMode] = useState('Standard'); // 'Standard' | 'Vegas' | 'None'
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  // Dialogs
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Cascade win animation
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize new game
  const dealNewGame = useCallback(() => {
    const deck = generateDeck();
    const newTableau = [[], [], [], [], [], [], []];

    // Deal: 1 in col 0, 2 in col 1, ..., 7 in col 6
    for (let c = 0; c < 7; c++) {
      for (let r = 0; r <= c; r++) {
        const card = deck.pop();
        newTableau[c].push({
          card,
          isFaceUp: r === c,
        });
      }
    }

    setStock(deck);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setTableau(newTableau);
    setSelectedCardInfo(null);
    setHistory([]);
    setScore(scoringMode === 'Vegas' ? -52 : 0);
    setTime(0);
    setIsGameActive(false);
    setIsWon(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, [scoringMode]);

  useEffect(() => {
    dealNewGame();
  }, [dealNewGame]);

  // Timer
  useEffect(() => {
    if (isGameActive && !isWon) {
      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, isWon]);

  // Push history
  const pushHistory = () => {
    setIsGameActive(true);
    setHistory((prev) => [
      ...prev.slice(-30),
      {
        stock: [...stock],
        waste: [...waste],
        foundations: foundations.map((f) => [...f]),
        tableau: tableau.map((col) => col.map((c) => ({ ...c }))),
        score,
      },
    ]);
  };

  // Undo
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setStock(last.stock);
    setWaste(last.waste);
    setFoundations(last.foundations);
    setTableau(last.tableau);
    setScore(last.score);
    setSelectedCardInfo(null);
    setIsWon(false);
  };

  // Stock click
  const handleStockClick = () => {
    pushHistory();
    if (stock.length > 0) {
      const drawCount = drawThree ? Math.min(3, stock.length) : 1;
      const nextStock = [...stock];
      const drawn = [];
      for (let i = 0; i < drawCount; i++) {
        drawn.push(nextStock.pop());
      }
      setStock(nextStock);
      setWaste((prev) => [...prev, ...drawn]);
    } else {
      // Recycle waste to stock
      setStock([...waste].reverse());
      setWaste([]);
      if (scoringMode === 'Standard') {
        setScore((s) => Math.max(0, s - 20));
      }
    }
    setSelectedCardInfo(null);
  };

  // Foundation placement validation
  const canPlaceOnFoundation = (card, targetPile) => {
    if (!card) return false;
    if (targetPile.length === 0) {
      return card.val === 1; // Ace only
    }
    const top = targetPile[targetPile.length - 1];
    return top.suit === card.suit && card.val === top.val + 1;
  };

  // Tableau placement validation
  const canPlaceOnTableau = (movingCard, targetCol) => {
    if (!movingCard) return false;
    if (targetCol.length === 0) {
      return movingCard.val === 13; // King only
    }
    const top = targetCol[targetCol.length - 1];
    if (!top.isFaceUp) return false;
    return top.card.color !== movingCard.color && top.card.val === movingCard.val + 1;
  };

  // Auto-move on double click
  const handleAutoMoveFoundation = (card, sourceInfo) => {
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      if (canPlaceOnFoundation(card, foundations[fIdx])) {
        pushHistory();
        if (sourceInfo.source === 'waste') {
          setWaste((prev) => prev.slice(0, prev.length - 1));
          setScore((s) => s + 10);
        } else if (sourceInfo.source === 'tableau') {
          setTableau((prev) => {
            const nextTab = prev.map((col) => [...col]);
            nextTab[sourceInfo.colIndex].pop();
            const col = nextTab[sourceInfo.colIndex];
            if (col.length > 0 && !col[col.length - 1].isFaceUp) {
              col[col.length - 1].isFaceUp = true;
              setScore((s) => s + 5);
            }
            return nextTab;
          });
          setScore((s) => s + 10);
        }

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

  // Tableau column click
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

      if (selectedCardInfo.source === 'waste') {
        setWaste((prev) => prev.slice(0, prev.length - 1));
        setScore((s) => s + 5);
      } else if (selectedCardInfo.source === 'foundation') {
        setFoundations((prev) => {
          const nextF = prev.map((pile) => [...pile]);
          nextF[selectedCardInfo.fIndex].pop();
          return nextF;
        });
        setScore((s) => Math.max(0, s - 15));
      } else if (selectedCardInfo.source === 'tableau') {
        setTableau((prev) => {
          const nextT = prev.map((col) => [...col]);
          nextT[selectedCardInfo.colIndex] = nextT[selectedCardInfo.colIndex].slice(
            0,
            selectedCardInfo.cardIndex
          );
          const col = nextT[selectedCardInfo.colIndex];
          if (col.length > 0 && !col[col.length - 1].isFaceUp) {
            col[col.length - 1].isFaceUp = true;
            setScore((s) => s + 5);
          }
          return nextT;
        });
      }

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

  // Foundation pile click
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

      if (selectedCardInfo.source === 'waste') {
        setWaste((prev) => prev.slice(0, prev.length - 1));
        setScore((s) => s + 10);
      } else if (selectedCardInfo.source === 'tableau') {
        setTableau((prev) => {
          const nextT = prev.map((col) => [...col]);
          nextT[selectedCardInfo.colIndex].pop();
          const col = nextT[selectedCardInfo.colIndex];
          if (col.length > 0 && !col[col.length - 1].isFaceUp) {
            col[col.length - 1].isFaceUp = true;
            setScore((s) => s + 5);
          }
          return nextT;
        });
        setScore((s) => s + 10);
      }

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

  // Check victory (all 52 cards on foundations)
  useEffect(() => {
    const totalFoundations = foundations.reduce((acc, f) => acc + f.length, 0);
    if (totalFoundations === 52 && !isWon) {
      setIsWon(true);
      startWinCascade();
    }
  }, [foundations, isWon]);

  // Classic Windows 98 Bouncing Cards Cascade Animation
  const startWinCascade = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement.clientWidth || 600;
    canvas.height = canvas.parentElement.clientHeight || 420;

    // Build array of 52 cards ordered by rank descending from foundations
    const cardsToBounce = [];
    for (let f = 3; f >= 0; f--) {
      for (let r = 12; r >= 0; r--) {
        cardsToBounce.push({
          suit: SUITS[f].name,
          symbol: SUITS[f].symbol,
          color: SUITS[f].color,
          label: RANKS[r].label,
          val: RANKS[r].val,
          x: canvas.width - (4 - f) * 64,
          y: 12,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 2 + 1,
          done: false,
        });
      }
    }

    let currentCardIndex = 0;
    const activeCards = [];

    const drawCardStamp = (c) => {
      const w = 56;
      const h = 80;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(c.x, c.y, w, h);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(c.x, c.y, w, h);

      ctx.fillStyle = c.color === 'red' ? '#D00000' : '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(c.label, c.x + 4, c.y + 12);
      ctx.fillText(c.symbol, c.x + 4, c.y + 24);

      ctx.font = '16px sans-serif';
      ctx.fillText(c.symbol, c.x + 22, c.y + 46);
    };

    const animate = () => {
      // Release next card periodically
      if (currentCardIndex < cardsToBounce.length) {
        activeCards.push(cardsToBounce[currentCardIndex]);
        currentCardIndex++;
      }

      for (let i = 0; i < activeCards.length; i++) {
        const c = activeCards[i];
        if (c.done) continue;

        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.45; // Gravity

        // Bounce on floor
        if (c.y + 80 >= canvas.height) {
          c.y = canvas.height - 80;
          c.vy = -c.vy * 0.82;
          if (Math.abs(c.vy) < 1) {
            c.done = true;
          }
        }

        // Draw card stamp without clearing canvas to create classic trail
        drawCardStamp(c);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const menuItems = [
    {
      label: 'Game',
      items: [
        { label: 'Deal (New Game)', onClick: dealNewGame },
        { label: 'Undo', onClick: handleUndo },
        { isSeparator: true },
        { label: 'Deck...', onClick: () => alert('Deck backs: Blue Cross-Hatch selected.') },
        { label: 'Options...', onClick: () => setShowOptionsDialog(true) },
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
    <>
      <Window
        id="window-solitaire"
        title="Solitaire"
        icon={<SolitaireIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={isMaximized}
        zIndex={zIndex}
        position={position}
        defaultWidth={630}
        defaultHeight={480}
        resizable={true}
        allowMaximize={true}
        hasMenu={true}
        menuItems={menuItems}
        hasStatusBar={true}
        statusText={`Score: ${score}   Time: ${time}`}
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
            padding: '12px',
            boxSizing: 'border-box',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            userSelect: 'none',
            position: 'relative',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          }}
        >
          {/* Top Row: Stock, Waste, and 4 Foundations */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              maxWidth: '580px',
            }}
          >
            {/* Stock and Waste */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Stock Slot */}
              <div
                onClick={handleStockClick}
                style={{
                  width: '56px',
                  height: '80px',
                  borderRadius: '3px',
                  border: '1px solid #005000',
                  background: 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {stock.length > 0 ? (
                  <CardView isFaceUp={false} card={stock[stock.length - 1]} />
                ) : (
                  // Classic Green 'O' circle indicating empty stock
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      border: '3px solid #005000',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>

              {/* Waste Slot */}
              <div
                style={{
                  width: '56px',
                  height: '80px',
                  borderRadius: '3px',
                  border: '1px solid #005000',
                  position: 'relative',
                  background: 'rgba(0,0,0,0.1)',
                  boxSizing: 'border-box',
                }}
              >
                {waste.length > 0 && (
                  <CardView
                    card={waste[waste.length - 1]}
                    isFaceUp={true}
                    isSelected={selectedCardInfo?.source === 'waste'}
                    onClick={() => setSelectedCardInfo({ source: 'waste' })}
                    onDoubleClick={() =>
                      handleAutoMoveFoundation(waste[waste.length - 1], { source: 'waste' })
                    }
                  />
                )}
              </div>
            </div>

            {/* 4 Foundations */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {foundations.map((pile, fIdx) => (
                <div
                  key={`found-${fIdx}`}
                  onClick={() => handleFoundationClick(fIdx)}
                  style={{
                    width: '56px',
                    height: '80px',
                    borderRadius: '3px',
                    border: '1px solid #005000',
                    background: 'rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    boxSizing: 'border-box',
                  }}
                >
                  {pile.length > 0 ? (
                    <CardView
                      card={pile[pile.length - 1]}
                      isFaceUp={true}
                      isSelected={
                        selectedCardInfo?.source === 'foundation' &&
                        selectedCardInfo?.fIndex === fIdx
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCardInfo({ source: 'foundation', fIndex: fIdx });
                      }}
                    />
                  ) : (
                    <span style={{ color: '#005000', fontSize: '18px', opacity: 0.6 }}>
                      {SUITS[fIdx].symbol}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7 Tableau Columns */}
          <div style={{ display: 'flex', gap: '8px', flex: 1, minHeight: '260px' }}>
            {tableau.map((col, colIndex) => (
              <div
                key={`tab-col-${colIndex}`}
                onClick={() => handleTableauColClick(colIndex)}
                style={{
                  width: '56px',
                  minHeight: '220px',
                  position: 'relative',
                  border: col.length === 0 ? '1px dashed #005000' : 'none',
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

          {/* Win Cascade Canvas Overlay */}
          {isWon && (
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 50,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* You Won Message Dialog */}
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
                zIndex: 60,
                minWidth: '220px',
                textAlign: 'center',
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
                Solitaire
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                  You won!
                </div>
                <p style={{ margin: '0 0 14px 0' }}>
                  Congratulations! Solitaire completed in {time} seconds.
                </p>
                <button
                  onClick={dealNewGame}
                  style={{
                    padding: '3px 14px',
                    background: '#C0C0C0',
                    boxShadow:
                      '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
                    border: 'none',
                    fontSize: '11px',
                    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                    cursor: 'pointer',
                  }}
                >
                  Deal Again
                </button>
              </div>
            </div>
          )}
        </div>
      </Window>

      {/* Options Dialog */}
      {showOptionsDialog && (
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
          onClick={() => setShowOptionsDialog(false)}
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
              Options
            </div>
            <div style={{ padding: '12px 14px' }}>
              <fieldset
                style={{
                  border: '1px solid #808080',
                  padding: '8px 10px',
                  marginBottom: '10px',
                }}
              >
                <legend>Draw</legend>
                <label style={{ display: 'block', marginBottom: '4px' }}>
                  <input
                    type="radio"
                    name="drawOption"
                    checked={!drawThree}
                    onChange={() => setDrawThree(false)}
                  />{' '}
                  Draw One
                </label>
                <label style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name="drawOption"
                    checked={drawThree}
                    onChange={() => setDrawThree(true)}
                  />{' '}
                  Draw Three
                </label>
              </fieldset>

              <fieldset
                style={{
                  border: '1px solid #808080',
                  padding: '8px 10px',
                  marginBottom: '12px',
                }}
              >
                <legend>Scoring</legend>
                <label style={{ display: 'block', marginBottom: '4px' }}>
                  <input
                    type="radio"
                    name="scoreOption"
                    checked={scoringMode === 'Standard'}
                    onChange={() => setScoringMode('Standard')}
                  />{' '}
                  Standard
                </label>
                <label style={{ display: 'block', marginBottom: '4px' }}>
                  <input
                    type="radio"
                    name="scoreOption"
                    checked={scoringMode === 'Vegas'}
                    onChange={() => setScoringMode('Vegas')}
                  />{' '}
                  Vegas
                </label>
                <label style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name="scoreOption"
                    checked={scoringMode === 'None'}
                    onChange={() => setScoringMode('None')}
                  />{' '}
                  None
                </label>
              </fieldset>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => setShowOptionsDialog(false)}
                  style={{
                    padding: '2px 14px',
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

      {/* About Solitaire Dialog */}
      <AboutAppDialog
        isOpen={showAboutDialog}
        appName="Solitaire"
        version="Version 4.10.1998"
        icon={<SolitaireIconSmall />}
        description="Shuffling cards instead of doing real work."
        onClose={() => setShowAboutDialog(false)}
      />
    </>
  );
}
