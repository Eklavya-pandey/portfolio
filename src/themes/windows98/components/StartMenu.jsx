import React, { useState, useEffect, useRef } from 'react';
import { FolderIconSmall, FileIconSmall, ProgramIconSmall } from './Icons';
import { useSound } from '../../../context/SoundContext';

const MAIN_ITEMS = [
  { key: 'programs', label: 'Programs', hasSubmenu: true, icon: <FolderIconSmall /> },
  { key: 'documents', label: 'Documents', hasSubmenu: true, icon: <FileIconSmall /> },
  { key: 'settings', label: 'Settings', hasSubmenu: true, icon: null },
  { key: 'find', label: 'Find', hasSubmenu: true, icon: null },
  { key: 'help', label: 'Help', hasSubmenu: false, icon: null },
  { key: 'run', label: 'Run...', hasSubmenu: false, icon: null },
  { isSeparator: true },
  { key: 'shutdown', label: 'Shut Down...', hasSubmenu: false, icon: null },
];

const SUBMENUS = {
  programs: [
    { key: 'made', label: 'MADE (Projects)', icon: <FolderIconSmall /> },
    { key: 'about', label: 'ABOUT_ME.EXE', icon: <ProgramIconSmall /> },
    { key: 'skills', label: 'SKILLS.EXE', icon: <FolderIconSmall /> },
    { key: 'resume', label: 'RESUME.EXE', icon: <FolderIconSmall /> },
    { key: 'hello', label: 'HELLO.EXE', icon: <FolderIconSmall /> },
    { key: 'nova', label: 'NOVA_INVEST.EXE', icon: <FolderIconSmall /> },
    { key: 'myComputer', label: 'System Properties', icon: <ProgramIconSmall /> },
  ],
  documents: [
    { key: 'resume', label: 'Resume.doc', icon: <FileIconSmall /> },
    { key: 'nova', label: 'Case Study - Nova Invest', icon: <FileIconSmall /> },
    { key: 'made', label: 'Projects Overview', icon: <FileIconSmall /> },
  ],
  settings: [
    { key: 'myComputer', label: 'Control Panel', icon: <ProgramIconSmall /> },
    { key: 'myComputer', label: 'Taskbar & Start Menu...', icon: null },
  ],
  find: [
    { key: 'made', label: 'Files or Folders...', icon: <FolderIconSmall /> },
  ],
};

