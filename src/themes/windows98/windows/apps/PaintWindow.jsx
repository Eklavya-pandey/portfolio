import React, { useState, useRef, useEffect, useCallback } from 'react';
import Window from '../../components/Window';

// 16 Classic Windows 98 Colors
const WIN98_COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
];

// Small Paint Icon
export const PaintIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" fill="#EFEFEF" stroke="#000" strokeWidth="1" />
    <path d="M4 11 C4 7 8 5 12 4 C11 8 9 12 4 11 Z" fill="#0000FF" />
    <circle cx="6" cy="6" r="1.5" fill="#FF0000" />
    <circle cx="10" cy="9" r="1.5" fill="#FFFF00" />
    <circle cx="8" cy="11" r="1.5" fill="#008000" />
  </svg>
);

const TOOLS = [
  { id: 'pencil', label: 'Pencil', icon: '✏️' },
  { id: 'brush', label: 'Brush', icon: '🖌️' },
  { id: 'eraser', label: 'Eraser', icon: '🧹' },
  { id: 'bucket', label: 'Fill Bucket', icon: '🪣' },
  { id: 'line', label: 'Line', icon: '📏' },
  { id: 'rect', label: 'Rectangle', icon: '⬜' },
  { id: 'ellipse', label: 'Ellipse', icon: '⭕' },
  { id: 'text', label: 'Text', icon: '🅰️' },
  { id: 'picker', label: 'Color Picker', icon: '🧪' },
];

