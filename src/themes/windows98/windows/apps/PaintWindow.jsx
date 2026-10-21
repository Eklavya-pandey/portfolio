import React, { useState, useRef, useEffect, useCallback } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';
import { useSound } from '../../../../context/SoundContext';

export const PaintIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" fill="#EFEFEF" stroke="#000" strokeWidth="1" />
    <path d="M4 11 C4 7 8 5 12 4 C11 8 9 12 4 11 Z" fill="#0000FF" />
    <circle cx="6" cy="6" r="1.5" fill="#FF0000" />
    <circle cx="10" cy="9" r="1.5" fill="#FFFF00" />
    <circle cx="8" cy="11" r="1.5" fill="#008000" />
  </svg>
);

// 28 Classic Windows 98 Paint Palette Colors (2 rows of 14)
const PAINT_PALETTE = [
  // Row 1
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080',
  '#800080', '#808040', '#004040', '#0080FF', '#004080', '#8000FF', '#804000',
  // Row 2
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF',
  '#FF00FF', '#FFFF80', '#00FF80', '#80FFFF', '#7F7FFF', '#FF0080', '#FF8040',
];

// Tool Definitions (16 tools in authentic order, 2 columns)
const TOOLS = [
  { id: 'free-select', name: 'Free-Form Select', hint: 'Selects a free-form part of the picture to move, copy, or edit.' },
  { id: 'select', name: 'Select', hint: 'Selects a rectangular part of the picture to move, copy, or edit.' },
  { id: 'eraser', name: 'Eraser', hint: 'Erases a portion of the picture, using the selected eraser shape.' },
  { id: 'bucket', name: 'Fill With Color', hint: 'Fills an area with the current drawing color.' },
  { id: 'picker', name: 'Pick Color', hint: 'Picks up a color from the picture for drawing.' },
  { id: 'magnifier', name: 'Magnifier', hint: 'Changes the magnification.' },
  { id: 'pencil', name: 'Pencil', hint: 'Draws a free-form line one pixel wide.' },
  { id: 'brush', name: 'Brush', hint: 'Draws using a brush with the selected shape and size.' },
  { id: 'airbrush', name: 'Airbrush', hint: 'Draws using an airbrush of the selected spray size.' },
  { id: 'text', name: 'Text', hint: 'Inserts text into the picture.' },
  { id: 'line', name: 'Line', hint: 'Draws a straight line with the selected line width.' },
  { id: 'curve', name: 'Curve', hint: 'Draws a curved line with the selected line width.' },
  { id: 'rect', name: 'Rectangle', hint: 'Draws a rectangle with the selected fill style.' },
  { id: 'polygon', name: 'Polygon', hint: 'Draws a polygon with the selected fill style.' },
  { id: 'ellipse', name: 'Ellipse', hint: 'Draws an ellipse with the selected fill style.' },
  { id: 'rounded-rect', name: 'Rounded Rectangle', hint: 'Draws a rounded rectangle with the selected fill style.' },
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
  const { playSound } = useSound();

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTool, setActiveTool] = useState('pencil');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(1);
  const [brushSize, setBrushSize] = useState(4);
  const [eraserSize, setEraserSize] = useState(6);
  const [fillStyle, setFillStyle] = useState('outline'); // 'outline' | 'fill-outline' | 'solid'
  const [zoomLevel, setZoomLevel] = useState(1); // 1x, 2x, 6x, 8x
  const [cursorCoords, setCursorCoords] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  // Drawing state
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);
  const undoStackRef = useRef([]);

  // Polygon points
  const [polyPoints, setPolyPoints] = useState([]);

  // Text tool
  const [textInputPos, setTextInputPos] = useState(null);
  const [textVal, setTextVal] = useState('');

  // Selection move
  const selectBoxRef = useRef(null);

  // Status bar text
  const currentToolMeta = TOOLS.find((t) => t.id === activeTool);
  const toolHint = currentToolMeta?.hint || 'For Help, click Help Topics on the Help Menu.';

  // Initialize Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const initial = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current = [initial];
  }, [isOpen]);

  // Save Undo snapshot
  const saveUndo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current = [...undoStackRef.current.slice(-19), data];
  }, []);

  // Handle Undo (Ctrl+Z)
  const handleUndo = useCallback(() => {
    if (undoStackRef.current.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    undoStackRef.current.pop();
    const prev = undoStackRef.current[undoStackRef.current.length - 1];
    if (prev) {
      ctx.putImageData(prev, 0, 0);
    }
  }, []);

  // Clear Canvas
  const handleClearImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveUndo();
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPolyPoints([]);
    setTextInputPos(null);
  };

  // Export Save PNG
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'untitled.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Image File
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        saveUndo();
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, Math.min(canvas.width, img.width), Math.min(canvas.height, img.height));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Flood Fill Algorithm
  const floodFill = (startX, startY, fillHex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const startIdx = (startY * width + startX) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];
    const targetA = data[startIdx + 3];

    // Convert hex to rgb
    const fillR = parseInt(fillHex.slice(1, 3), 16);
    const fillG = parseInt(fillHex.slice(3, 5), 16);
    const fillB = parseInt(fillHex.slice(5, 7), 16);
    const fillA = 255;

    if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) return;

    saveUndo();
    const queue = [[startX, startY]];
    const seen = new Uint8Array(width * height);

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const pos = y * width + x;
      if (seen[pos]) continue;
      seen[pos] = 1;

      const idx = pos * 4;
      if (
        data[idx] === targetR &&
        data[idx + 1] === targetG &&
        data[idx + 2] === targetB &&
        data[idx + 3] === targetA
      ) {
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;

        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  // Get Canvas Mouse Coordinates
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    return {
      x: Math.max(0, Math.min(canvas.width - 1, x)),
      y: Math.max(0, Math.min(canvas.height - 1, y)),
    };
  };

  // Mouse Down handler
  const handleMouseDown = (e) => {
    if (e.target !== canvasRef.current) return;
    const isRightClick = e.button === 2;
    const drawColor = isRightClick ? bgColor : fgColor;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (activeTool === 'bucket') {
      floodFill(coords.x, coords.y, drawColor);
      return;
    }

    if (activeTool === 'picker') {
      const p = ctx.getImageData(coords.x, coords.y, 1, 1).data;
      const hex = `#${((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1).toUpperCase()}`;
      if (isRightClick) {
        setBgColor(hex);
      } else {
        setFgColor(hex);
      }
      return;
    }

    if (activeTool === 'magnifier') {
      setZoomLevel((prev) => (prev >= 6 ? 1 : prev === 1 ? 2 : 6));
      return;
    }

    if (activeTool === 'text') {
      setTextInputPos(coords);
      return;
    }

    saveUndo();
    isDrawingRef.current = true;
    startPosRef.current = coords;
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = drawColor;
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'pencil') {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'brush') {
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'eraser') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(coords.x - eraserSize / 2, coords.y - eraserSize / 2, eraserSize, eraserSize);
    } else if (activeTool === 'airbrush') {
      sprayAirbrush(coords.x, coords.y, drawColor);
    }
  };

  // Airbrush spray
  const sprayAirbrush = (cx, cy, color) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    const radius = 12;
    const density = 20;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    }
  };

  // Mouse Move handler
  const handleMouseMove = (e) => {
    const coords = getCanvasCoords(e);
    setCursorCoords(coords);

    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isRightClick = e.buttons === 2;
    const drawColor = isRightClick ? bgColor : fgColor;

    if (activeTool === 'pencil') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'brush') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'eraser') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(coords.x - eraserSize / 2, coords.y - eraserSize / 2, eraserSize, eraserSize);
    } else if (activeTool === 'airbrush') {
      sprayAirbrush(coords.x, coords.y, drawColor);
    } else if (['line', 'rect', 'ellipse', 'rounded-rect'].includes(activeTool)) {
      // Restore snapshot then preview shape
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      ctx.strokeStyle = drawColor;
      ctx.fillStyle = isRightClick ? fgColor : bgColor;
      ctx.lineWidth = lineWidth;

      const sx = startPosRef.current.x;
      const sy = startPosRef.current.y;
      const w = coords.x - sx;
      const h = coords.y - sy;

      if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        if (fillStyle === 'solid') {
          ctx.fillStyle = drawColor;
          ctx.fillRect(sx, sy, w, h);
        } else if (fillStyle === 'fill-outline') {
          ctx.fillRect(sx, sy, w, h);
          ctx.strokeRect(sx, sy, w, h);
        } else {
          ctx.strokeRect(sx, sy, w, h);
        }
      } else if (activeTool === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(sx + w / 2, sy + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, 2 * Math.PI);
        if (fillStyle === 'solid') {
          ctx.fillStyle = drawColor;
          ctx.fill();
        } else if (fillStyle === 'fill-outline') {
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.stroke();
        }
      } else if (activeTool === 'rounded-rect') {
        const r = 8;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(sx, sy, w, h, r) : ctx.rect(sx, sy, w, h);
        if (fillStyle === 'solid') {
          ctx.fillStyle = drawColor;
          ctx.fill();
        } else if (fillStyle === 'fill-outline') {
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.stroke();
        }
      }
    }
  };

  // Mouse Up handler
  const handleMouseUp = () => {
    isDrawingRef.current = false;
    snapshotRef.current = null;
  };

  // Text Tool commit
  const handleCommitText = () => {
    if (!textInputPos || !textVal.trim()) {
      setTextInputPos(null);
      setTextVal('');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveUndo();
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = fgColor;
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(textVal, textInputPos.x, textInputPos.y + 12);
    setTextInputPos(null);
    setTextVal('');
  };

  // Menu bar matching MS Paint 98
  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', onClick: handleClearImage },
        {
          label: 'Open...',
          shortcut: 'Ctrl+O',
          onClick: () => {
            if (fileInputRef.current) fileInputRef.current.click();
          },
        },
        { label: 'Save', shortcut: 'Ctrl+S', onClick: handleSave },
        { label: 'Save As...', onClick: handleSave },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', onClick: handleUndo },
        { isSeparator: true },
        { label: 'Cut', shortcut: 'Ctrl+X', disabled: true },
        { label: 'Copy', shortcut: 'Ctrl+C', disabled: true },
        { label: 'Paste', shortcut: 'Ctrl+V', disabled: true },
        { label: 'Clear Selection', shortcut: 'Del', disabled: true },
        { label: 'Select All', shortcut: 'Ctrl+A', disabled: true },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Tool Box', checked: true },
        { label: 'Color Box', checked: true },
        { label: 'Status Bar', checked: true },
      ],
    },
    {
      label: 'Image',
      items: [
        { label: 'Clear Image', shortcut: 'Ctrl+Shift+N', onClick: handleClearImage },
        {
          label: 'Invert Colors',
          shortcut: 'Ctrl+I',
          onClick: () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            saveUndo();
            const ctx = canvas.getContext('2d');
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              d[i] = 255 - d[i];
              d[i + 1] = 255 - d[i + 1];
              d[i + 2] = 255 - d[i + 2];
            }
            ctx.putImageData(imgData, 0, 0);
          },
        },
      ],
    },
    {
      label: 'Colors',
      items: [
        { label: 'Edit Colors...', disabled: true },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Help Topics', disabled: true },
        { isSeparator: true },
        {
          label: 'About Paint',
          onClick: () => setShowAbout(true),
        },
      ],
    },
  ];

  return (
    <>
      <Window
        id="paint-window"
        title="untitled - Paint"
        icon={<PaintIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={isMaximized}
        zIndex={zIndex}
        position={position}
        defaultWidth={680}
        defaultHeight={500}
        minWidth={460}
        minHeight={340}
        resizable={true}
        hasMenu={true}
        menuItems={menuItems}
        hasStatusBar={true}
        statusText={`${toolHint}    ${cursorCoords ? `${cursorCoords.x}, ${cursorCoords.y}` : ''}`}
        onFocus={onFocus}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      >
        {/* Hidden File Picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Main Paint Workspace Container */}
        <div
          style={{
            alignSelf: 'stretch',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#C0C0C0',
            overflow: 'hidden',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
            fontSize: '11px',
            userSelect: 'none',
          }}
        >
          {/* Top/Middle Area: Toolbox on left, Canvas workspace on right */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {/* Toolbox Panel (2 columns of 8 tools) */}
            <div
              id="paint-toolbox"
              style={{
                width: '56px',
                background: '#C0C0C0',
                borderRight: '1px solid #808080',
                padding: '3px 2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                alignItems: 'center',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              {/* 16 Tool Buttons in 2x8 Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 24px)',
                  gridTemplateRows: 'repeat(8, 24px)',
                  gap: '1px',
                }}
              >
                {TOOLS.map((tool) => {
                  const isSelected = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      title={tool.name}
                      style={{
                        width: '24px',
                        height: '24px',
                        padding: 0,
                        background: '#C0C0C0',
                        boxShadow: isSelected
                          ? '1px 1px 0px black inset, -1px -1px 0px white inset, 2px 2px 0px #808080 inset, -2px -2px 0px #DFDFDF inset'
                          : '1px 1px 0px white inset, -1px -1px 0px black inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Authentic 16x16 Tool Icons */}
                      {renderToolIcon(tool.id)}
                    </button>
                  );
                })}
              </div>

              {/* Tool Options Box (shows shape widths, fill styles, etc.) */}
              <div
                id="paint-tool-options"
                style={{
                  width: '48px',
                  height: '66px',
                  background: '#C0C0C0',
                  border: '1px solid #808080',
                  borderRightColor: '#FFFFFF',
                  borderBottomColor: '#FFFFFF',
                  boxShadow: '1px 1px 0px black inset',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px',
                  boxSizing: 'border-box',
                }}
              >
                {renderToolOptions(
                  activeTool,
                  lineWidth,
                  setLineWidth,
                  brushSize,
                  setBrushSize,
                  eraserSize,
                  setEraserSize,
                  fillStyle,
                  setFillStyle,
                  zoomLevel,
                  setZoomLevel
                )}
              </div>
            </div>

            {/* Canvas Scrollable Workspace */}
            <div
              style={{
                flex: 1,
                background: '#808080',
                overflow: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '4px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    background: '#FFFFFF',
                    display: 'block',
                    cursor: getToolCursor(activeTool),
                  }}
                />

                {/* Text Tool Floating Input */}
                {textInputPos && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${textInputPos.x}px`,
                      top: `${textInputPos.y}px`,
                      zIndex: 10,
                    }}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={textVal}
                      onChange={(e) => setTextVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommitText();
                        if (e.key === 'Escape') setTextInputPos(null);
                      }}
                      onBlur={handleCommitText}
                      style={{
                        border: '1px dotted #000',
                        outline: 'none',
                        background: 'transparent',
                        color: fgColor,
                        font: '14px Arial, sans-serif',
                        padding: '1px 2px',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Color Box: 28 colors in 2 rows of 14 + Foreground/Background Swatches */}
          <div
            id="paint-colorbox"
            style={{
              height: '46px',
              background: '#C0C0C0',
              borderTop: '1px solid #808080',
              boxShadow: '0 1px 0 0 white inset',
              display: 'flex',
              alignItems: 'center',
              padding: '3px 6px',
              gap: '8px',
              boxSizing: 'border-box',
            }}
          >
            {/* Active Color Preview (Foreground on top-left, Background on bottom-right) */}
            <div
              style={{
                width: '32px',
                height: '32px',
                position: 'relative',
                background: '#C0C0C0',
                border: '1px solid #808080',
                borderRightColor: '#FFFFFF',
                borderBottomColor: '#FFFFFF',
                boxShadow: '1px 1px 0px black inset',
                boxSizing: 'border-box',
              }}
              title="Foreground & Background Color"
            >
              {/* Background swatch (bottom-right) */}
              <div
                style={{
                  position: 'absolute',
                  right: '3px',
                  bottom: '3px',
                  width: '14px',
                  height: '14px',
                  background: bgColor,
                  border: '1px solid #808080',
                  boxShadow: '1px 1px 0px white inset',
                }}
              />
              {/* Foreground swatch (top-left) */}
              <div
                style={{
                  position: 'absolute',
                  left: '3px',
                  top: '3px',
                  width: '14px',
                  height: '14px',
                  background: fgColor,
                  border: '1px solid #808080',
                  boxShadow: '1px 1px 0px white inset',
                  zIndex: 2,
                }}
              />
            </div>

            {/* 28 Swatches in 2 Rows of 14 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(14, 16px)',
                gridTemplateRows: 'repeat(2, 16px)',
                gap: '1px',
              }}
            >
              {PAINT_PALETTE.map((hex, i) => (
                <div
                  key={`${hex}-${i}`}
                  onClick={() => setFgColor(hex)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setBgColor(hex);
                  }}
                  title={`Color: ${hex} (Left click: Foreground, Right click: Background)`}
                  style={{
                    width: '16px',
                    height: '16px',
                    background: hex,
                    border: '1px solid #808080',
                    borderRightColor: '#FFFFFF',
                    borderBottomColor: '#FFFFFF',
                    boxShadow: '1px 1px 0px black inset',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Window>

      {/* About Dialog */}
      <AboutAppDialog
        isOpen={showAbout}
        appName="Paint"
        version="Version 4.10 (Windows 98)"
        icon={<PaintIconSmall />}
        description="Every pixel placed with regret."
        onClose={() => setShowAbout(false)}
      />
    </>
  );
}

// Cursor styling per tool
function getToolCursor(tool) {
  switch (tool) {
    case 'pencil':
    case 'line':
    case 'curve':
    case 'rect':
    case 'ellipse':
    case 'rounded-rect':
    case 'polygon':
      return 'crosshair';
    case 'brush':
    case 'airbrush':
      return 'crosshair';
    case 'eraser':
      return 'cell';
    case 'bucket':
      return 'crosshair';
    case 'picker':
      return 'crosshair';
    case 'text':
      return 'text';
    case 'magnifier':
      return 'zoom-in';
    default:
      return 'default';
  }
}

// Render Authentic 16x16 Tool Icons
function renderToolIcon(toolId) {
  switch (toolId) {
    case 'free-select':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 2C2 4 2 8 3 11C4 14 8 15 11 13C14 11 15 7 13 4C11 1 6 0 4 2Z" stroke="#000" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'select':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" stroke="#000" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'eraser':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5 12L2 9L8 3L11 6L5 12Z" fill="#FFF" stroke="#000" />
          <path d="M11 6L14 9L8 15L5 12L11 6Z" fill="#FFC0CB" stroke="#000" />
        </svg>
      );
    case 'bucket':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 8L8 4L13 9L9 13L4 8Z" fill="#C0C0C0" stroke="#000" />
          <path d="M9 13C9 13 12 15 14 15C15 15 15 14 14 13L12 11" stroke="#00F" strokeWidth="1.5" />
        </svg>
      );
    case 'picker':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 2C14 3 14 4 13 5L10 8L7 5L10 2C11 1 12 1 13 2Z" fill="#000" />
          <path d="M7 5L3 9L2 14L7 13L10 8L7 5Z" fill="#FFF" stroke="#000" />
        </svg>
      );
    case 'magnifier':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="6" r="4" stroke="#000" strokeWidth="1.5" />
          <line x1="9" y1="9" x2="14" y2="14" stroke="#000" strokeWidth="2" />
        </svg>
      );
    case 'pencil':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 2L14 3L5 12L2 14L4 11L13 2Z" fill="#FFD700" stroke="#000" />
          <path d="M2 14L4 13L3 12L2 14Z" fill="#000" />
        </svg>
      );
    case 'brush':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 2L14 4L9 9L7 7L12 2Z" fill="#8B4513" />
          <path d="M7 7L4 10C2 12 2 14 3 14C4 14 6 14 8 12L9 9L7 7Z" fill="#000" />
        </svg>
      );
    case 'airbrush':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="7" y="5" width="6" height="9" fill="#008080" stroke="#000" />
          <rect x="9" y="3" width="2" height="2" fill="#808080" />
          <circle cx="4" cy="3" r="1" fill="#000" />
          <circle cx="2" cy="5" r="1" fill="#000" />
          <circle cx="5" cy="6" r="1" fill="#000" />
        </svg>
      );
    case 'text':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 13L7 3H9L13 13H11L10 10H6L5 13H3ZM7 7H9L8 4L7 7Z" fill="#000" />
        </svg>
      );
    case 'line':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="14" x2="14" y2="2" stroke="#000" strokeWidth="1.5" />
        </svg>
      );
    case 'curve':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 13C6 13 8 3 14 3" stroke="#000" strokeWidth="1.5" />
        </svg>
      );
    case 'rect':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" stroke="#000" strokeWidth="1.5" />
        </svg>
      );
    case 'polygon':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <polygon points="8,2 14,6 12,13 4,13 2,6" stroke="#000" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'ellipse':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <ellipse cx="8" cy="8" rx="6" ry="4.5" stroke="#000" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'rounded-rect':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" rx="3" stroke="#000" strokeWidth="1.5" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

// Render Options Panel per Active Tool (icons, not text labels!)
function renderToolOptions(
  tool,
  lineWidth,
  setLineWidth,
  brushSize,
  setBrushSize,
  eraserSize,
  setEraserSize,
  fillStyle,
  setFillStyle,
  zoomLevel,
  setZoomLevel
) {
  // Line & Curve widths: 5 horizontal lines
  if (tool === 'line' || tool === 'curve') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((w) => (
          <div
            key={w}
            onClick={() => setLineWidth(w)}
            style={{
              width: '36px',
              height: '8px',
              background: lineWidth === w ? '#000080' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: '28px', height: `${w}px`, background: lineWidth === w ? '#FFF' : '#000' }} />
          </div>
        ))}
      </div>
    );
  }

  // Shapes fill styles: 3 icons (Outline only, Fill with outline, Solid fill)
  if (['rect', 'polygon', 'ellipse', 'rounded-rect'].includes(tool)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%', alignItems: 'center' }}>
        {[
          { id: 'outline', title: 'Outline Only' },
          { id: 'fill-outline', title: 'Outline and Fill' },
          { id: 'solid', title: 'Solid Fill' },
        ].map((item) => (
          <div
            key={item.id}
            onClick={() => setFillStyle(item.id)}
            title={item.title}
            style={{
              width: '36px',
              height: '18px',
              background: fillStyle === item.id ? '#000080' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="12" viewBox="0 0 24 12">
              {item.id === 'outline' && (
                <rect x="2" y="1" width="20" height="10" stroke={fillStyle === item.id ? '#FFF' : '#000'} strokeWidth="1.5" fill="none" />
              )}
              {item.id === 'fill-outline' && (
                <rect x="2" y="1" width="20" height="10" stroke={fillStyle === item.id ? '#FFF' : '#000'} strokeWidth="1.5" fill="#C0C0C0" />
              )}
              {item.id === 'solid' && (
                <rect x="2" y="1" width="20" height="10" fill={fillStyle === item.id ? '#FFF' : '#000'} />
              )}
            </svg>
          </div>
        ))}
      </div>
    );
  }

  // Eraser sizes: 4 square icons
  if (tool === 'eraser') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 18px)', gap: '4px', justifyItems: 'center', alignItems: 'center' }}>
        {[4, 6, 8, 12].map((s) => (
          <div
            key={s}
            onClick={() => setEraserSize(s)}
            style={{
              width: '18px',
              height: '18px',
              background: eraserSize === s ? '#000080' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: `${s}px`, height: `${s}px`, background: eraserSize === s ? '#FFF' : '#000' }} />
          </div>
        ))}
      </div>
    );
  }

  // Brush shapes & sizes
  if (tool === 'brush') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 14px)', gap: '2px', justifyItems: 'center', alignItems: 'center' }}>
        {[2, 4, 7].map((s) => (
          <div
            key={s}
            onClick={() => setBrushSize(s)}
            style={{
              width: '14px',
              height: '14px',
              background: brushSize === s ? '#000080' : 'transparent',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: `${s}px`, height: `${s}px`, borderRadius: '50%', background: brushSize === s ? '#FFF' : '#000' }} />
          </div>
        ))}
      </div>
    );
  }

  // Magnifier zoom levels (1x, 2x, 6x, 8x)
  if (tool === 'magnifier') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', alignItems: 'center' }}>
        {[1, 2, 6, 8].map((z) => (
          <div
            key={z}
            onClick={() => setZoomLevel(z)}
            style={{
              width: '36px',
              height: '13px',
              background: zoomLevel === z ? '#000080' : 'transparent',
              color: zoomLevel === z ? '#FFF' : '#000',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            {z}x
          </div>
        ))}
      </div>
    );
  }

  // Default empty placeholder
  return (
    <div style={{ color: '#808080', fontSize: '9px', textAlign: 'center' }}>
      Paint 98
    </div>
  );
}
