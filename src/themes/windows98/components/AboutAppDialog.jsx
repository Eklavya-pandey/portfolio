import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';
import { useSound } from '../../../context/SoundContext';

export default function AboutAppDialog({
  isOpen = false,
  appName = 'Application',
  version = 'Version 4.10.1998 (Windows 98)',
  icon = null,
  description = '',
  onClose,
}) {
  const { playSound } = useSound();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.stopPropagation();
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    playSound('chord');
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
    >
      <div
        className="win95-window win-dialog"
        style={{
          width: '380px',
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
        {/* Titlebar */}
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
            <span>About {appName}</span>
          </div>

          <button
            aria-label="Close"
            onClick={handleClose}
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
            gap: '12px',
          }}
        >
          {/* Top Info Row */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            {/* App Icon */}
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
              {icon}
            </div>

            {/* App info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                flex: 1,
              }}
            >
              <div style={{ color: '#000000', fontSize: '12px', fontWeight: 700 }}>
                {appName}
              </div>
              <div style={{ color: '#404040', fontSize: '11px' }}>
                {version}
              </div>
              <div style={{ color: '#404040', fontSize: '10px' }}>
                Naveen Portfolio Edition
              </div>
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

          {/* Funny Line Quote */}
          {description && (
            <div
              style={{
                color: '#000000',
                fontSize: '11px',
                lineHeight: '16px',
                fontStyle: 'italic',
                padding: '2px 4px',
              }}
            >
              &quot;{description}&quot;
            </div>
          )}

          {/* Etched Divider */}
          <div
            style={{
              height: '2px',
              borderTop: '1px solid #808080',
              borderBottom: '1px solid #FFFFFF',
            }}
          />

          {/* OK Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={handleClose}
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
          </div>
        </div>
      </div>
    </div>
  );
}
