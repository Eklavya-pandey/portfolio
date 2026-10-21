import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../../context/SoundContext';

export default function MenuBar({ items = ['File', 'Edit', 'View', 'Help'] }) {
  const { playSound } = useSound();
  const [activeMenuIdx, setActiveMenuIdx] = useState(null);
  const menuBarRef = useRef(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    if (activeMenuIdx === null) return;

    const handleOutsideClick = (e) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setActiveMenuIdx(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveMenuIdx(null);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMenuIdx]);

  const handleMenuClick = (item, idx) => {
    const label = typeof item === 'string' ? item : (item?.label || '');
    const subItems = typeof item === 'object' && Array.isArray(item.items) ? item.items : null;

    if (subItems && subItems.length > 0) {
      setActiveMenuIdx((prev) => (prev === idx ? null : idx));
      playSound('ding');
    } else {
      setActiveMenuIdx(null);
      if (label.toLowerCase() === 'help') {
        playSound('notify');
      } else {
        playSound('ding');
      }
      if (typeof item === 'object' && typeof item.onClick === 'function') {
        item.onClick();
      }
    }
  };

  const handleSubItemClick = (subItem) => {
    setActiveMenuIdx(null);
    playSound('ding');
    if (subItem && typeof subItem.onClick === 'function') {
      subItem.onClick();
    }
  };

  return (
    <div
      ref={menuBarRef}
      className="WindowMenu"
      style={{
        alignSelf: 'stretch',
        height: '20px',
        position: 'relative',
        background: '#BFBFBF',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '2px',
        userSelect: 'none',
        borderBottom: '1px solid #808080',
        boxShadow: '0 1px 0 0 #FFFFFF',
        boxSizing: 'border-box',
        zIndex: 50,
      }}
    >
      {(items || []).map((item, idx) => {
        const label = typeof item === 'string' ? item : (item?.label || '');
        const subItems = typeof item === 'object' && Array.isArray(item.items) ? item.items : null;
        const firstLetter = label.charAt(0);
        const rest = label.slice(1);
        const isOpen = activeMenuIdx === idx;

        return (
          <div
            key={`menu-${idx}-${label}`}
            style={{ position: 'relative' }}
          >
            <div
              className={`MenuItem ${isOpen ? 'is-active' : ''}`}
              role="menuitem"
              tabIndex={0}
              style={{
                paddingLeft: '6px',
                paddingRight: '6px',
                height: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: isOpen ? '#FFFFFF' : '#000000',
                background: isOpen ? '#000080' : 'transparent',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 400,
                lineHeight: '12px',
              }}
              onClick={() => handleMenuClick(item, idx)}
              onMouseEnter={() => {
                if (activeMenuIdx !== null) {
                  setActiveMenuIdx(idx);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMenuClick(item, idx);
                }
              }}
            >
              <span style={{ textDecoration: 'underline' }}>{firstLetter}</span>
              <span>{rest}</span>
            </div>

            {/* Dropdown Menu Popup */}
            {isOpen && subItems && (
              <div
                style={{
                  position: 'absolute',
                  top: '19px',
                  left: '0px',
                  minWidth: '150px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
                  padding: '2px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {subItems.map((sub, sIdx) => {
                  if (sub.isSeparator) {
                    return (
                      <div
                        key={`sep-${sIdx}`}
                        style={{
                          height: '1px',
                          margin: '3px 2px',
                          borderTop: '1px solid #808080',
                          borderBottom: '1px solid #FFFFFF',
                        }}
                      />
                    );
                  }

                  return (
                    <div
                      key={`sub-${sIdx}-${sub.label}`}
                      role="menuitem"
                      tabIndex={0}
                      className="win98-dropdown-item"
                      onClick={() => handleSubItemClick(sub)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSubItemClick(sub);
                        }
                      }}
                      style={{
                        padding: '3px 12px 3px 8px',
                        fontSize: '11px',
                        fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                        color: '#000000',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#000080';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#000000';
                      }}
                    >
                      <span>{sub.label}</span>
                      {sub.shortcut && (
                        <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '12px' }}>
                          {sub.shortcut}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
