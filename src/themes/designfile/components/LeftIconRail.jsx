import React from 'react';

export default function LeftIconRail({
  activeView = 'file',
  onViewChange,
  isEditMode = false,
  isLogoScaled = false,
  onLogoClick
}) {
  return (
    <aside className="df-icon-rail" aria-label="Figma Navigation Rail">
      {/* 1. Figma Logo (scales 1.4x for Easter Egg 6) */}
      <div
        className={`df-rail-logo ${isLogoScaled ? 'scaled' : ''}`}
        onClick={onLogoClick}
        title="Figma (NAVEEN_PORTFOLIO.fig)"
        aria-label="Figma Logo"
      >
        <svg viewBox="0 0 38 57" width="28" height="42" fill="none">
          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
          <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
          <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
        </svg>
      </div>

      {/* 2. File Button */}
      <button
        type="button"
        className={`df-rail-btn ${activeView === 'file' ? 'active' : ''}`}
        onClick={() => onViewChange && onViewChange('file')}
        title="File (Pages & Layers)"
        aria-label="File"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M4 3h8l4 4v10H4V3z" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 3v4h4" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="df-rail-label">File</span>
      </button>

      {/* 3. In Edit Mode: Assets and Variables */}
      {isEditMode && (
        <>
          <button
            type="button"
            className={`df-rail-btn ${activeView === 'assets' ? 'active' : ''}`}
            onClick={() => onViewChange && onViewChange('assets')}
            title="Assets (Components)"
            aria-label="Assets"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="6" height="6" rx="1" strokeWidth="1.6" />
              <rect x="11" y="3" width="6" height="6" rx="1" strokeWidth="1.6" />
              <rect x="3" y="11" width="6" height="6" rx="1" strokeWidth="1.6" />
              <circle cx="14" cy="14" r="3" strokeWidth="1.6" />
            </svg>
            <span className="df-rail-label">Assets</span>
          </button>

          <button
            type="button"
            className={`df-rail-btn ${activeView === 'variables' ? 'active' : ''}`}
            onClick={() => onViewChange && onViewChange('variables')}
            title="Variables (Tokens)"
            aria-label="Variables"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <circle cx="6" cy="10" r="3" strokeWidth="1.6" />
              <circle cx="14" cy="10" r="3" strokeWidth="1.6" />
              <line x1="9" y1="10" x2="11" y2="10" strokeWidth="1.6" />
            </svg>
            <span className="df-rail-label">Variables</span>
          </button>
        </>
      )}
    </aside>
  );
}
