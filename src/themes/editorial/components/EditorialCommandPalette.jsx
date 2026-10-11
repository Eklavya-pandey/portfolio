import React, { useState, useEffect, useRef } from 'react';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks } from './EditorialIcons';

export default function EditorialCommandPalette({
  isOpen,
  onClose,
  onSelectProject,
  onToggleMode,
  currentMode,
  onToggleInspect,
  isInspectMode,
  onOpenFont,
  onOpenType,
  onOpenAscii,
  onCopyEmail,
  onSwitchToWin98,
  onSwitchToDesignFile,
  isDesignFileActive,
  onScrollTo
}) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const ACTIONS = [
    // Interactive Tools
    {
      id: 'tool-font',
      category: 'TOOLS',
      label: 'Change font (Mono Swapper)',
      shortcut: 'F',
      run: onOpenFont
    },
    {
      id: 'tool-type',
      category: 'TOOLS',
      label: 'Typing test (Benchmark WPM)',
      shortcut: 'T',
      run: onOpenType
    },
    {
      id: 'tool-ascii',
      category: 'TOOLS',
      label: 'ASCII art (Terminal Generator)',
      shortcut: 'A',
      run: onOpenAscii
    },

    // Navigation
    { id: 'nav-home', category: 'NAVIGATION', label: 'Go to Homepage', shortcut: 'H', run: () => { window.history.pushState(null, '', 'index.html'); window.dispatchEvent(new Event('editorial_navigate')); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'nav-work', category: 'NAVIGATION', label: 'Go to 01 / WORK', shortcut: 'W', run: () => { window.history.pushState(null, '', 'work.html'); window.dispatchEvent(new Event('editorial_navigate')); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'nav-about', category: 'NAVIGATION', label: 'Go to 02 / ABOUT_ME', shortcut: 'A', run: () => { window.history.pushState(null, '', 'about.html'); window.dispatchEvent(new Event('editorial_navigate')); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'nav-playground', category: 'NAVIGATION', label: 'Go to 03 / PLAYGROUND', shortcut: 'P', run: () => { window.history.pushState(null, '', 'playground.html'); window.dispatchEvent(new Event('editorial_navigate')); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'nav-contact', category: 'NAVIGATION', label: 'Go to 04 / CONTACT', shortcut: 'C', run: () => { window.history.pushState(null, '', 'contact.html'); window.dispatchEvent(new Event('editorial_navigate')); window.scrollTo({ top: 0, behavior: 'smooth' }); } },

    // Projects
    { id: 'proj-1', category: 'PROJECTS', label: 'Open: Stock Trading App (Fintech)', shortcut: 'P1', run: () => onSelectProject('stock-trading-app') },
    { id: 'proj-2', category: 'PROJECTS', label: 'Open: IPO Application Flow (Dark UI)', shortcut: 'P2', run: () => onSelectProject('ipo-application-flow') },
    { id: 'proj-3', category: 'PROJECTS', label: 'Open: Markets Overview (Design System)', shortcut: 'P3', run: () => onSelectProject('markets-overview') },

    // Preferences & Modes
    {
      id: 'act-inspect',
      category: 'PREFERENCES',
      label: isInspectMode ? 'Exit Live Inspect Mode (Grid & Calipers)' : 'Enter Live Inspect Mode (Grid & Calipers)',
      shortcut: 'I',
      run: onToggleInspect
    },
    {
      id: 'act-mode',
      category: 'PREFERENCES',
      label: currentMode === 'blueprint' ? 'Switch to Paper Mode (Light)' : 'Switch to Blueprint Mode (Dark)',
      shortcut: 'B',
      run: onToggleMode
    },
    { id: 'act-email', category: 'ACTIONS', label: 'Copy Email Address to Clipboard', shortcut: '↵', run: onCopyEmail },
    {
      id: 'act-resume',
      category: 'ACTIONS',
      label: 'Open Resume / CV (PDF)',
      shortcut: 'R',
      run: () => window.open('mailto:naveen.pandey.design@gmail.com?subject=Resume%20Request', '_blank')
    },
    { id: 'act-win98', category: 'THEME', label: 'Switch to Windows 98 Theme', shortcut: '98', run: onSwitchToWin98 },
    {
      id: 'act-designfile',
      category: 'THEME',
      label: isDesignFileActive ? 'Figma Theme (Active)' : 'Switch to Figma Theme (NAVEEN_PORTFOLIO.fig)',
      shortcut: 'FG',
      run: onSwitchToDesignFile,
      active: isDesignFileActive
    }
  ];

  const filtered = ACTIONS.filter(a =>
    a.label.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      editorialAudio.playOpen();
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);

      const handleKey = (e) => {
        if (e.key === 'Escape') {
          editorialAudio.playClose();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      editorialAudio.playClick();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      editorialAudio.playClick();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        editorialAudio.playClick();
        filtered[selectedIndex].run();
        onClose();
      }
    }
  };

  const handleSelect = (action) => {
    editorialAudio.playClick();
    action.run();
    onClose();
  };

  return (
    <div className="editorial-cmd-overlay" onClick={onClose}>
      <div
        className="editorial-cmd-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <EditorialCornerTicks />
        <div className="editorial-cmd-header">
          <span className="editorial-cmd-prompt">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="editorial-cmd-input"
            placeholder="Type a command or jump to section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="editorial-cmd-hint">ESC TO CLOSE</span>
        </div>

        <div className="editorial-cmd-list">
          {filtered.length === 0 ? (
            <div className="editorial-cmd-empty">NO MATCHING COMMANDS FOUND</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                className={`editorial-cmd-item ${idx === selectedIndex ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                onClick={() => !item.disabled && handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                role="button"
                aria-pressed={item.id === 'tool-music' ? isMusicPlaying : item.id === 'act-designfile' ? (isDesignFileActive || false) : undefined}
                aria-disabled={item.disabled}
              >
                <div className="editorial-cmd-item-left">
                  <span className="editorial-cmd-item-category">{item.category}</span>
                  <span className="editorial-cmd-item-label">{item.label}</span>
                  {item.id === 'tool-music' && isMusicPlaying && (
                    <span className="editorial-music-bars-indicator" aria-hidden="true" style={{ marginLeft: 8 }}>
                      <span className="music-bar bar-1" />
                      <span className="music-bar bar-2" />
                      <span className="music-bar bar-3" />
                    </span>
                  )}
                </div>
                <kbd className="editorial-cmd-item-kbd">{item.shortcut}</kbd>
              </div>
            ))
          )}
        </div>

        <div className="editorial-cmd-footer">
          <span>↑↓ NAVIGATE</span>
          <span>↵ SELECT</span>
          <span>ESC CLOSE</span>
        </div>
      </div>
    </div>
  );
}
