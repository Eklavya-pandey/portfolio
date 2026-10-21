import React from 'react';
import WindowControls from './WindowControls';
import { FolderIconSmall } from './Icons';

export default function TitleBar({
  title = 'Window',
  icon,
  isActive = true,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
  showControls = true,
  showMinimize = true,
  showMaximize = true,
  showClose = true,
  onMouseDown,
  onTouchStart,
  id,
}) {
  const IconComponent = icon || <FolderIconSmall />;

  return (
    <div
      id={id}
      className={`Titlebar ${isActive ? '' : 'inactive'}`}
      style={{
        alignSelf: 'stretch',
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingLeft: '4px',
        paddingRight: '2px',
        background: isActive
          ? 'linear-gradient(90deg, #000080 0%, #1084D0 100%)'
          : 'linear-gradient(90deg, #808080 0%, #B5B5B5 100%)',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        userSelect: 'none',
        cursor: 'default',
        boxSizing: 'border-box',
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div
        className="Label"
        style={{
          height: '16px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '4px',
          display: 'flex',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <div style={{ position: 'relative', width: '16px', height: '16px', flexShrink: 0 }}>
          {IconComponent}
        </div>
        <div
          className="Text"
          style={{
            color: 'white',
            fontSize: '12px',
            fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
            fontWeight: 700,
            lineHeight: '13px',
            letterSpacing: '0.24px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
      </div>

      {showControls && (
        <WindowControls
          isMaximized={isMaximized}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
          showMinimize={showMinimize}
          showMaximize={showMaximize}
          showClose={showClose}
        />
      )}
    </div>
  );
}
