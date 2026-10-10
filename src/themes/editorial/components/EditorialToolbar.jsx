import React, { useState } from 'react';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks } from './EditorialIcons';

/**
 * EditorialToolbar
 * Floating bottom-center toolbar matching Editorial technical UI tokens.
 * Tools: [01 FONT] [02 TYPE] [03 ASCII] [04 MUSIC]
 * Features:
 * - Backdrop blur & semi-opaque surface
 * - Close/minimize toggle to collapse to a single compact icon button
 * - Mobile responsive drawer
 * - Animated 3-bar equalizer when background music is playing
 */
export default function EditorialToolbar({
  activePanel, // 'font' | 'type' | 'ascii' | 'music' | null
  onToggleFont,
  onOpenType,
  onOpenAscii,
  onToggleMusic,
  isMusicPlaying
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).has('minimized');
    } catch {
      return false;
    }
  });

  const handleToolClick = (toolAction) => {
    if (toolAction) {
      editorialAudio.playClick();
      toolAction();
    }
    setMobileExpanded(false);
  };

  // Minimized state: single compact floating icon button
  if (isMinimized) {
    return (
      <aside className="editorial-floating-toolbar-minimized" aria-label="Collapsed Interactive Tools">
        <button
          type="button"
          className="editorial-toolbar-minimized-btn"
          onClick={() => {
            editorialAudio.playClick();
            setIsMinimized(false);
          }}
          title="Expand interactive tools toolbar"
          aria-label="Expand tools toolbar"
        >
          <span className="editorial-toolbar-dot">●</span>
          <span className="editorial-toolbar-min-lbl">TOOLS</span>
          {isMusicPlaying && (
            <span className="editorial-toolbar-eq mini" aria-label="Music playing">
              <span className="editorial-toolbar-eq-bar" />
              <span className="editorial-toolbar-eq-bar" />
              <span className="editorial-toolbar-eq-bar" />
            </span>
          )}
          <span className="editorial-toolbar-expand-icon">▲</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      className={`editorial-floating-toolbar ${mobileExpanded ? 'mobile-open' : ''}`}
      aria-label="Interactive Tools Toolbar"
    >
      <EditorialCornerTicks />
      {/* Mobile Toggle Trigger */}
      <button
        type="button"
        className={`editorial-toolbar-mobile-trigger ${mobileExpanded || activePanel ? 'active' : ''}`}
        onClick={() => {
          editorialAudio.playClick();
          setMobileExpanded(prev => !prev);
        }}
        aria-expanded={mobileExpanded}
        aria-label="Toggle interactive tools menu"
      >
        <span className="editorial-toolbar-dot">●</span>
        <span>TOOLS</span>
        {isMusicPlaying && (
          <span className="editorial-toolbar-eq mini" aria-label="Music playing">
            <span className="editorial-toolbar-eq-bar" />
            <span className="editorial-toolbar-eq-bar" />
            <span className="editorial-toolbar-eq-bar" />
          </span>
        )}
        <span className="editorial-toolbar-arrow">{mobileExpanded ? '▼' : '▲'}</span>
      </button>

      {/* Toolbar Item Buttons */}
      <div className="editorial-toolbar-items">
        <button
          type="button"
          className={`editorial-toolbar-btn ${activePanel === 'font' ? 'active' : ''}`}
          onClick={() => handleToolClick(onToggleFont)}
          title="Change monospace typeface (Press F)"
          aria-label="Font Swapper"
          aria-pressed={activePanel === 'font'}
        >
          <span className="editorial-toolbar-btn-tag">01</span>
          <span className="editorial-toolbar-btn-label">FONT</span>
          <span className="editorial-toolbar-kbd">F</span>
        </button>

        <span className="editorial-toolbar-sep" aria-hidden="true">|</span>

        <button
          type="button"
          className={`editorial-toolbar-btn ${activePanel === 'type' ? 'active' : ''}`}
          onClick={() => handleToolClick(onOpenType)}
          title="Speed typing benchmark test (Press T)"
          aria-label="Typing Test"
          aria-pressed={activePanel === 'type'}
        >
          <span className="editorial-toolbar-btn-tag">02</span>
          <span className="editorial-toolbar-btn-label">TYPE</span>
          <span className="editorial-toolbar-kbd">T</span>
        </button>

        <span className="editorial-toolbar-sep" aria-hidden="true">|</span>

        <button
          type="button"
          className={`editorial-toolbar-btn ${activePanel === 'ascii' ? 'active' : ''}`}
          onClick={() => handleToolClick(onOpenAscii)}
          title="Canvas ASCII terminal art generator (Press A)"
          aria-label="ASCII Art Studio"
          aria-pressed={activePanel === 'ascii'}
        >
          <span className="editorial-toolbar-btn-tag">03</span>
          <span className="editorial-toolbar-btn-label">ASCII</span>
          <span className="editorial-toolbar-kbd">A</span>
        </button>

        <span className="editorial-toolbar-sep" aria-hidden="true">|</span>

        <button
          type="button"
          className={`editorial-toolbar-btn ${activePanel === 'music' ? 'active' : ''}`}
          onClick={() => handleToolClick(onToggleMusic)}
          title="Background ambient music player (Press M)"
          aria-label="Background Music Player"
          aria-pressed={activePanel === 'music'}
        >
          <span className="editorial-toolbar-btn-tag">04</span>
          <span className="editorial-toolbar-btn-label">MUSIC</span>
          {isMusicPlaying ? (
            <span className="editorial-toolbar-eq" aria-label="Music actively playing">
              <span className="editorial-toolbar-eq-bar" />
              <span className="editorial-toolbar-eq-bar" />
              <span className="editorial-toolbar-eq-bar" />
            </span>
          ) : (
            <span className="editorial-toolbar-kbd">M</span>
          )}
        </button>

        <span className="editorial-toolbar-sep" aria-hidden="true">|</span>

        {/* Minimize Toolbar Button */}
        <button
          type="button"
          className="editorial-toolbar-minimize-btn"
          onClick={() => {
            editorialAudio.playClick();
            setIsMinimized(true);
          }}
          title="Minimize toolbar to compact icon"
          aria-label="Minimize toolbar"
        >
          ─
        </button>
      </div>
    </aside>
  );
}
