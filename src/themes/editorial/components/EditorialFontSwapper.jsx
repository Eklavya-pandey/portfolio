import React, { useEffect } from 'react';
import { editorialAudio } from '../editorialAudio';
import { EDITORIAL_CONTENT } from '../editorialContent';
import { EditorialCornerTicks, IconClose } from './EditorialIcons';

export const FONT_PRESETS = [
  {
    id: 'default',
    name: 'Chakra Petch',
    displayFont: "'Chakra Petch', sans-serif",
    bodyFont: "'Chakra Petch', sans-serif",
    displayScale: 1,
    bodyScale: 1,
    tag: 'DEFAULT / SYSTEM',
    subtag: 'Chakra Petch · Full System',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk + JetBrains',
    displayFont: "'Space Grotesk', -apple-system, sans-serif",
    bodyFont: "'JetBrains Mono', monospace",
    displayScale: 1,
    bodyScale: 1,
    tag: 'EDITORIAL / FINTECH',
    subtag: 'Space Grotesk · JetBrains Mono',
    googleUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Space+Grotesk:wght@500;700&display=swap'
  },
  {
    id: 'terminal',
    name: 'VT323 Pixel Terminal',
    displayFont: "'VT323', monospace",
    bodyFont: "'VT323', monospace",
    displayScale: 1.28,
    bodyScale: 1.22,
    tag: 'PIXEL TERMINAL',
    subtag: 'VT323 · 1.25x Size Tuned',
    googleUrl: 'https://fonts.googleapis.com/css2?family=VT323&display=swap'
  },
  {
    id: 'quirky',
    name: 'Syne Mono',
    displayFont: "'Syne Mono', monospace",
    bodyFont: "'Syne Mono', monospace",
    displayScale: 1.05,
    bodyScale: 1,
    tag: 'WIDE / QUIRKY',
    subtag: 'Syne Mono · Wide Tracking',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap'
  },
  {
    id: 'editorial',
    name: 'IBM Plex Serif + Mono',
    displayFont: "'IBM Plex Serif', Georgia, serif",
    bodyFont: "'IBM Plex Mono', monospace",
    displayScale: 1.02,
    bodyScale: 1,
    tag: 'EDITORIAL / CONTRAST',
    subtag: 'IBM Plex Serif · IBM Plex Mono',
    googleUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&family=IBM+Plex+Serif:ital,wght@0,400;0,600;0,700;1,400&display=swap'
  },
  {
    id: '8-bit',
    name: 'Press Start 2P + Mono',
    displayFont: "'Press Start 2P', monospace",
    bodyFont: "'IBM Plex Mono', monospace",
    displayScale: 0.65,
    bodyScale: 1,
    tag: '8-BIT / ARCADE',
    subtag: 'Press Start 2P · Plex Mono',
    googleUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Press+Start+2P&display=swap'
  }
];

// Alias for backwards compatibility
export const MONO_FONTS = FONT_PRESETS;

export function ensureGoogleFontsLoaded(preset) {
  if (typeof document === 'undefined') return;
  const linkId = preset ? `google-font-${preset.id}` : 'google-fonts-all';
  if (document.getElementById(linkId)) return;

  const url = preset?.googleUrl ||
    'https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,400;1,700&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&family=IBM+Plex+Serif:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;0,800;1,400&family=Press+Start+2P&family=Space+Grotesk:wght@500;700&family=Syne+Mono&family=VT323&display=swap';

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

// Alias for backwards compatibility
export const ensureGoogleMonoFontsLoaded = ensureGoogleFontsLoaded;

/**
 * EditorialFontSwapper
 * Popover positioned above the floating toolbar.
 * Allows visitors to live-preview and switch the typography system across the entire site.
 */
export default function EditorialFontSwapper({
  isOpen,
  onClose,
  currentFontId,
  onSelectFont,
  onResetFont
}) {
  useEffect(() => {
    if (isOpen) {
      ensureGoogleFontsLoaded();
      editorialAudio.playOpen();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="editorial-font-popover"
      role="dialog"
      aria-label="Typography System Swapper"
    >
      <EditorialCornerTicks />
      {/* Popover Header */}
      <div className="editorial-font-header">
        <div className="editorial-font-header-title">
          <span className="editorial-font-indicator">●</span>
          <span className="editorial-font-heading">TYPOGRAPHY SYSTEM // 01</span>
        </div>
        <div className="editorial-font-header-actions">
          <span className="editorial-font-key-badge">F</span>
          <button
            type="button"
            className="editorial-font-close-btn"
            onClick={() => {
              editorialAudio.playClose();
              onClose();
            }}
            aria-label="Close font swapper"
          >
            <IconClose size={12} />
          </button>
        </div>
      </div>

      <div className="editorial-font-subline">
        CLICK A PRESET TO APPLY
      </div>

      {/* Font Options List */}
      <div className="editorial-font-list" role="listbox" aria-label="Available typography presets">
        {FONT_PRESETS.map((font) => {
          const isSelected = font.id === currentFontId;
          return (
            <button
              key={font.id}
              type="button"
              className={`editorial-font-item ${isSelected ? 'selected' : ''}`}
              onMouseEnter={() => {
                editorialAudio.playHover();
              }}
              onClick={() => {
                ensureGoogleFontsLoaded(font);
                editorialAudio.playClick();
                onSelectFont(font);
              }}
              role="option"
              aria-selected={isSelected}
            >
              <div className="editorial-font-item-left">
                <span className="editorial-font-status-dot">
                  {isSelected ? '●' : '○'}
                </span>
                <div className="editorial-font-item-meta">
                  <span
                    className="editorial-font-preview-name"
                    style={{ fontFamily: font.displayFont }}
                  >
                    {font.name}
                  </span>
                  <span className="editorial-font-preview-sub">
                    {font.subtag}
                  </span>
                </div>
              </div>
              <span className="editorial-font-tag-badge">{font.tag}</span>
            </button>
          );
        })}
      </div>

      {/* Popover Footer */}
      <div className="editorial-font-footer">
        <span className="editorial-font-note">TABULAR NUMS PRESERVED</span>
        <button
          type="button"
          className="editorial-font-reset-btn"
          onClick={() => {
            editorialAudio.playClick();
            onResetFont();
          }}
          title="Reset to Chakra Petch default"
        >
          {EDITORIAL_CONTENT.buttons.resetDefault}
        </button>
      </div>
    </div>
  );
}
