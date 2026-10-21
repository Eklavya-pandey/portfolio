import React, { useState, useEffect, useCallback, useRef } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';
import { useSound } from '../../../../context/SoundContext';

export const CalculatorIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="12" height="14" rx="1" fill="#C0C0C0" stroke="#000" strokeWidth="1" />
    <rect x="4" y="3" width="8" height="3" fill="#FFF" stroke="#000" strokeWidth="0.5" />
    <rect x="4" y="8" width="2" height="2" fill="#000080" />
    <rect x="7" y="8" width="2" height="2" fill="#000080" />
    <rect x="10" y="8" width="2" height="2" fill="#800000" />
    <rect x="4" y="11" width="2" height="2" fill="#000080" />
    <rect x="7" y="11" width="2" height="2" fill="#000080" />
    <rect x="10" y="11" width="2" height="2" fill="#800000" />
  </svg>
);

export default function CalculatorWindow({
  isOpen,
  isActive,
  zIndex,
  position,
  onFocus,
  onMinimize,
  onClose,
}) {
  const { playSound } = useSound();

  const [display, setDisplay] = useState('0.');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  // Clear All (C / Esc)
  const clearAll = useCallback(() => {
    setDisplay('0.');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  // Clear Entry (CE / Del)
  const clearEntry = useCallback(() => {
    setDisplay('0.');
    setWaitingForOperand(false);
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev === 'Cannot divide by zero' || prev === 'Error') return '0.';
      let stripped = prev.endsWith('.') ? prev.slice(0, -1) : prev;
      if (stripped.length <= 1 || stripped === '0' || stripped === '-0') return '0.';
      const next = stripped.slice(0, -1);
      return next.includes('.') ? next : next + '.';
    });
  }, []);

  // Input Digit
  const inputDigit = useCallback((digit) => {
    setDisplay((prev) => {
      if (waitingForOperand || prev === 'Cannot divide by zero' || prev === '0.') {
        setWaitingForOperand(false);
        return String(digit) + '.';
      }
      // If ends with '.', replace or append
      if (prev.endsWith('.')) {
        const base = prev.slice(0, -1);
        if (base === '0') return String(digit) + '.';
        return base + digit + '.';
      }
      return prev + digit;
    });
  }, [waitingForOperand]);

  // Input Dot
  const inputDot = useCallback(() => {
    setDisplay((prev) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return '0.';
      }
      if (!prev.includes('.')) {
        return prev + '.';
      }
      return prev;
    });
  }, [waitingForOperand]);

  // Toggle Sign (+/-)
  const toggleSign = useCallback(() => {
    setDisplay((prev) => {
      if (prev === 'Cannot divide by zero') return prev;
      const num = parseFloat(prev);
      if (isNaN(num)) return '0.';
      const negated = -num;
      const str = String(negated);
      return str.includes('.') ? str : str + '.';
    });
  }, []);

  // Format result
  const formatResult = (num) => {
    if (isNaN(num)) return 'Cannot divide by zero';
    if (!isFinite(num)) return 'Cannot divide by zero';
    const str = String(Math.round(num * 1e10) / 1e10);
    return str.includes('.') ? str : str + '.';
  };

  // Perform binary operation
  const performOperation = useCallback((nextOp) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      let result = 0;
      switch (operation) {
        case '+':
          result = prevValue + inputValue;
          break;
        case '-':
          result = prevValue - inputValue;
          break;
        case '*':
          result = prevValue * inputValue;
          break;
        case '/':
          if (inputValue === 0) {
            setDisplay('Cannot divide by zero');
            setPrevValue(null);
            setOperation(null);
            setWaitingForOperand(true);
            return;
          }
          result = prevValue / inputValue;
          break;
        default:
          result = inputValue;
      }
      setDisplay(formatResult(result));
      setPrevValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOp === '=' ? null : nextOp);
  }, [display, prevValue, operation]);

  // Equals
  const handleEquals = useCallback(() => {
    performOperation('=');
  }, [performOperation]);

  // Unary Operations: Sqrt, %, 1/x
  const handleSqrt = useCallback(() => {
    const num = parseFloat(display);
    if (num < 0) {
      setDisplay('Error');
    } else {
      setDisplay(formatResult(Math.sqrt(num)));
    }
    setWaitingForOperand(true);
  }, [display]);

  const handlePercent = useCallback(() => {
    const num = parseFloat(display);
    if (prevValue !== null) {
      const pct = (prevValue * num) / 100;
      setDisplay(formatResult(pct));
    } else {
      setDisplay(formatResult(num / 100));
    }
    setWaitingForOperand(true);
  }, [display, prevValue]);

  const handleReciprocal = useCallback(() => {
    const num = parseFloat(display);
    if (num === 0) {
      setDisplay('Cannot divide by zero');
    } else {
      setDisplay(formatResult(1 / num));
    }
    setWaitingForOperand(true);
  }, [display]);

  // Memory Functions
  const handleMC = () => setMemory(0);
  const handleMR = () => {
    setDisplay(formatResult(memory));
    setWaitingForOperand(true);
  };
  const handleMS = () => {
    const num = parseFloat(display) || 0;
    setMemory(num);
    setWaitingForOperand(true);
  };
  const handleMPlus = () => {
    const num = parseFloat(display) || 0;
    setMemory((prev) => prev + num);
    setWaitingForOperand(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !isActive) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        inputDigit(parseInt(e.key, 10));
      } else if (e.key === '.') {
        e.preventDefault();
        inputDot();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        performOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearAll();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        clearEntry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isActive, inputDigit, inputDot, performOperation, handleEquals, handleBackspace, clearAll, clearEntry]);

  // Menu items
  const menuItems = [
    {
      label: 'Edit',
      items: [
        {
          label: 'Copy',
          shortcut: 'Ctrl+C',
          onClick: () => {
            navigator.clipboard.writeText(display).catch(() => {});
          },
        },
        {
          label: 'Paste',
          shortcut: 'Ctrl+V',
          onClick: async () => {
            try {
              const text = await navigator.clipboard.readText();
              const num = parseFloat(text);
              if (!isNaN(num)) {
                setDisplay(formatResult(num));
              }
            } catch {}
          },
        },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Standard', checked: true },
        { label: 'Scientific', disabled: true },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Help Topics', disabled: true },
        { isSeparator: true },
        {
          label: 'About Calculator',
          onClick: () => setShowAbout(true),
        },
      ],
    },
  ];

  const btnStyle = (color = '#000080') => ({
    height: '24px',
    background: '#C0C0C0',
    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
    border: 'none',
    color,
    fontSize: '11px',
    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: 0,
  });

  return (
    <>
      <Window
        id="calculator-window"
        title="Calculator"
        icon={<CalculatorIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={false}
        zIndex={zIndex}
        position={position}
        defaultWidth={258}
        defaultHeight={250}
        resizable={false}
        hasMenu={true}
        menuItems={menuItems}
        hasStatusBar={false}
        showMinimize={true}
        showMaximize={true}
        onFocus={onFocus}
        onMinimize={onMinimize}
        onClose={onClose}
      >
        <div
          style={{
            alignSelf: 'stretch',
            flex: 1,
            background: '#C0C0C0',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxSizing: 'border-box',
            userSelect: 'none',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          }}
        >
          {/* Sunken Right-Aligned Display Bar */}
          <div
            id="calc-display"
            style={{
              height: '24px',
              background: '#FFFFFF',
              border: '1px solid #808080',
              borderRightColor: '#FFFFFF',
              borderBottomColor: '#FFFFFF',
              boxShadow: '1px 1px 0px black inset',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 6px',
              color: '#000000',
              fontSize: '13px',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 700,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
            }}
          >
            {display}
          </div>

          {/* Row 1: Memory Box | Backspace | CE | C */}
          <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr', gap: '5px', alignItems: 'center' }}>
            {/* Memory Indicator Box */}
            <div
              style={{
                width: '30px',
                height: '24px',
                background: '#C0C0C0',
                border: '1px solid #808080',
                borderRightColor: '#FFFFFF',
                borderBottomColor: '#FFFFFF',
                boxShadow: '1px 1px 0px black inset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#800000',
                boxSizing: 'border-box',
              }}
            >
              {memory !== 0 ? 'M' : ''}
            </div>

            <button
              onClick={handleBackspace}
              style={btnStyle('#800000')}
            >
              Backspace
            </button>
            <button
              onClick={clearEntry}
              style={btnStyle('#800000')}
            >
              CE
            </button>
            <button
              onClick={clearAll}
              style={btnStyle('#800000')}
            >
              C
            </button>
          </div>

          {/* 4 Main Calculation Rows */}
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 24px)', gap: '5px' }}>
            {/* Row 1: MC | 7 | 8 | 9 | / | sqrt */}
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 1fr 1fr', gap: '5px' }}>
              <button onClick={handleMC} style={btnStyle('#800000')}>MC</button>
              <button onClick={() => inputDigit(7)} style={btnStyle('#000080')}>7</button>
              <button onClick={() => inputDigit(8)} style={btnStyle('#000080')}>8</button>
              <button onClick={() => inputDigit(9)} style={btnStyle('#000080')}>9</button>
              <button onClick={() => performOperation('/')} style={btnStyle('#800000')}>/</button>
              <button onClick={handleSqrt} style={btnStyle('#000080')}>sqrt</button>
            </div>

            {/* Row 2: MR | 4 | 5 | 6 | * | % */}
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 1fr 1fr', gap: '5px' }}>
              <button onClick={handleMR} style={btnStyle('#800000')}>MR</button>
              <button onClick={() => inputDigit(4)} style={btnStyle('#000080')}>4</button>
              <button onClick={() => inputDigit(5)} style={btnStyle('#000080')}>5</button>
              <button onClick={() => inputDigit(6)} style={btnStyle('#000080')}>6</button>
              <button onClick={() => performOperation('*')} style={btnStyle('#800000')}>*</button>
              <button onClick={handlePercent} style={btnStyle('#000080')}>%</button>
            </div>

            {/* Row 3: MS | 1 | 2 | 3 | - | 1/x */}
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 1fr 1fr', gap: '5px' }}>
              <button onClick={handleMS} style={btnStyle('#800000')}>MS</button>
              <button onClick={() => inputDigit(1)} style={btnStyle('#000080')}>1</button>
              <button onClick={() => inputDigit(2)} style={btnStyle('#000080')}>2</button>
              <button onClick={() => inputDigit(3)} style={btnStyle('#000080')}>3</button>
              <button onClick={() => performOperation('-')} style={btnStyle('#800000')}>-</button>
              <button onClick={handleReciprocal} style={btnStyle('#000080')}>1/x</button>
            </div>

            {/* Row 4: M+ | 0 | +/- | . | + | = */}
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 1fr 1fr', gap: '5px' }}>
              <button onClick={handleMPlus} style={btnStyle('#800000')}>M+</button>
              <button onClick={() => inputDigit(0)} style={btnStyle('#000080')}>0</button>
              <button onClick={toggleSign} style={btnStyle('#000080')}>+/-</button>
              <button onClick={inputDot} style={btnStyle('#000080')}>.</button>
              <button onClick={() => performOperation('+')} style={btnStyle('#800000')}>+</button>
              <button onClick={handleEquals} style={btnStyle('#800000')}>=</button>
            </div>
          </div>
        </div>
      </Window>

      {/* About Dialog */}
      <AboutAppDialog
        isOpen={showAbout}
        appName="Calculator"
        version="Version 4.10 (Windows 98)"
        icon={<CalculatorIconSmall />}
        description="It calculates. Unlike my sleep schedule."
        onClose={() => setShowAbout(false)}
      />
    </>
  );
}
