import React, { useState, useEffect, useRef } from 'react';

export default function DesktopIcon({
  id,
  label,
  icon,
  position = { x: 24, y: 24 },
  isSelected = false,
  isRenaming = false,
  onClick,
  onDoubleClick,
  onPositionChange,
  onContextMenu,
  onRenameCommit,
  onRenameCancel,
}) {
  const [editValue, setEditValue] = useState(label);
  const lastClickRef = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(label);
  }, [label, isRenaming]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const isTouchOrMobile = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768;
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // left click only
    if (isRenaming) return;
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = position.x;
    const origY = position.y;
    let hasMoved = false;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!hasMoved && Math.hypot(dx, dy) > 4) {
        hasMoved = true;
      }
      if (hasMoved && onPositionChange) {
        // Constrain strictly within usable desktop (taskbar is 28px)
        const nextX = Math.max(0, Math.min(window.innerWidth - 86, origX + dx));
        const nextY = Math.max(0, Math.min(window.innerHeight - 28 - 75, origY + dy));
        onPositionChange({ x: nextX, y: nextY });
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!hasMoved) {
        const now = Date.now();
        if (now - lastClickRef.current < 350) {
          if (onDoubleClick) onDoubleClick();
          lastClickRef.current = 0;
        } else {
          lastClickRef.current = now;
          if (onClick) onClick();
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenu) {
      onContextMenu(e);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      if (onRenameCommit) onRenameCommit(editValue.trim() || label);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      if (onRenameCancel) onRenameCancel();
    }
  };

  return (
    <div
      id={id}
      data-layer="Item"
      data-type="White text"
      className={`Item ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '84px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        display: 'flex',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '2px',
        boxSizing: 'border-box',
        zIndex: isSelected ? 8 : 6,
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      onTouchEnd={(e) => {
        if (isTouchOrMobile()) {
          e.stopPropagation();
          if (onClick) onClick();
          if (onDoubleClick) onDoubleClick();
        }
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '32px',
          height: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {icon}
      </div>

      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={() => {
            if (onRenameCommit) onRenameCommit(editValue.trim() || label);
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: '80px',
            background: 'white',
            color: 'black',
            fontSize: '11px',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
            border: '1px dotted black',
            textAlign: 'center',
            padding: '1px 2px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <div
          className="Label"
          style={{
            width: '84px',
            maxWidth: '84px',
            textAlign: 'center',
            color: 'white',
            fontSize: '11px',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
            fontWeight: 400,
            lineHeight: '13px',
            maxHeight: '26px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            whiteSpace: 'normal',
            hyphens: 'none',
            background: isSelected ? '#000080' : 'transparent',
            border: isSelected ? '1px dotted #FFFF00' : '1px solid transparent',
            padding: '1px 2px',
            boxSizing: 'border-box',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