export default function StartMenu({ isOpen, onClose, onSelectItem }) {
  const { playSound } = useSound();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [highlightedSubIndex, setHighlightedSubIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveSubmenu(null);
      setHighlightedIndex(null);
      setHighlightedSubIndex(null);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (activeSubmenu) {
          setActiveSubmenu(null);
          setHighlightedSubIndex(null);
        } else {
          if (onClose) onClose();
        }
        return;
      }

      const actionableIndices = MAIN_ITEMS.map((item, idx) => (!item.isSeparator ? idx : null)).filter(
        (i) => i !== null
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeSubmenu && SUBMENUS[activeSubmenu]) {
          const subLen = SUBMENUS[activeSubmenu].length;
          setHighlightedSubIndex((prev) => (prev === null || prev >= subLen - 1 ? 0 : prev + 1));
        } else {
          setHighlightedIndex((prev) => {
            if (prev === null) return actionableIndices[0];
            const currentPos = actionableIndices.indexOf(prev);
            const nextPos = (currentPos + 1) % actionableIndices.length;
            const nextIdx = actionableIndices[nextPos];
            const item = MAIN_ITEMS[nextIdx];
            if (item && item.hasSubmenu) {
              setActiveSubmenu(item.key);
              setHighlightedSubIndex(null);
            } else {
              setActiveSubmenu(null);
            }
            return nextIdx;
          });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeSubmenu && SUBMENUS[activeSubmenu]) {
          const subLen = SUBMENUS[activeSubmenu].length;
          setHighlightedSubIndex((prev) => (prev === null || prev <= 0 ? subLen - 1 : prev - 1));
        } else {
          setHighlightedIndex((prev) => {
            if (prev === null) return actionableIndices[actionableIndices.length - 1];
            const currentPos = actionableIndices.indexOf(prev);
            const nextPos = (currentPos - 1 + actionableIndices.length) % actionableIndices.length;
            const nextIdx = actionableIndices[nextPos];
            const item = MAIN_ITEMS[nextIdx];
            if (item && item.hasSubmenu) {
              setActiveSubmenu(item.key);
              setHighlightedSubIndex(null);
            } else {
              setActiveSubmenu(null);
            }
            return nextIdx;
          });
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!activeSubmenu && highlightedIndex !== null) {
          const item = MAIN_ITEMS[highlightedIndex];
          if (item && item.hasSubmenu && SUBMENUS[item.key]) {
            setActiveSubmenu(item.key);
            setHighlightedSubIndex(0);
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeSubmenu) {
          setActiveSubmenu(null);
          setHighlightedSubIndex(null);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSubmenu && highlightedSubIndex !== null && SUBMENUS[activeSubmenu]) {
          const subItem = SUBMENUS[activeSubmenu][highlightedSubIndex];
          if (subItem) handleItemClick(subItem.key);
        } else if (highlightedIndex !== null) {
          const item = MAIN_ITEMS[highlightedIndex];
          if (item && !item.isSeparator) {
            handleItemClick(item.key);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeSubmenu, highlightedIndex, highlightedSubIndex, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (key) => {
    playSound('ding');
    if (onSelectItem) onSelectItem(key);
    if (onClose) onClose();
  };

  const itemStyle = {
    alignSelf: 'stretch',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '6px',
    paddingRight: '12px',
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer',
    userSelect: 'none',
    boxSizing: 'border-box',
    minHeight: '24px',
  };

  const labelStyle = {
    flex: '1 1 0',
    marginLeft: '6px',
    color: 'black',
    fontSize: '11px',
    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
    fontWeight: 400,
    wordWrap: 'break-word',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      ref={menuRef}
      id="start-menu"
      data-layer="start-menu"
      className="StartMenu"
      style={{
        boxSizing: 'border-box',
        width: '200px',
        padding: '3px',
        left: '2px',
        bottom: '28px',
        position: 'fixed',
        background: '#C0C0C0',
        boxShadow:
          '1px 1px 0px white inset, -1px -1px 0px black inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
        overflow: 'visible',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        display: 'inline-flex',
        zIndex: 10002,
        userSelect: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Brand Strip: Matches exact Naveen 96 reference */}
      <div
        data-layer="brand-strip"
        className="BrandStrip"
        style={{
          width: '21px',
          alignSelf: 'stretch',
          position: 'relative',
          background: 'linear-gradient(180deg, #000080 0%, #000046 100%)',
          overflow: 'hidden',
          flexShrink: 0,
          minHeight: '197px',
        }}
      >
        <div
          data-layer="Naveen"
          className="Naveen"
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '17px',
            transform: 'rotate(-90deg)',
            transformOrigin: 'bottom left',
            color: '#AAAAAA',
            fontSize: '13px',
            fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          Naveen
        </div>
        <div
          data-layer="96"
          style={{
            position: 'absolute',
            bottom: '76px',
            left: '17px',
            transform: 'rotate(-90deg)',
            transformOrigin: 'bottom left',
            color: 'white',
            fontSize: '15px',
            fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          96
        </div>
      </div>

      {/* Main Menu Items */}
      <div
        data-layer="menu-items"
        className="MenuItems"
        style={{
          flex: '1 1 0',
          alignSelf: 'stretch',
          paddingTop: '2px',
          paddingBottom: '2px',
          overflow: 'visible',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          display: 'flex',
          position: 'relative',
        }}
      >
        {MAIN_ITEMS.map((item, idx) => {
          if (item.isSeparator) {
            return (
              <div
                key={`sep-${idx}`}
                data-layer="separator"
                className="Separator"
                style={{
                  alignSelf: 'stretch',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  overflow: 'hidden',
                  flexDirection: 'column',
                  display: 'flex',
                }}
              >
                <div style={{ height: '1px', background: '#808080' }} />
                <div style={{ height: '1px', background: 'white' }} />
              </div>
            );
          }

          const isHighlighted = highlightedIndex === idx || activeSubmenu === item.key;

          return (
            <div
              key={item.key}
              id={`menu-item-${item.key}`}
              data-layer={`menu-item-${item.key}`}
              className={`MenuItem${item.key.charAt(0).toUpperCase() + item.key.slice(1)} menu-item-hover ${
                isHighlighted ? 'is-selected' : ''
              }`}
              style={itemStyle}
              onClick={() => handleItemClick(item.key)}
              onMouseEnter={() => {
                setHighlightedIndex(idx);
                if (item.hasSubmenu) {
                  setActiveSubmenu(item.key);
                  setHighlightedSubIndex(null);
                } else {
                  setActiveSubmenu(null);
                  setHighlightedSubIndex(null);
                }
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  position: 'relative',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <div style={labelStyle}>{item.label}</div>
              {item.hasSubmenu ? (
                <div
                  style={{
                    color: 'black',
                    fontSize: '7px',
                    fontFamily: "'MS W98 UI', Tahoma, sans-serif",
                    lineHeight: '1',
                  }}
                >
                  ▶
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Submenu Flyout */}
        {activeSubmenu && SUBMENUS[activeSubmenu] && (
          <div
            id={`submenu-${activeSubmenu}`}
            className="StartSubmenu"
            style={{
              position: 'absolute',
              left: '100%',
              top:
                activeSubmenu === 'programs'
                  ? '0px'
                  : activeSubmenu === 'documents'
                  ? '26px'
                  : activeSubmenu === 'settings'
                  ? '52px'
                  : '78px',
              minWidth: '170px',
              background: '#C0C0C0',
              boxShadow:
                '1px 1px 0px white inset, -1px -1px 0px black inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
              padding: '2px',
              zIndex: 10005,
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {SUBMENUS[activeSubmenu].map((subItem, sIdx) => {
              const isSubHighlighted = highlightedSubIndex === sIdx;
              return (
                <div
                  key={`${subItem.key}-${sIdx}`}
                  id={`subitem-${subItem.key}`}
                  className={`submenu-item ${isSubHighlighted ? 'is-selected' : ''}`}
                  style={{
                    padding: '4px 12px 4px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    minHeight: '24px',
                    boxSizing: 'border-box',
                    gap: '6px',
                  }}
                  onClick={() => handleItemClick(subItem.key)}
                  onMouseEnter={() => setHighlightedSubIndex(sIdx)}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {subItem.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                      color: 'black',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {subItem.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
