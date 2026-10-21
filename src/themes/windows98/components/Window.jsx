import React, { useState, useRef, useEffect, useCallback } from 'react';
import TitleBar from './TitleBar';
import MenuBar from './MenuBar';
import StatusBar from './StatusBar';

export default function Window({
  id,
  title,
  icon,
  isOpen = false,
  isActive = false,
  isMaximized = false,
  zIndex = 10,
  position = { x: 100, y: 100 },
  defaultWidth = 680,
  defaultHeight = 520,
  minWidth = 260,
  minHeight = 180,
  resizable = false,
  hasMenu = true,
  menuItems,
  hasStatusBar = false,
  statusText = '',
  showMinimize = true,
  showMaximize = true,
  showClose = true,
  isDialog = false,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  className = '',
  style = {},
  children,
}) {
  const [pos, setPos] = useState(position);
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const windowRef = useRef(null);

  // Sync position changes from props (e.g. cascading updates)
  useEffect(() => {
    if (position && !isMaximized) {
      setPos(position);
    }
  }, [position.x, position.y]);

  // Sync size with defaultWidth/defaultHeight if they change
  useEffect(() => {
    setSize({ width: defaultWidth, height: defaultHeight });
  }, [defaultWidth, defaultHeight]);

  const handleStartDrag = useCallback(
    (clientX, clientY, target) => {
      if (isMaximized) return;
      if (window.innerWidth <= 768) return; // Full bleed on mobile
      if (target.closest('.ButtonWindowButton') || target.closest('.MenuItem')) return;

      if (onFocus) onFocus();

      dragRef.current = {
        startX: clientX,
        startY: clientY,
        initialLeft: pos.x,
        initialTop: pos.y,
      };

      const handleMouseMove = (e) => {
        if (!dragRef.current) return;
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;

        const maxW = window.innerWidth;
        const maxH = window.innerHeight - 28;
        const curW = windowRef.current ? windowRef.current.offsetWidth : (typeof size.width === 'number' ? size.width : defaultWidth);
        const curH = windowRef.current ? windowRef.current.offsetHeight : (typeof size.height === 'number' ? size.height : defaultHeight);

        let nextX = dragRef.current.initialLeft + deltaX;
        let nextY = dragRef.current.initialTop + deltaY;

        nextX = Math.max(0, Math.min(nextX, Math.max(0, maxW - curW)));
        nextY = Math.max(0, Math.min(nextY, Math.max(0, maxH - curH)));

        setPos({ x: nextX, y: nextY });
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [isMaximized, pos, onFocus, size, defaultWidth, defaultHeight]
  );

  const handleTouchStart = useCallback(
    (e) => {
      if (isMaximized) return;
      if (window.innerWidth <= 768) return;
      if (!e.touches || !e.touches[0]) return;
      const touch = e.touches[0];
      if (e.target.closest('.ButtonWindowButton') || e.target.closest('.MenuItem')) return;

      if (onFocus) onFocus();

      dragRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        initialLeft: pos.x,
        initialTop: pos.y,
      };

      const handleTouchMove = (moveEv) => {
        if (!dragRef.current || !moveEv.touches || !moveEv.touches[0]) return;
        moveEv.preventDefault();
        const t = moveEv.touches[0];
        const deltaX = t.clientX - dragRef.current.startX;
        const deltaY = t.clientY - dragRef.current.startY;

        const maxW = window.innerWidth;
        const maxH = window.innerHeight - 28;
        const curW = windowRef.current ? windowRef.current.offsetWidth : (typeof size.width === 'number' ? size.width : defaultWidth);
        const curH = windowRef.current ? windowRef.current.offsetHeight : (typeof size.height === 'number' ? size.height : defaultHeight);

        let nextX = dragRef.current.initialLeft + deltaX;
        let nextY = dragRef.current.initialTop + deltaY;

        nextX = Math.max(0, Math.min(nextX, Math.max(0, maxW - curW)));
        nextY = Math.max(0, Math.min(nextY, Math.max(0, maxH - curH)));

        setPos({ x: nextX, y: nextY });
      };

      const handleTouchEnd = () => {
        dragRef.current = null;
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };

      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    },
    [isMaximized, pos, onFocus, size, defaultWidth, defaultHeight]
  );

  // Resize Drag Handling
  const handleStartResize = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!resizable || isMaximized) return;
      if (onFocus) onFocus();

      const startX = e.clientX;
      const startY = e.clientY;
      const curW = windowRef.current ? windowRef.current.offsetWidth : (typeof size.width === 'number' ? size.width : defaultWidth);
      const curH = windowRef.current ? windowRef.current.offsetHeight : (typeof size.height === 'number' ? size.height : defaultHeight);

      resizeRef.current = {
        startX,
        startY,
        initialW: curW,
        initialH: curH,
      };

      const onMouseMove = (moveEv) => {
        if (!resizeRef.current) return;
        const dx = moveEv.clientX - resizeRef.current.startX;
        const dy = moveEv.clientY - resizeRef.current.startY;

        const maxW = window.innerWidth - pos.x - 4;
        const maxH = window.innerHeight - 28 - pos.y - 4;

        const nextW = Math.max(minWidth, Math.min(maxW, resizeRef.current.initialW + dx));
        const nextH = Math.max(minHeight, Math.min(maxH, resizeRef.current.initialH + dy));

        setSize({ width: nextW, height: nextH });
      };

      const onMouseUp = () => {
        resizeRef.current = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [resizable, isMaximized, onFocus, pos, size, minWidth, minHeight, defaultWidth, defaultHeight]
  );

  const handleTouchResize = useCallback(
    (e) => {
      e.stopPropagation();
      if (!resizable || isMaximized || !e.touches || !e.touches[0]) return;
      if (onFocus) onFocus();

      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;
      const curW = windowRef.current ? windowRef.current.offsetWidth : (typeof size.width === 'number' ? size.width : defaultWidth);
      const curH = windowRef.current ? windowRef.current.offsetHeight : (typeof size.height === 'number' ? size.height : defaultHeight);

      resizeRef.current = {
        startX,
        startY,
        initialW: curW,
        initialH: curH,
      };

      const onTouchMove = (moveEv) => {
        if (!resizeRef.current || !moveEv.touches || !moveEv.touches[0]) return;
        const t = moveEv.touches[0];
        const dx = t.clientX - resizeRef.current.startX;
        const dy = t.clientY - resizeRef.current.startY;

        const maxW = window.innerWidth - pos.x - 4;
        const maxH = window.innerHeight - 28 - pos.y - 4;

        const nextW = Math.max(minWidth, Math.min(maxW, resizeRef.current.initialW + dx));
        const nextH = Math.max(minHeight, Math.min(maxH, resizeRef.current.initialH + dy));

        setSize({ width: nextW, height: nextH });
      };

      const onTouchEnd = () => {
        resizeRef.current = null;
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      };

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    },
    [resizable, isMaximized, onFocus, pos, size, minWidth, minHeight, defaultWidth, defaultHeight]
  );

  if (!isOpen) return null;

  const currentW = isMaximized
    ? '100vw'
    : typeof size.width === 'number'
    ? `${size.width}px`
    : size.width;

  const currentH = isMaximized
    ? 'calc(100vh - 28px)'
    : size.height === 'auto'
    ? 'auto'
    : typeof size.height === 'number'
    ? `${size.height}px`
    : size.height;

  const windowStyle = {
    position: 'absolute',
    left: isMaximized ? '0px' : `${pos.x}px`,
    top: isMaximized ? '0px' : `${pos.y}px`,
    width: currentW,
    height: currentH,
    maxHeight: 'calc(100vh - 36px)',
    padding: '3px',
    background: '#C0C0C0',
    boxShadow:
      '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '2px',
    display: 'flex',
    zIndex,
    boxSizing: 'border-box',
    overflow: 'hidden',
    ...style,
  };

  const allowMaximize = resizable && !isDialog;

  return (
    <div
      ref={windowRef}
      id={id}
      className={`win95-window ${isMaximized ? 'maximized' : ''} ${isActive ? 'active-win' : ''} ${isDialog ? 'win-dialog' : ''} ${className}`}
      style={windowStyle}
      onMouseDown={() => {
        if (onFocus) onFocus();
      }}
      onTouchStart={() => {
        if (onFocus) onFocus();
      }}
    >
      <TitleBar
        title={title}
        icon={icon}
        isActive={isActive}
        isMaximized={isMaximized}
        onMinimize={onMinimize}
        onMaximize={allowMaximize ? onMaximize : null}
        onClose={onClose}
        showMinimize={isDialog ? false : showMinimize}
        showMaximize={isDialog ? false : showMaximize}
        allowMaximize={allowMaximize}
        showClose={showClose}
        onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY, e.target)}
        onTouchStart={handleTouchStart}
      />

      {hasMenu && <MenuBar items={menuItems} />}

      <div
        className="WindowContentArea"
        style={{
          alignSelf: 'stretch',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>

      {hasStatusBar && <StatusBar text={statusText} />}

      {/* Resize Grip for resizable windows */}
      {resizable && !isMaximized && (
        <div
          className="win98-resize-grip"
          onMouseDown={handleStartResize}
          onTouchStart={handleTouchResize}
          style={{
            position: 'absolute',
            right: '1px',
            bottom: '1px',
            width: '16px',
            height: '16px',
            cursor: 'se-resize',
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '2px',
            boxSizing: 'border-box',
          }}
          title="Resize"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ pointerEvents: 'none', shapeRendering: 'crispEdges' }}>
            <line x1="10" y1="2" x2="2" y2="10" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="9" y1="2" x2="2" y2="9" stroke="#808080" strokeWidth="1" />
            <line x1="10" y1="6" x2="6" y2="10" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="9" y1="6" x2="6" y2="9" stroke="#808080" strokeWidth="1" />
            <line x1="10" y1="10" x2="10" y2="10" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="9" y1="10" x2="10" y2="9" stroke="#808080" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
}
