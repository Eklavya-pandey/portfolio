import React, { useState } from 'react';
import { MinimizeIcon, MaximizeIcon, RestoreIcon, CloseIcon } from './Icons';

export default function WindowControls({
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
  showMinimize = true,
  showMaximize = true,
  showClose = true,
}) {
  const [pressedBtn, setPressedBtn] = useState(null);

  const defaultBtnShadow =
    '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset';
  const pressedBtnShadow =
    '1px 1px 0px #000000 inset, -1px -1px 0px #FFFFFF inset, 2px 2px 0px #808080 inset, -2px -2px 0px #DFDFDF inset';

  const getStyle = (type) => ({
    width: '16px',
    height: '16px',
    padding: '4px',
    background: '#C0C0C0',
    boxShadow: pressedBtn === type ? pressedBtnShadow : defaultBtnShadow,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer',
    boxSizing: 'border-box',
    border: 'none',
    outline: 'none',
  });

  return (
    <div
      className="WindowButtons"
      style={{ justifyContent: 'center', alignItems: 'center', gap: '2px', display: 'flex' }}
    >
      {showMinimize && (
        <div
          className="ButtonWindowButton win-btn-minimize"
          style={getStyle('min')}
          onMouseDown={() => setPressedBtn('min')}
          onMouseUp={() => setPressedBtn(null)}
          onMouseLeave={() => setPressedBtn(null)}
          onTouchStart={() => setPressedBtn('min')}
          onTouchEnd={() => setPressedBtn(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMinimize) onMinimize();
          }}
          title="Minimize"
        >
          <div className="UtillityIcons" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MinimizeIcon />
          </div>
        </div>
      )}

      {showMaximize && (
        <div
          className="ButtonWindowButton win-btn-maximize"
          style={getStyle('max')}
          onMouseDown={() => setPressedBtn('max')}
          onMouseUp={() => setPressedBtn(null)}
          onMouseLeave={() => setPressedBtn(null)}
          onTouchStart={() => setPressedBtn('max')}
          onTouchEnd={() => setPressedBtn(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMaximize) onMaximize();
          }}
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          <div className="UtillityIcons" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          </div>
        </div>
      )}

      {showClose && (
        <div
          className="ButtonWindowButton win-btn-close"
          style={getStyle('close')}
          onMouseDown={() => setPressedBtn('close')}
          onMouseUp={() => setPressedBtn(null)}
          onMouseLeave={() => setPressedBtn(null)}
          onTouchStart={() => setPressedBtn('close')}
          onTouchEnd={() => setPressedBtn(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
          title="Close"
        >
          <div className="UtillityIcons" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CloseIcon />
          </div>
        </div>
      )}
    </div>
  );
}
