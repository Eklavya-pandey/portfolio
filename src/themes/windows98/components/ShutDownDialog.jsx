import React, { useState } from 'react';
import TitleBar from './TitleBar';
import Button from './Button';
import { useSound } from '../../../context/SoundContext';
import { useTheme, THEMES } from '../../../context/ThemeContext';

export default function ShutDownDialog({ isOpen, onClose, onRestartBios }) {
  const [selectedRadio, setSelectedRadio] = useState('stay');
  const { playSound } = useSound();
  const { setTheme } = useTheme();

  if (!isOpen) return null;

  const handleRadioClick = (id) => {
    setSelectedRadio(id);
    playSound('ding');
  };

  const handleHelp = () => {
    playSound('notify');
    alert(
      "Why would you want to leave? There's so much more to explore!\n\nTip: You can switch to the Futuristic or Figma themes right from this Shut Down dialog!"
    );
  };

  const handleOk = () => {
    onClose();

    if (selectedRadio === 'stay') {
      playSound('chord');
    } else if (selectedRadio === 'meridian') {
      playSound('logoff');
      setTimeout(() => {
        setTheme(THEMES.MERIDIAN);
      }, 700);
    } else if (selectedRadio === 'editorial') {
      playSound('logoff');
      setTimeout(() => {
        setTheme(THEMES.EDITORIAL);
      }, 700);
    } else if (selectedRadio === 'designfile') {
      playSound('logoff');
      setTimeout(() => {
        setTheme(THEMES.DESIGNFILE);
      }, 700);
    } else if (selectedRadio === 'gaming') {
      playSound('logoff');
      setTimeout(() => {
        setTheme(THEMES.GAMING);
      }, 700);
    } else if (selectedRadio === 'bios') {
      playSound('logoff');
      setTimeout(() => {
        if (onRestartBios) onRestartBios();
      }, 1000);
    } else {
      playSound('chord');
    }
  };

  return (
    <div
      id="shutdown-dialog"
      className="ShutDownDialog"
      style={{
        width: '380px',
        height: 'auto',
        minHeight: '260px',
        padding: '4px',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#C0C0C0',
        boxShadow: '-1px -1px 0px 1px white, 2px 2px 0px rgba(0, 0, 0, 0.50)',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'inline-flex',
        zIndex: 10001,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <TitleBar
        title="Shut Down Windows"
        isActive={true}
        showControls={true}
        showMinimize={false}
        showMaximize={false}
        showClose={true}
        onClose={onClose}
      />

      <div
        style={{
          alignSelf: 'stretch',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
            color: 'black',
          }}
        >
          What would you like the computer to do?
        </div>

        {/* Radio options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
          {[
            { id: 'stay', label: 'Stay here a little longer (Recommended)' },
            { id: 'meridian', label: 'Switch to Meridian Theme (Cinematic 3D Scroll)' },
            { id: 'editorial', label: 'Switch to Futuristic Theme' },
            { id: 'designfile', label: 'Open NAVEEN_PORTFOLIO.fig (Figma Theme)' },
            { id: 'gaming', label: 'Switch to Gaming Theme (Retro Arcade)' },
            { id: 'bios', label: 'Restart system (Re-experience BIOS)' },
          ].map((opt) => (
            <label
              key={opt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                color: 'black',
              }}
              onClick={() => handleRadioClick(opt.id)}
            >
              <input
                id={`radio-${opt.id}`}
                type="radio"
                name="shutdown-option"
                checked={selectedRadio === opt.id}
                onChange={() => handleRadioClick(opt.id)}
                style={{ cursor: 'pointer' }}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Buttons row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
          }}
        >
          <Button id="btn-shutdown-ok" preferred={true} onClick={handleOk}>
            OK
          </Button>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleHelp}>
            Help
          </Button>
        </div>
      </div>
    </div>
  );
}
