import React, { useState } from 'react';
import { CloseIcon, CheckboxCheck } from './Icons';
import { useSound } from '../../../context/SoundContext';

export default function WelcomeDialog({
  isOpen = false,
  onClose,
}) {
  const [showNextTime, setShowNextTime] = useState(true);
  const { playSound } = useSound();

  if (!isOpen) return null;

  const handleClose = (playChord = false) => {
    if (playChord) {
      playSound('chord');
    }
    if (onClose) {
      onClose(showNextTime);
    }
  };

  return (
    <div
      id="welcome-dialog-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        // Prevent accidental clicks through to desktop
        e.stopPropagation();
      }}
    >
      <div
        id="welcome-dialog"
        className="win95-window win-dialog"
        style={{
          width: '460px',
          maxWidth: '92vw',
          background: '#C0C0C0',
          boxShadow: '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
          padding: '3px',
          boxSizing: 'border-box',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          fontSize: '11px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div
          className="Titlebar"
          style={{
            alignSelf: 'stretch',
            paddingTop: '2px',
            paddingBottom: '2px',
            paddingLeft: '4px',
            paddingRight: '2px',
            background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            cursor: 'default',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'white',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            <span>Welcome</span>
          </div>

          <button
            aria-label="Close"
            onClick={() => handleClose(false)}
            style={{
              width: '16px',
              height: '14px',
              background: '#C0C0C0',
              boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            padding: '16px 14px 12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Main Info Row */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            {/* Win98 Lightbulb / Tips Icon */}
            <div
              style={{
                width: '32px',
                height: '32px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ shapeRendering: 'crispEdges' }}>
                <circle cx="16" cy="14" r="10" fill="#FFFF00" stroke="#000000" strokeWidth="1.5" />
                <path d="M11 20H21V23H11V20Z" fill="#C0C0C0" stroke="#000000" strokeWidth="1" />
                <path d="M13 24H19V26H13V24Z" fill="#808080" stroke="#000000" strokeWidth="1" />
                <line x1="16" y1="2" x2="16" y2="0" stroke="#000000" strokeWidth="2" />
                <line x1="5" y1="6" x2="3" y2="4" stroke="#000000" strokeWidth="2" />
                <line x1="27" y1="6" x2="29" y2="4" stroke="#000000" strokeWidth="2" />
                <circle cx="13" cy="12" r="1.5" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Body Text */}
            <div
              style={{
                color: '#000000',
                fontSize: '11px',
                lineHeight: '16px',
                fontWeight: 400,
              }}
            >
              Welcome to Naveen&apos;s PC. Tip: open Me.exe first. Everything else is optional, but so is hiring me.
            </div>
          </div>

          {/* Etched Divider */}
          <div
            style={{
              height: '2px',
              borderTop: '1px solid #808080',
              borderBottom: '1px solid #FFFFFF',
            }}
          />

          {/* Checkbox */}
          <div
            onClick={() => setShowNextTime(!showNextTime)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
              paddingLeft: '2px',
            }}
          >
            <div
              style={{
                width: '13px',
                height: '13px',
                background: '#FFFFFF',
                boxShadow: '1px 1px 0px #808080 inset, -1px -1px 0px white inset, 2px 2px 0px black inset, -2px -2px 0px #dfdfdf inset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              {showNextTime && <CheckboxCheck />}
            </div>
            <span
              style={{
                color: '#000000',
                fontSize: '11px',
              }}
            >
              Show this Welcome Screen next time you start Windows
            </span>
          </div>

          {/* Buttons Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              paddingTop: '4px',
            }}
          >
            {/* OK Button - Default button with dotted focus */}
            <button
              id="welcome-btn-ok"
              onClick={() => handleClose(true)}
              style={{
                width: '75px',
                height: '23px',
                background: '#C0C0C0',
                boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                border: '1px solid #000000',
                outline: '1px dotted #000000',
                outlineOffset: '-4px',
                fontSize: '11px',
                fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              OK
            </button>

            {/* Close Button */}
            <button
              id="welcome-btn-close"
              onClick={() => handleClose(false)}
              style={{
                width: '75px',
                height: '23px',
                background: '#C0C0C0',
                boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                border: 'none',
                fontSize: '11px',
                fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
