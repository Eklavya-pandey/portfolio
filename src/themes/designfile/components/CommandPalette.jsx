import React, { useState, useEffect, useRef } from 'react';
import { useTheme, THEMES } from '../../../context/ThemeContext';
import {
  PROJECTS,
  EASTER_EGG_DEFS,
  getDiscoveredEasterEggs,
  recordEasterEgg
} from '../designfileData';

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigateTo,
  onResetZoom,
  onFitCanvas,
  onShowToast,
  onScaleLogo
}) {
  const { setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const [discoveredEggs, setDiscoveredEggs] = useState(() => getDiscoveredEasterEggs());

  useEffect(() => {
    if (isOpen) {
      setDiscoveredEggs(getDiscoveredEasterEggs());
    }
  }, [isOpen]);

  // Listen for egg discoveries
  useEffect(() => {
    const handleEggFound = (e) => {
      setDiscoveredEggs(e.detail?.all || getDiscoveredEasterEggs());
    };
    window.addEventListener('fig_egg_found', handleEggFound);
    return () => window.removeEventListener('fig_egg_found', handleEggFound);
  }, []);

  const COMMAND_ITEMS = [
    // Special Easter Egg 6: Make Logo Bigger
    {
      id: 'egg-logo-bigger',
      label: 'Make the logo bigger',
      section: 'Actions',
      icon: '✨',
      action: () => {
        if (onScaleLogo) onScaleLogo();
        recordEasterEgg(6);
        if (onShowToast) onShowToast('Client request fulfilled.', 2000);
      }
    },

    // Navigation
    { id: 'page-home', label: 'Go to Home', section: 'Navigate', icon: '→', action: () => onNavigateTo('home') },
    { id: 'page-work', label: 'Go to Work (All Projects)', section: 'Navigate', icon: '→', action: () => onNavigateTo('work') },
    { id: 'page-about', label: 'Go to About (Narrative & Skills)', section: 'Navigate', icon: '→', action: () => onNavigateTo('about') },
    { id: 'page-experience', label: 'Go to Experience (Career & Roles)', section: 'Navigate', icon: '→', action: () => onNavigateTo('experience') },
    { id: 'page-contact', label: 'Go to Contact', section: 'Navigate', icon: '→', action: () => onNavigateTo('contact') },
    { id: 'page-playground', label: 'Go to Playground (Lab)', section: 'Navigate', icon: '→', action: () => onNavigateTo('playground') },

    // Themes
    { id: 'thm-meridian', label: 'Switch to Meridian (Cinematic 3D Scroll)', section: 'Themes', icon: '✦', action: () => setTheme(THEMES.MERIDIAN) },
    { id: 'thm-default', label: 'Switch to Futuristic Theme', section: 'Themes', icon: '◆', action: () => setTheme(THEMES.EDITORIAL) },
    { id: 'thm-win98', label: 'Switch to Windows 98 Theme', section: 'Themes', icon: '◆', action: () => setTheme(THEMES.WINDOWS98) },
    { id: 'thm-designfile', label: 'Figma Theme (Active)', section: 'Themes', icon: '✓', action: () => onShowToast && onShowToast('Already viewing Figma theme workspace') },

    // Canvas View Controls
    { id: 'view-fit', label: 'Fit Canvas to Screen (Cmd+0)', section: 'View', icon: '⊞', action: onFitCanvas },
    { id: 'view-zoom-100', label: 'Zoom to 100%', section: 'View', icon: '⊞', action: onResetZoom },

    // Resume
    {
      id: 'act-cv',
      label: 'Download Resume / CV (PDF)',
      section: 'Actions',
      icon: '↓',
      action: () => window.open('/assets/Naveen_Pandey_CV.pdf', '_blank')
    },

    // Projects directly from PROJECTS
    ...PROJECTS.map((p) => ({
      id: `proj-${p.id}`,
      label: `Project: ${p.title}`,
      section: 'Projects',
      icon: '❖',
      action: () => {
        onNavigateTo('work');
        if (p.hasCaseStudy || p.slug === 'onestepprint') {
          try {
            window.history.pushState(null, '', `/work/${p.slug || p.id}`);
            window.dispatchEvent(new Event('editorial_navigate'));
          } catch {}
        }
      }
    }))
  ];

  // If query is specifically "make the logo bigger", ensure it matches top
  const isLogoBiggerQuery = query.toLowerCase().trim() === 'make the logo bigger';

  const filteredCommands = COMMAND_ITEMS.filter((cmd) => {
    if (cmd.id === 'egg-logo-bigger') {
      return query.toLowerCase().includes('logo') || query.toLowerCase().includes('bigger') || query.toLowerCase().includes('make');
    }
    return (
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.section.toLowerCase().includes(query.toLowerCase())
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = (cmd) => {
    onClose();
    if (cmd.action) cmd.action();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isLogoBiggerQuery) {
        onClose();
        if (onScaleLogo) onScaleLogo();
        recordEasterEgg(6);
        if (onShowToast) onShowToast('Client request fulfilled.', 2000);
        return;
      }
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  // Group commands by section
  const sections = {};
  filteredCommands.forEach((cmd, idx) => {
    if (!sections[cmd.section]) sections[cmd.section] = [];
    sections[cmd.section].push({ ...cmd, globalIndex: idx });
  });

  // Calculate unfound egg hint for footer
  const unfoundEgg = EASTER_EGG_DEFS.find((egg) => !discoveredEggs.includes(egg.id));

  return (
    <div className="df-cmd-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command Menu">
      <div className="df-cmd-palette" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="df-cmd-input-wrap">
          <input
            ref={inputRef}
            type="text"
            className="df-cmd-input"
            placeholder="Type a command or search... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="df-cmd-list">
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
              No matching commands
            </div>
          ) : (
            Object.keys(sections).map((secName) => (
              <div key={secName}>
                <div className="df-cmd-section">{secName}</div>
                {sections[secName].map((cmd) => (
                  <div
                    key={cmd.id}
                    className={`df-cmd-item ${cmd.globalIndex === selectedIndex ? 'active' : ''}`}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(cmd.globalIndex)}
                  >
                    <span className="df-cmd-item-icon">{cmd.icon}</span>
                    <span style={{ flex: 1 }}>{cmd.label}</span>
                    <span style={{ fontSize: '10px', color: '#777' }}>
                      ↵
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Discovery Counter in Footer (Part 5) */}
        <div
          style={{
            borderTop: '1px solid #E6E6E6',
            padding: '10px 14px',
            background: '#FAFAFA',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E1E1E' }}>
              Easter eggs found: {discoveredEggs.length} / 10
            </span>
            <span style={{ fontSize: '10px', color: '#0A78CC', fontWeight: 600 }}>
              {Math.round((discoveredEggs.length / 10) * 100)}%
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#6B6B6B', fontStyle: 'italic' }}>
            {unfoundEgg
              ? `Hint: ${unfoundEgg.hint}`
              : 'All 10 Easter eggs discovered! You are a Figma master.'}
          </div>
        </div>
      </div>
    </div>
  );
}
