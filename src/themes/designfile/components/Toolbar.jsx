import React from 'react';

/* ── SVG Tool Icons (20px line style) ── */
const Icons = {
  move: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
      <path d="M4 2.5l5.5 14.5 2.5-5.5 5.5-2.5L4 2.5z" />
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V4.5a1.5 1.5 0 0 1 3 0V9M9 7.5a1.5 1.5 0 0 1 3 0V9M12 8a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6H8a5 5 0 0 1-5-5V9.5a1.5 1.5 0 0 1 3 0V11" />
    </svg>
  ),
  comment: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H7.5l-4.5 3v-3H3a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 3 4.5z" />
    </svg>
  ),
  frame: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="6.5" y1="2" x2="6.5" y2="18" />
      <line x1="13.5" y1="2" x2="13.5" y2="18" />
      <line x1="2" y1="6.5" x2="18" y2="6.5" />
      <line x1="2" y1="13.5" x2="18" y2="13.5" />
    </svg>
  ),
  rect: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="13" height="13" rx="1" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l5 5-8.5 8.5H3.5v-5L12 3z" />
      <circle cx="14.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  ),
  text: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h12M10 4v12M7 16h6" />
    </svg>
  ),
  resources: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="6" r="3" />
      <rect x="11.5" y="3" width="5.5" height="5.5" />
      <path d="M3 14l3-3 3 3-3 3-3-3z" />
      <path d="M11.5 17h5.5l-2.75-5-2.75 5z" />
    </svg>
  ),
  devMode: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 6 3 10 7 14" />
      <polyline points="13 6 17 10 13 14" />
      <line x1="11.5" y1="4" x2="8.5" y2="16" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1.5 10s3-5.5 8.5-5.5 8.5 5.5 8.5 5.5-3 5.5-8.5 5.5-8.5-5.5-8.5-5.5z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  )
};

export default function Toolbar({
  activeTool = 'select',
  onToolChange,
  isEditMode = false,
  isDevMode = false,
  onToggleDevMode,
  onOpenResources,
  isBannerDismissed = false,
  onDismissBanner,
  onAskToEdit,
  askToEditStatus = 'idle', // 'idle' | 'sending' | 'sent'
  onBlockedAction,
  onPenClick,
  isMobile = false
}) {
  return (
    <div className="df-floating-bottom-container" role="region" aria-label="Bottom Navigation & Toolbar">
      {/* 1. View-Only Banner (Above Toolbar) */}
      {!isEditMode && !isBannerDismissed && (
        <div className="df-floating-banner" role="status" aria-live="polite">
          <div className="df-banner-text">
            {Icons.eye}
            <span>
              {isMobile
                ? 'Editing is available on desktop.'
                : 'You can only view and comment on this file.'}
            </span>
          </div>

          {!isMobile && (
            <button
              type="button"
              className="df-banner-ask-btn"
              onClick={onAskToEdit}
              disabled={askToEditStatus !== 'idle'}
              aria-label="Ask to edit file"
            >
              {askToEditStatus === 'sending' ? (
                <>
                  <span className="df-reload-spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderTopColor: '#FFF' }} />
                  <span>Sending request...</span>
                </>
              ) : askToEditStatus === 'sent' ? (
                <span>Request sent to Naveen</span>
              ) : (
                <span>Ask to edit</span>
              )}
            </button>
          )}

          <button
            type="button"
            className="df-banner-close-btn"
            onClick={onDismissBanner}
            title="Dismiss banner"
            aria-label="Dismiss banner"
          >
            {Icons.close}
          </button>
        </div>
      )}

      {/* 2. Floating Bottom Toolbar (Centered, White, 16px radius, buttons 40px) */}
      <nav className="df-bottom-toolbar" role="toolbar" aria-label="Tools">
        {/* Move (V) */}
        <button
          type="button"
          className={`df-tool-btn ${activeTool === 'select' ? 'active' : ''}`}
          onClick={() => onToolChange && onToolChange('select')}
          title="Move (V)"
          aria-label="Move"
          aria-pressed={activeTool === 'select'}
        >
          {Icons.move}
        </button>

        {/* Hand (H) */}
        <button
          type="button"
          className={`df-tool-btn ${activeTool === 'hand' ? 'active' : ''}`}
          onClick={() => onToolChange && onToolChange('hand')}
          title="Hand tool (H)"
          aria-label="Hand tool"
          aria-pressed={activeTool === 'hand'}
        >
          {Icons.hand}
        </button>

        {/* Comment (C) */}
        <button
          type="button"
          className={`df-tool-btn ${activeTool === 'comment' ? 'active' : ''}`}
          onClick={() => onToolChange && onToolChange('comment')}
          title="Comment (C)"
          aria-label="Comment"
          aria-pressed={activeTool === 'comment'}
        >
          {Icons.comment}
        </button>

        <div className="df-toolbar-divider" />

        {/* Frame (F) - Disabled in view-only */}
        <button
          type="button"
          className={`df-tool-btn ${!isEditMode ? 'disabled' : ''} ${activeTool === 'frame' ? 'active' : ''}`}
          onClick={() => {
            if (!isEditMode) {
              onBlockedAction && onBlockedAction();
            } else {
              onToolChange && onToolChange('frame');
            }
          }}
          title={isEditMode ? 'Frame (F)' : 'Frame (View-only)'}
          aria-label="Frame"
          aria-disabled={!isEditMode}
        >
          {Icons.frame}
        </button>

        {/* Rectangle (R) - Disabled in view-only */}
        <button
          type="button"
          className={`df-tool-btn ${!isEditMode ? 'disabled' : ''} ${activeTool === 'shape' ? 'active' : ''}`}
          onClick={() => {
            if (!isEditMode) {
              onBlockedAction && onBlockedAction();
            } else {
              onToolChange && onToolChange('shape');
            }
          }}
          title={isEditMode ? 'Rectangle (R)' : 'Rectangle (View-only)'}
          aria-label="Rectangle"
          aria-disabled={!isEditMode}
        >
          {Icons.rect}
        </button>

        {/* Pen (disabled) */}
        <button
          type="button"
          className="df-tool-btn disabled"
          onClick={() => onPenClick && onPenClick()}
          title="Pen (Disabled)"
          aria-label="Pen"
          aria-disabled={true}
        >
          {Icons.pen}
        </button>

        {/* Text (T) - Disabled in view-only */}
        <button
          type="button"
          className={`df-tool-btn ${!isEditMode ? 'disabled' : ''} ${activeTool === 'text' ? 'active' : ''}`}
          onClick={() => {
            if (!isEditMode) {
              onBlockedAction && onBlockedAction();
            } else {
              onToolChange && onToolChange('text');
            }
          }}
          title={isEditMode ? 'Text (T)' : 'Text (View-only)'}
          aria-label="Text"
          aria-disabled={!isEditMode}
        >
          {Icons.text}
        </button>

        {/* Resources (opens Assets) */}
        <button
          type="button"
          className="df-tool-btn"
          onClick={onOpenResources}
          title="Resources (Assets & Components)"
          aria-label="Resources"
        >
          {Icons.resources}
        </button>

        <div className="df-toolbar-divider" />

        {/* Dev Mode toggle (Shift+D) */}
        <button
          type="button"
          className={`df-tool-btn ${isDevMode ? 'active' : ''}`}
          onClick={onToggleDevMode}
          title="Dev Mode (Shift+D)"
          aria-label="Dev Mode"
          aria-pressed={isDevMode}
        >
          {Icons.devMode}
        </button>
      </nav>
    </div>
  );
}