export default function PaintWindow({
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
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);
  const [fillStyle, setFillStyle] = useState('outline'); // 'outline' | 'fill-outline' | 'fill-only'
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState(null);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Close dialog on Escape key
  useEffect(() => {
    if (!showAboutDialog) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowAboutDialog(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAboutDialog]);

  // Initialize canvas with white background
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Initial undo snapshot
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack([initialData]);
  }, [isOpen]);

  const saveUndo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev.slice(-19), data]);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const nextStack = [...undoStack];
    nextStack.pop(); // Remove current
    const prevData = nextStack[nextStack.length - 1];
    ctx.putImageData(prevData, 0, 0);
    setUndoStack(nextStack);
  }, [undoStack]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveUndo();
  }, [saveUndo]);

  const handleSaveAsPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'untitled.png';
    link.href = dataUrl;
    link.click();
  }, []);

  // Flood fill algorithm
  const floodFill = (startX, startY, fillColorHex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const startIndex = (startY * w + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    // Convert hex color to rgb
    const tempEl = document.createElement('div');
    tempEl.style.color = fillColorHex;
    document.body.appendChild(tempEl);
    const rgbStr = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    const match = rgbStr.match(/\d+/g);
    if (!match) return;
    const [fillR, fillG, fillB] = match.map(Number);
    const fillA = 255;

    if (
      targetR === fillR &&
      targetG === fillG &&
      targetB === fillB &&
      targetA === fillA
    ) {
      return;
    }

    const queue = [[startX, startY]];
    const visited = new Uint8Array(w * h);

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const idx = (y * w + x) * 4;
      const vIdx = y * w + x;

      if (x < 0 || x >= w || y < 0 || y >= h || visited[vIdx]) continue;

      if (
        data[idx] === targetR &&
        data[idx + 1] === targetG &&
        data[idx + 2] === targetB &&
        data[idx + 3] === targetA
      ) {
        visited[vIdx] = 1;
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;

        if (x + 1 < w) queue.push([x + 1, y]);
        if (x - 1 >= 0) queue.push([x - 1, y]);
        if (y + 1 < h) queue.push([x, y + 1]);
        if (y - 1 >= 0) queue.push([x, y - 1]);
      }
    }
    ctx.putImageData(imgData, 0, 0);
    saveUndo();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(e.clientX - rect.left),
      y: Math.floor(e.clientY - rect.top),
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (selectedTool === 'picker') {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      if (e.button === 2) {
        setSecondaryColor(hex);
      } else {
        setPrimaryColor(hex);
      }
      return;
    }

    if (selectedTool === 'bucket') {
      floodFill(x, y, e.button === 2 ? secondaryColor : primaryColor);
      return;
    }

    if (selectedTool === 'text') {
      setTextPos({ x, y });
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    const color = e.button === 2 ? secondaryColor : primaryColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = selectedTool === 'eraser' ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (selectedTool === 'pencil' || selectedTool === 'brush' || selectedTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      if (selectedTool === 'eraser') {
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas || !snapshot) return;
    const ctx = canvas.getContext('2d');

    const color = e.buttons === 2 ? secondaryColor : primaryColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = selectedTool === 'eraser' ? lineWidth * 4 : lineWidth;

    if (selectedTool === 'pencil' || selectedTool === 'brush' || selectedTool === 'eraser') {
      if (selectedTool === 'eraser') {
        ctx.strokeStyle = '#FFFFFF';
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Restore snapshot for live preview
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();

      if (selectedTool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (selectedTool === 'rect') {
        const left = Math.min(startPos.x, x);
        const top = Math.min(startPos.y, y);
        const w = Math.abs(x - startPos.x);
        const h = Math.abs(y - startPos.y);

        if (fillStyle === 'outline' || fillStyle === 'fill-outline') {
          ctx.strokeRect(left, top, w, h);
        }
        if (fillStyle === 'fill-outline' || fillStyle === 'fill-only') {
          ctx.fillStyle = fillStyle === 'fill-outline' ? secondaryColor : primaryColor;
          ctx.fillRect(left, top, w, h);
          if (fillStyle === 'fill-outline') {
            ctx.strokeRect(left, top, w, h);
          }
        }
      } else if (selectedTool === 'ellipse') {
        const rx = Math.abs(x - startPos.x) / 2;
        const ry = Math.abs(y - startPos.y) / 2;
        const cx = Math.min(startPos.x, x) + rx;
        const cy = Math.min(startPos.y, y) + ry;

        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (fillStyle === 'outline' || fillStyle === 'fill-outline') {
          ctx.stroke();
        }
        if (fillStyle === 'fill-outline' || fillStyle === 'fill-only') {
          ctx.fillStyle = fillStyle === 'fill-outline' ? secondaryColor : primaryColor;
          ctx.fill();
          if (fillStyle === 'fill-outline') {
            ctx.stroke();
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSnapshot(null);
    saveUndo();
  };

  // Commit text tool
  const handleCommitText = () => {
    if (!textPos || !textInput.trim()) {
      setTextPos(null);
      setTextInput('');
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = primaryColor;
      ctx.fillText(textInput, textPos.x, textPos.y);
      saveUndo();
    }
    setTextPos(null);
    setTextInput('');
  };

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New', onClick: handleClear },
        { label: 'Save as PNG', onClick: handleSaveAsPNG },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo (Ctrl+Z)', onClick: handleUndo },
        { label: 'Clear Image', onClick: handleClear },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Tool Box ✓' },
        { label: 'Color Box ✓' },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Paint',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  return (
    <Window
      id="window-paint"
      title="untitled - Paint"
      icon={<PaintIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={640}
      defaultHeight={500}
      hasMenu={true}
      menuItems={menuItems}
      hasStatusBar={true}
      statusText="For Help, click Help Topics on the Help Menu."
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
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Main Body: Left Toolbox + Canvas */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          {/* Left Toolbox */}
          <div
            style={{
              width: '64px',
              background: '#C0C0C0',
              borderRight: '1px solid #808080',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            {/* Tool grid (2 columns) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 26px)',
                gap: '2px',
              }}
            >
              {TOOLS.map((tool) => {
                const isSelected = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    title={tool.label}
                    style={{
                      width: '26px',
                      height: '26px',
                      padding: 0,
                      background: '#C0C0C0',
                      border: '2px solid',
                      borderColor: isSelected
                        ? '#808080 #FFFFFF #FFFFFF #808080'
                        : '#FFFFFF #808080 #808080 #FFFFFF',
                      boxShadow: isSelected ? '1px 1px 0px #000 inset' : 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {tool.icon}
                  </button>
                );
              })}
            </div>

            {/* Sub-options for Rectangle / Ellipse / Line */}
            <div
              style={{
                border: '2px solid',
                borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                background: '#FFFFFF',
                padding: '4px 2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: '10px',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '9px', textAlign: 'center' }}>STYLE</div>
              <div
                onClick={() => setFillStyle('outline')}
                style={{
                  padding: '2px',
                  background: fillStyle === 'outline' ? '#000080' : 'transparent',
                  color: fillStyle === 'outline' ? '#FFF' : '#000',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Outline
              </div>
              <div
                onClick={() => setFillStyle('fill-outline')}
                style={{
                  padding: '2px',
                  background: fillStyle === 'fill-outline' ? '#000080' : 'transparent',
                  color: fillStyle === 'fill-outline' ? '#FFF' : '#000',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Fill+Out
              </div>
              <div
                onClick={() => setFillStyle('fill-only')}
                style={{
                  padding: '2px',
                  background: fillStyle === 'fill-only' ? '#000080' : 'transparent',
                  color: fillStyle === 'fill-only' ? '#FFF' : '#000',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Solid
              </div>
            </div>

            {/* Line Width */}
            <div
              style={{
                border: '2px solid',
                borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                background: '#FFFFFF',
                padding: '4px 2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                alignItems: 'center',
              }}
            >
              {[1, 2, 4].map((w) => (
                <div
                  key={w}
                  onClick={() => setLineWidth(w)}
                  style={{
                    width: '80%',
                    height: `${w}px`,
                    background: lineWidth === w ? '#000080' : '#000000',
                    cursor: 'pointer',
                    margin: '3px 0',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Canvas Working Area */}
          <div
            style={{
              flex: 1,
              background: '#808080',
              padding: '8px',
              overflow: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              position: 'relative',
            }}
          >
            <div
              style={{
                border: '2px solid',
                borderColor: '#000000 #FFFFFF #FFFFFF #000000',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                background: '#FFFFFF',
                position: 'relative',
              }}
            >
              <canvas
                ref={canvasRef}
                width={500}
                height={360}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  display: 'block',
                  cursor: selectedTool === 'picker' ? 'crosshair' : 'default',
                }}
              />

              {/* Text Input Overlay */}
              {textPos && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${textPos.x}px`,
                    top: `${textPos.y - 10}px`,
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px dashed #000',
                    padding: '2px',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 10,
                  }}
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommitText();
                    }}
                    autoFocus
                    placeholder="Type text..."
                    style={{ fontSize: '12px', border: '1px solid #808080', padding: '1px 3px' }}
                  />
                  <button onClick={handleCommitText} style={{ fontSize: '10px' }}>OK</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Color Palette (16 Colors) */}
        <div
          style={{
            height: '42px',
            background: '#C0C0C0',
            borderTop: '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            gap: '8px',
            boxSizing: 'border-box',
          }}
        >
          {/* Active Colors Swatch (Foreground / Background) */}
          <div
            style={{
              width: '32px',
              height: '32px',
              position: 'relative',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              background: '#C0C0C0',
              flexShrink: 0,
            }}
          >
            {/* Secondary Color Box (Bottom Right) */}
            <div
              style={{
                position: 'absolute',
                right: '2px',
                bottom: '2px',
                width: '15px',
                height: '15px',
                background: secondaryColor,
                border: '1px solid #000000',
                boxShadow: '1px 1px 0px #FFF',
              }}
              title="Secondary Color (Right Click to set)"
            />
            {/* Primary Color Box (Top Left) */}
            <div
              style={{
                position: 'absolute',
                left: '2px',
                top: '2px',
                width: '15px',
                height: '15px',
                background: primaryColor,
                border: '1px solid #000000',
                boxShadow: '1px 1px 0px #FFF',
                zIndex: 2,
              }}
              title="Primary Color (Left Click to set)"
            />
          </div>

          {/* 16 Palette Swatches (2 rows of 8) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 15px)',
              gridTemplateRows: 'repeat(2, 15px)',
              gap: '2px',
            }}
          >
            {WIN98_COLORS.map((hex, idx) => (
              <div
                key={`color-${idx}`}
                onClick={() => setPrimaryColor(hex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSecondaryColor(hex);
                }}
                title={`${hex} (Left click: primary, Right click: secondary)`}
                style={{
                  width: '15px',
                  height: '15px',
                  background: hex,
                  border: '1px solid #808080',
                  boxShadow: '1px 1px 0px #FFFFFF inset',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              />
            ))}
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
              padding: '16px 20px',
              zIndex: 100,
              minWidth: '220px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              Paint
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Windows 98 classic canvas painting application.
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
