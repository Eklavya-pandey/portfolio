import React, { useState, useEffect, useCallback } from 'react';
import Window from '../../components/Window';

// Small Calculator Icon
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
  isMaximized,
  zIndex,
  position,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
}) {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Clear All
  const clearAll = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  // Clear Entry
  const clearEntry = useCallback(() => {
    setDisplay('0');
    setWaitingForOperand(false);
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === '0' || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  }, []);

  // Input Digit
  const inputDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay((prev) => (prev === '0' || prev === 'Error' ? String(digit) : prev + digit));
    }
  }, [waitingForOperand]);

  // Input Decimal
  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  }, [waitingForOperand, display]);

  // Toggle Sign (+/-)
  const toggleSign = useCallback(() => {
    setDisplay((prev) => {
      const val = parseFloat(prev);
      if (isNaN(val)) return '0';
      return String(-val);
    });
  }, []);

  // Perform Calculation
  const calculate = (first, second, op) => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        return second === 0 ? 'Error' : first / second;
      default:
        return second;
    }
  };

  // Perform Binary Operation (+, -, *, /)
  const performOperation = useCallback((nextOp) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      const result = calculate(currentValue, inputValue, operation);
      if (result === 'Error') {
        setDisplay('Cannot divide by zero');
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }
      // Round to 10 decimal places to prevent float precision oddities
      const rounded = parseFloat(Number(result).toPrecision(12));
      setDisplay(String(rounded));
      setPrevValue(rounded);
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  }, [display, prevValue, operation]);

  // Equals (=)
  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display);
    if (operation && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operation);
      if (result === 'Error') {
        setDisplay('Cannot divide by zero');
      } else {
        const rounded = parseFloat(Number(result).toPrecision(12));
        setDisplay(String(rounded));
        setPrevValue(null);
        setOperation(null);
      }
      setWaitingForOperand(true);
    }
  }, [display, operation, prevValue]);

  // Square Root
  const handleSqrt = useCallback(() => {
    const val = parseFloat(display);
    if (val < 0) {
      setDisplay('Invalid input');
    } else {
      setDisplay(String(Math.sqrt(val)));
    }
    setWaitingForOperand(true);
  }, [display]);

  // Percentage
  const handlePercent = useCallback(() => {
    const val = parseFloat(display);
    if (prevValue !== null) {
      const pct = (prevValue * val) / 100;
      setDisplay(String(pct));
    } else {
      setDisplay(String(val / 100));
    }
    setWaitingForOperand(true);
  }, [display, prevValue]);

  // 1 / x
  const handleReciprocal = useCallback(() => {
    const val = parseFloat(display);
    if (val === 0) {
      setDisplay('Cannot divide by zero');
    } else {
      setDisplay(String(1 / val));
    }
    setWaitingForOperand(true);
  }, [display]);

  // Memory Functions
  const memoryClear = useCallback(() => setMemory(0), []);
  const memoryRecall = useCallback(() => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  }, [memory]);
  const memoryStore = useCallback(() => {
    setMemory(parseFloat(display) || 0);
    setWaitingForOperand(true);
  }, [display]);
  const memoryAdd = useCallback(() => {
    setMemory((m) => m + (parseFloat(display) || 0));
    setWaitingForOperand(true);
  }, [display]);

  // Keyboard support when window is active
  useEffect(() => {
    if (!isOpen || !isActive) return;

    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        inputDigit(Number(e.key));
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
        if (showAboutDialog) {
          setShowAboutDialog(false);
        } else {
          clearAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isActive, showAboutDialog, inputDigit, inputDot, performOperation, handleEquals, handleBackspace, clearAll]);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard?.writeText(display);
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const num = parseFloat(text);
      if (!isNaN(num)) {
        setDisplay(String(num));
      }
    } catch {}
  };

  const menuItems = [
    {
      label: 'Edit',
      items: [
        { label: 'Copy (Ctrl+C)', onClick: handleCopy },
        { label: 'Paste (Ctrl+V)', onClick: handlePaste },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Calculator',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  const btnStyle = (color = '#000080', width = '34px') => ({
    width,
    height: '26px',
    background: '#C0C0C0',
    border: '2px solid',
    borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
    boxShadow: '1px 1px 0px #000000',
    color,
    fontFamily: "'MS Sans Serif', Tahoma, sans-serif",
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    outline: 'none',
  });

  return (
    <Window
      id="window-calculator"
      title="Calculator"
      icon={<CalculatorIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={false}
      zIndex={zIndex}
      position={position}
      defaultWidth={250}
      defaultHeight={250}
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
          background: '#C0C0C0',
          padding: '8px 10px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          userSelect: 'none',
        }}
      >
        {/* LCD Display */}
        <div
          style={{
            height: '26px',
            background: '#FFFFFF',
            border: '2px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            boxShadow: '1px 1px 0px #000000 inset',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 6px',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000000',
            overflow: 'hidden',
          }}
        >
          {display}
        </div>

        {/* Top Control Bar: Memory Indicator & Edit Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Memory Indicator Box */}
          <div
            style={{
              width: '26px',
              height: '24px',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              background: '#C0C0C0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              color: '#CC0000',
            }}
          >
            {memory !== 0 ? 'M' : ''}
          </div>

          {/* Backspace, CE, C */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={btnStyle('#CC0000', '58px')} onClick={handleBackspace}>
              Backspace
            </button>
            <button style={btnStyle('#CC0000', '40px')} onClick={clearEntry}>
              CE
            </button>
            <button style={btnStyle('#CC0000', '40px')} onClick={clearAll}>
              C
            </button>
          </div>
        </div>

        {/* Keypad Grid (Memory Column + 4 Operator/Digit Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
          {/* Row 1 */}
          <button style={btnStyle('#CC0000')} onClick={memoryClear}>MC</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(7)}>7</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(8)}>8</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(9)}>9</button>
          <button style={btnStyle('#CC0000')} onClick={() => performOperation('/')}>/</button>

          {/* Row 2 */}
          <button style={btnStyle('#CC0000')} onClick={memoryRecall}>MR</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(4)}>4</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(5)}>5</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(6)}>6</button>
          <button style={btnStyle('#CC0000')} onClick={() => performOperation('*')}>*</button>

          {/* Row 3 */}
          <button style={btnStyle('#CC0000')} onClick={memoryStore}>MS</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(1)}>1</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(2)}>2</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(3)}>3</button>
          <button style={btnStyle('#CC0000')} onClick={() => performOperation('-')}>-</button>

          {/* Row 4 */}
          <button style={btnStyle('#CC0000')} onClick={memoryAdd}>M+</button>
          <button style={btnStyle('#000080')} onClick={() => inputDigit(0)}>0</button>
          <button style={btnStyle('#000080')} onClick={toggleSign}>+/-</button>
          <button style={btnStyle('#000080')} onClick={inputDot}>.</button>
          <button style={btnStyle('#CC0000')} onClick={() => performOperation('+')}>+</button>

          {/* Extra utility row */}
          <button style={btnStyle('#CC0000')} onClick={handleSqrt}>sqrt</button>
          <button style={btnStyle('#CC0000')} onClick={handlePercent}>%</button>
          <button style={btnStyle('#CC0000')} onClick={handleReciprocal}>1/x</button>
          <button style={{ ...btnStyle('#CC0000', '100%'), gridColumn: 'span 2' }} onClick={handleEquals}>
            =
          </button>
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
              padding: '16px 20px',
              zIndex: 100,
              minWidth: '220px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              Calculator
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Windows 98 Standard Calculator recreation.
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
