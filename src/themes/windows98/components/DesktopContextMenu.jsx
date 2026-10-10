import React, { useEffect, useRef } from 'react';

export default function DesktopContextMenu({
  isOpen,
  x,
  y,
  icon,
  onOpen,
  onRename,
  onDelete,
  onProperties,
  onClose,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !icon) return null;

  // Clamp within viewport
  const menuWidth = 140;
  const menuHeight = 120;
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 4);
  const clampedY = Math.min(y, window.innerHeight - 28 - menuHeight - 4);

  return (
    <div
      ref={menuRef}
      id="desktop-context-menu"
      className="DesktopContextMenu"
      style={{
        left: `${Math.max(4, clampedX)}px`,
        top: `${Math.max(4, clampedY)}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        id="context-menu-open"
        className="context-item"
        style={{ fontWeight: 700 }}
        onClick={() => {
          if (onOpen) onOpen(icon);
          if (onClose) onClose();
        }}
      >
        Open
      </div>

      <div className="context-separator" />

      <div
        id="context-menu-delete"
        className="context-item"
        onClick={() => {
          if (onDelete) onDelete(icon);
          if (onClose) onClose();
        }}
      >
        Delete
      </div>

      <div
        id="context-menu-rename"
        className="context-item"
        onClick={() => {
          if (onRename) onRename(icon);
          if (onClose) onClose();
        }}
      >
        Rename
      </div>

      <div className="context-separator" />

      <div
        id="context-menu-properties"
        className="context-item"
        onClick={() => {
          if (onProperties) onProperties(icon);
          if (onClose) onClose();
        }}
      >
        Properties
      </div>
    </div>
  );
}
