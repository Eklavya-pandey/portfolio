import React, { useState, useEffect } from 'react';
import { WinLogoIcon, SpeakerIcon } from './Icons';

export default function Taskbar({
  openWindows = [],
  isStartMenuOpen = false,
  onToggleStart,
  onWindowTabClick,
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-layer="Navbar"
      className="Navbar DesktopTaskbar"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '28px',
        background: '#C0C0C0',
        boxShadow: '0 -1px 0 0 white, 0 -2px 0 0 #DFDFDF',
        borderTop: '1px solid #FFFFFF',
        borderRadius: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '2px',
        paddingRight: '3px',
        boxSizing: 'border-box',
        zIndex: 10000,
        userSelect: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left side: Body (Start Button + Tabs) */}
      <div
        data-layer="Body"
        className="Body TaskbarLeft"
        style={{
          height: '22px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '4px',
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Button / Start */}
        <div
          data-layer="Button / Start"
          id="start-button"
          className={`ButtonStart ${isStartMenuOpen ? 'pressed' : ''}`}
          style={{
            width: '60px',
            height: '22px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '3px',
            paddingBottom: '3px',
            borderRadius: 0,
            background: '#C0C0C0',
            boxShadow: isStartMenuOpen
              ? '1px 1px 0px black inset, -1px -1px 0px white inset, 2px 2px 0px #808080 inset, -2px -2px 0px #DFDFDF inset'
              : '-2px -2px 0px #818181 inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3px',
            display: 'flex',
            cursor: 'pointer',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleStart) onToggleStart();
          }}
        >
          <div data-svg-wrapper data-layer="Icon/Small/Start" className="IconSmallStart" style={{ position: 'relative', width: '16px', height: '16px' }}>
            <WinLogoIcon />
          </div>
          <span
            style={{
              color: 'black',
              fontSize: '11px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              fontWeight: 700,
              lineHeight: '10px',
            }}
          >
            Start
          </span>
        </div>

        {/* Tabs Container */}
        <div
          data-layer="Tabs"
          className="Tabs"
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '3px',
            display: 'flex',
            flex: 1,
            overflowX: 'auto',
            height: '100%',
          }}
        >
          {openWindows.map((win) => {
            const isActive = win.isActive;
            const tabShadow = isActive
              ? '1px 1px 0px black inset, -1px -1px 0px white inset, 2px 2px 0px #808080 inset, -2px -2px 0px #DFDFDF inset'
              : '-2px -2px 0px #818181 inset, 1px 1px 0px white inset, -1px -1px 0px black inset';

            return (
              <div
                key={win.id}
                id={`tab-${win.id}`}
                data-layer="Navbar Tab"
                className={`NavbarTab ${isActive ? 'active' : ''}`}
                style={{
                  width: '120px',
                  minWidth: '60px',
                  maxWidth: '160px',
                  height: '22px',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  borderRadius: 0,
                  background: isActive ? '#DFDFDF' : '#C0C0C0',
                  boxShadow: tabShadow,
                  overflow: 'hidden',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '4px',
                  display: 'flex',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onWindowTabClick) onWindowTabClick(win.id);
                }}
                title={win.title}
              >
                <div style={{ width: '16px', height: '16px', position: 'relative', flexShrink: 0 }}>
                  {win.icon}
                </div>
                <div
                  data-layer="Text"
                  className="Text"
                  style={{
                    flex: '1 1 0',
                    height: '10px',
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                    fontWeight: isActive ? 700 : 400,
                    lineHeight: '10px',
                    wordWrap: 'break-word',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {win.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Time (System Tray) */}
      <div
        data-layer="Time"
        className="Time TaskbarRight"
        style={{
          height: '22px',
          paddingLeft: '4px',
          paddingRight: '6px',
          background: '#C0C0C0',
          boxShadow: '1px 1px 0px #808080 inset, -1px -1px 0px white inset',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '8px',
          display: 'flex',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '16px', height: '16px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpeakerIcon />
        </div>
        <div
          id="taskbar-clock"
          data-layer="clock"
          className="Clock"
          style={{
            color: 'black',
            fontSize: '11px',
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
            fontWeight: 400,
            lineHeight: '10px',
            wordWrap: 'break-word',
            whiteSpace: 'nowrap',
          }}
        >
          {timeStr || '10:36 PM'}
        </div>
      </div>
    </div>
  );
}
