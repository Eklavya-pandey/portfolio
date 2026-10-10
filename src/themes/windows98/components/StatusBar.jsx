import React from 'react';
import { DragSizeIcon } from './Icons';

export default function StatusBar({ text = '', showResizeGripper = true }) {
  return (
    <div
      className="Statusbar"
      style={{
        alignSelf: 'stretch',
        height: '18px',
        position: 'relative',
        background: '#C0C0C0',
        boxShadow: '1px 1px 0px #808080 inset, -1px -1px 0px white inset',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '4px',
        paddingRight: '2px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div
        className="ObjectS"
        style={{
          color: 'black',
          fontSize: '11px',
          fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
          fontWeight: 400,
          lineHeight: '10px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
        }}
      >
        {text}
      </div>

      {showResizeGripper && (
        <div style={{ width: '13px', height: '13px', flexShrink: 0 }}>
          <DragSizeIcon />
        </div>
      )}
    </div>
  );
}
