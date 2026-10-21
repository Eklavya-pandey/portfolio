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
  const dragRef = useRef(null);
  const windowRef = useRef(null);

  // Sync position changes from props (e.g. cascading updates)
  useEffect(() => {
    if (position && !isMaximized) {
      setPos(position);
    }
  }, [position.x, position.y]);

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
        const curW = windowRef.current ? windowRef.current.offsetWidth : defaultWidth;
        const curH = windowRef.current ? windowRef.current.offsetHeight : defaultHeight;

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
    [isMaximized, pos, onFocus, defaultWidth, defaultHeight]
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
        const curW = windowRef.current ? windowRef.current.offsetWidth : defaultWidth;
        const curH = windowRef.current ? windowRef.current.offsetHeight : defaultHeight;

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
    [isMaximized, pos, onFocus, defaultWidth, defaultHeight]
  );

  if (!isOpen) return null;

  const windowStyle = {
    position: 'absolute',
    left: isMaximized ? '0px' : `${pos.x}px`,
    top: isMaximized ? '0px' : `${pos.y}px`,
    width: isMaximized ? '100vw' : `${defaultWidth}px`,
    height: isMaximized
      ? 'calc(100vh - 28px)'
      : defaultHeight === 'auto'
      ? 'auto'
      : `${defaultHeight}px`,
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
        onMaximize={onMaximize}
        onClose={onClose}
        showMinimize={isDialog ? false : showMinimize}
        showMaximize={isDialog ? false : showMaximize}
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
    </div>
  );
}
