import React, { useState } from 'react';
import {
  getProjectById,
  getFrameById,
  portfolioData
} from '../designfileData';

export default function RightInspector({
  selectedId,
  selectedMeasure,
  activePage = 'home',
  isEditMode = false,
  isDevMode = false,
  zoom = 1,
  onZoomChange,
  onFitCanvas,
  onSwitchDefaultTheme,
  onShareFile,
  activeTab = 'comments', // 'comments' | 'properties' | 'design' | 'prototype' | 'inspect'
  onTabChange,
  comments = [],
  commentFilter = '',
  onCommentFilterChange,
  // Design tab edit props
  canvasBg = '#2C2C2C',
  onCanvasBgChange,
  nodeStyles = {},
  onUpdateStyle,
  onShowToast
}) {
  const [copiedCss, setCopiedCss] = useState(false);
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);

  const project = selectedId ? getProjectById(selectedId) : null;
  const frame = selectedId && !project ? getFrameById(selectedId, activePage) : null;

  const currentStyles = (selectedId && nodeStyles[selectedId]) || {};

  // Measured coordinates
  const measuredW = currentStyles.width || (selectedMeasure?.w ? `${selectedMeasure.w}` : project ? '360' : frame ? '1024' : 'Auto');
  const measuredH = currentStyles.height || (selectedMeasure?.h ? `${selectedMeasure.h}` : project ? '480' : frame ? 'Auto' : 'Auto');
  const measuredX = currentStyles.x !== undefined ? currentStyles.x : (selectedMeasure?.x ?? 0);
  const measuredY = currentStyles.y !== undefined ? currentStyles.y : (selectedMeasure?.y ?? 0);

  // Determine active tab based on mode if not specified
  const effectiveTab = isDevMode
    ? 'inspect'
    : activeTab;

  // Filtered comments for Comments tab
  const filteredComments = comments.filter((c) =>
    commentFilter ? (c.text?.toLowerCase().includes(commentFilter.toLowerCase()) || c.reply?.toLowerCase().includes(commentFilter.toLowerCase())) : true
  );

  // Generate CSS for Dev Mode
  const generateDevModeCss = () => {
    if (!selectedId) {
      return `/* Document Root Canvas */
background: ${canvasBg};
width: 100vw;
height: 100vh;
font-family: 'Inter', sans-serif;`;
    }

    const lines = [
      `/* Element: ${project ? project.title : frame ? frame.name : selectedId} */`,
      `width: ${measuredW}${typeof measuredW === 'number' || !isNaN(measuredW) ? 'px' : ''};`,
      `height: ${measuredH}${typeof measuredH === 'number' || !isNaN(measuredH) ? 'px' : ''};`,
      `position: relative;`,
      `transform: translate(${measuredX}px, ${measuredY}px);`
    ];

    if (currentStyles.backgroundColor) lines.push(`background-color: ${currentStyles.backgroundColor};`);
    if (currentStyles.color) lines.push(`color: ${currentStyles.color};`);
    if (currentStyles.fontSize) lines.push(`font-size: ${currentStyles.fontSize}px;`);
    if (currentStyles.fontWeight) lines.push(`font-weight: ${currentStyles.fontWeight};`);
    if (currentStyles.borderRadius) lines.push(`border-radius: ${currentStyles.borderRadius}px;`);
    if (currentStyles.border) lines.push(`border: ${currentStyles.border};`);
    if (currentStyles.opacity !== undefined) lines.push(`opacity: ${currentStyles.opacity};`);
    if (currentStyles.boxShadow) lines.push(`box-shadow: ${currentStyles.boxShadow};`);
    if (currentStyles.display) lines.push(`display: ${currentStyles.display};`);
    if (currentStyles.flexDirection) lines.push(`flex-direction: ${currentStyles.flexDirection};`);
    if (currentStyles.gap) lines.push(`gap: ${currentStyles.gap}px;`);
    if (currentStyles.padding) lines.push(`padding: ${currentStyles.padding}px;`);

    return lines.join('\n');
  };

  const handleCopyCss = () => {
    const css = generateDevModeCss();
    try {
      navigator.clipboard.writeText(css);
      setCopiedCss(true);
      if (onShowToast) onShowToast('CSS copied to clipboard');
      setTimeout(() => setCopiedCss(false), 2000);
    } catch {
      if (onShowToast) onShowToast('Could not copy CSS');
    }
  };

  const updateProp = (prop, val) => {
    if (!selectedId || !onUpdateStyle) return;
    onUpdateStyle(selectedId, { [prop]: val });
  };

  return (
    <aside className="df-right-panel" aria-label="Properties and Inspection Panel">
      {/* 1. Top Row: Avatar "N" + small chevron, Play (triangle) button + chevron, blue "Share" button */}
      <div className="df-right-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div className="df-avatar-n" title="Naveen (Owner)" aria-label="User Avatar Naveen">
            N
          </div>
          <span style={{ fontSize: '9px', color: '#6B6B6B' }}>▼</span>
        </div>

        <div className="df-top-actions-cluster">
          {/* Play (triangle) button with chevron -> Switches to futuristic theme */}
          <button
            type="button"
            className="df-play-btn"
            onClick={onSwitchDefaultTheme}
            title="Present (Futuristic Theme)"
            aria-label="Present in Futuristic Theme"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
              <polygon points="4,2 14,8 4,14" />
            </svg>
            <span style={{ fontSize: '8px', marginLeft: '2px', color: '#6B6B6B' }}>▼</span>
          </button>

          {/* Blue Share button (#0A78CC, white text) */}
          <button
            type="button"
            className="df-share-btn"
            onClick={onShareFile}
            title="Share Figma File"
            aria-label="Share"
          >
            Share
          </button>
        </div>
      </div>

      {/* 2. Tabs Bar + Zoom % Dropdown */}
      <div className="df-inspector-tabs-bar">
        <div className="df-inspector-tabs-list" role="tablist">
          {isDevMode ? (
            <button
              type="button"
              className="df-tab-btn active"
              role="tab"
              aria-selected={true}
            >
              Inspect
            </button>
          ) : !isEditMode ? (
            <>
              <button
                type="button"
                className={`df-tab-btn ${effectiveTab === 'comments' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('comments')}
                role="tab"
                aria-selected={effectiveTab === 'comments'}
              >
                Comments
              </button>
              <button
                type="button"
                className={`df-tab-btn ${effectiveTab === 'properties' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('properties')}
                role="tab"
                aria-selected={effectiveTab === 'properties'}
              >
                Properties
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`df-tab-btn ${effectiveTab === 'design' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('design')}
                role="tab"
                aria-selected={effectiveTab === 'design'}
              >
                Design
              </button>
              <button
                type="button"
                className={`df-tab-btn ${effectiveTab === 'prototype' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('prototype')}
                role="tab"
                aria-selected={effectiveTab === 'prototype'}
              >
                Prototype
              </button>
            </>
          )}
        </div>

        {/* Zoom % Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="df-zoom-dropdown-trigger"
            onClick={() => setIsZoomMenuOpen((prev) => !prev)}
            aria-label="Zoom preset menu"
            aria-haspopup="true"
          >
            <span>{Math.round(zoom * 100)}%</span>
            <span style={{ fontSize: '8px' }}>▼</span>
          </button>

          {isZoomMenuOpen && (
            <div
              className="df-file-menu-dropdown"
              style={{ right: 0, left: 'auto', width: '130px', top: '28px' }}
              role="menu"
            >
              <button
                type="button"
                className="df-menu-item"
                onClick={() => {
                  setIsZoomMenuOpen(false);
                  onZoomChange && onZoomChange(0.5);
                }}
              >
                50%
              </button>
              <button
                type="button"
                className="df-menu-item"
                onClick={() => {
                  setIsZoomMenuOpen(false);
                  onZoomChange && onZoomChange(1.0);
                }}
              >
                100%
              </button>
              <button
                type="button"
                className="df-menu-item"
                onClick={() => {
                  setIsZoomMenuOpen(false);
                  onZoomChange && onZoomChange(1.5);
                }}
              >
                150%
              </button>
              <button
                type="button"
                className="df-menu-item"
                onClick={() => {
                  setIsZoomMenuOpen(false);
                  onZoomChange && onZoomChange(2.0);
                }}
              >
                200%
              </button>
              <div className="df-menu-divider" />
              <button
                type="button"
                className="df-menu-item"
                onClick={() => {
                  setIsZoomMenuOpen(false);
                  onFitCanvas && onFitCanvas();
                }}
              >
                Fit to screen (Cmd+0)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Panel Body Content */}
      <div className="df-inspector-body">
        {/* TAB: DEV MODE INSPECT */}
        {effectiveTab === 'inspect' && (
          <div>
            <div className="df-section-title">DEV MODE — INSPECT</div>
            <div className="df-prop-row">
              <span className="df-prop-label">TARGET</span>
              <span className="df-prop-value">
                {selectedId ? (project ? project.title : frame ? frame.name : selectedId) : 'Canvas'}
              </span>
            </div>
            <div className="df-prop-row">
              <span className="df-prop-label">LAYOUT</span>
              <span className="df-prop-value">
                {measuredW} × {measuredH} px
              </span>
            </div>
            <div className="df-prop-row">
              <span className="df-prop-label">COORDINATES</span>
              <span className="df-prop-value">
                X: {measuredX}, Y: {measuredY}
              </span>
            </div>

            <div className="df-panel-divider" style={{ margin: '12px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="df-section-title" style={{ margin: 0 }}>CSS CODE</span>
              <button
                type="button"
                className="df-banner-ask-btn"
                style={{ height: '22px', padding: '0 8px', fontSize: '11px' }}
                onClick={handleCopyCss}
              >
                {copiedCss ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>

            <pre
              className="df-dev-code font-mono"
              style={{
                background: '#FAFAFA',
                border: '1px solid #E6E6E6',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '11px',
                lineHeight: 1.45,
                color: '#1E1E1E',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}
            >
              {generateDevModeCss()}
            </pre>
          </div>
        )}

        {/* TAB: COMMENTS */}
        {effectiveTab === 'comments' && (
          <div className="df-comments-panel-view">
            <div className="df-comments-search-bar">
              <span style={{ color: '#888', fontSize: '11px' }}>🔍</span>
              <input
                type="text"
                className="df-comments-search-input"
                placeholder="Search comments..."
                value={commentFilter}
                onChange={(e) => onCommentFilterChange && onCommentFilterChange(e.target.value)}
              />
              {commentFilter && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0 }}
                  onClick={() => onCommentFilterChange && onCommentFilterChange('')}
                >
                  ✕
                </button>
              )}
            </div>

            {filteredComments.length === 0 ? (
              <p className="df-comments-empty-text">
                Give feedback, ask a question, or just leave a note of appreciation. Click anywhere in the file to leave a comment.
              </p>
            ) : (
              <div>
                {filteredComments.map((thread) => (
                  <div key={thread.id} className="df-comments-thread-card">
                    <div className="df-thread-author">
                      <span>Visitor</span>
                      <span className="df-thread-time">Just now</span>
                    </div>
                    <div className="df-thread-text">{thread.text}</div>

                    {thread.reply && (
                      <div className="df-thread-reply">
                        <div className="df-reply-avatar">N</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#1E1E1E' }}>Naveen</div>
                          <div style={{ fontSize: '12px', color: '#444' }}>{thread.reply}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PROTOTYPE */}
        {effectiveTab === 'prototype' && (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#6B6B6B' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>❖</div>
            <p style={{ fontSize: '13px', lineHeight: 1.4 }}>
              Prototype is not available in this file.
            </p>
          </div>
        )}

        {/* TAB: PROPERTIES (VIEW-ONLY) */}
        {effectiveTab === 'properties' && (
          <div>
            {selectedId ? (
              <div>
                <div className="df-section-title">PROPERTIES</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">NAME</span>
                  <span className="df-prop-value" title={project ? project.title : frame ? frame.name : selectedId}>
                    {project ? project.title : frame ? frame.name : selectedId}
                  </span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">TYPE</span>
                  <span className="df-prop-value">{project ? 'COMPONENT' : 'FRAME'}</span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">SIZE</span>
                  <span className="df-prop-value">
                    {measuredW} × {measuredH}
                  </span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">POSITION</span>
                  <span className="df-prop-value">
                    X: {measuredX}, Y: {measuredY}
                  </span>
                </div>

                {project && (
                  <>
                    <div className="df-panel-divider" style={{ margin: '10px 0' }} />
                    <div className="df-section-title">PROJECT RECORD</div>
                    {project.category && (
                      <div className="df-prop-row">
                        <span className="df-prop-label">CATEGORY</span>
                        <span className="df-prop-value">{project.category}</span>
                      </div>
                    )}
                    {project.role && (
                      <div className="df-prop-row">
                        <span className="df-prop-label">ROLE</span>
                        <span className="df-prop-value">{project.role}</span>
                      </div>
                    )}
                    {project.company && (
                      <div className="df-prop-row">
                        <span className="df-prop-label">COMPANY</span>
                        <span className="df-prop-value">{project.company}</span>
                      </div>
                    )}
                    {project.year && (
                      <div className="df-prop-row">
                        <span className="df-prop-label">YEAR</span>
                        <span className="df-prop-value">{project.year}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              /* Empty selection Document Block */
              <div>
                <div className="df-section-title">DOCUMENT</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">FILE</span>
                  <span className="df-prop-value">NAVEEN_PORTFOLIO.fig</span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">DESIGNER</span>
                  <span className="df-prop-value">
                    {portfolioData.profile?.name || 'NAVEEN KUMAR PANDEY'}
                  </span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">VERSION</span>
                  <span className="df-prop-value">4.0 (Current)</span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">STATUS</span>
                  <span className="df-prop-value df-status-available">
                    <span
                      className="df-green-dot"
                      style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#1BC47D',
                        marginRight: '6px',
                        verticalAlign: 'middle',
                        flexShrink: 0
                      }}
                    />
                    Open to roles
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: DESIGN (EDIT MODE) */}
        {effectiveTab === 'design' && (
          <div>
            {!selectedId ? (
              /* Nothing selected: Document block + Canvas Background */
              <div>
                <div className="df-section-title">DOCUMENT</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">FILE</span>
                  <span className="df-prop-value">NAVEEN_PORTFOLIO.fig</span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">DESIGNER</span>
                  <span className="df-prop-value">
                    {portfolioData.profile?.name || 'NAVEEN KUMAR PANDEY'}
                  </span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">VERSION</span>
                  <span className="df-prop-value">4.0 (Current)</span>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">STATUS</span>
                  <span className="df-prop-value df-status-available">
                    <span
                      className="df-green-dot"
                      style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#1BC47D',
                        marginRight: '6px',
                        verticalAlign: 'middle',
                        flexShrink: 0
                      }}
                    />
                    Open to roles
                  </span>
                </div>

                <div className="df-panel-divider" style={{ margin: '12px 0' }} />

                <div className="df-section-title">PAGE BACKGROUND</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">CANVAS</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={canvasBg}
                      onChange={(e) => onCanvasBgChange && onCanvasBgChange(e.target.value)}
                      style={{ width: '22px', height: '22px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      className="df-prop-input"
                      value={canvasBg}
                      onChange={(e) => onCanvasBgChange && onCanvasBgChange(e.target.value)}
                      style={{ width: '75px' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Selected element design controls */
              <div>
                {/* Header */}
                <div className="df-section-title">
                  {project ? 'COMPONENT' : frame ? 'FRAME' : 'LAYER'}
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">NAME</span>
                  <span className="df-prop-value font-bold" title={project ? project.title : frame ? frame.name : selectedId}>
                    {project ? project.title : frame ? frame.name : selectedId}
                  </span>
                </div>

                <div className="df-panel-divider" style={{ margin: '10px 0' }} />

                {/* Position */}
                <div className="df-section-title">POSITION</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <div className="df-prop-row" style={{ padding: 0 }}>
                    <span className="df-prop-label">X</span>
                    <input
                      type="number"
                      className="df-prop-input"
                      value={measuredX}
                      onChange={(e) => updateProp('x', parseInt(e.target.value) || 0)}
                      style={{ width: '60px' }}
                    />
                  </div>
                  <div className="df-prop-row" style={{ padding: 0 }}>
                    <span className="df-prop-label">Y</span>
                    <input
                      type="number"
                      className="df-prop-input"
                      value={measuredY}
                      onChange={(e) => updateProp('y', parseInt(e.target.value) || 0)}
                      style={{ width: '60px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <div className="df-prop-row" style={{ padding: 0 }}>
                    <span className="df-prop-label">W</span>
                    <input
                      type="text"
                      className="df-prop-input"
                      value={measuredW}
                      onChange={(e) => updateProp('width', e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </div>
                  <div className="df-prop-row" style={{ padding: 0 }}>
                    <span className="df-prop-label">H</span>
                    <input
                      type="text"
                      className="df-prop-input"
                      value={measuredH}
                      onChange={(e) => updateProp('height', e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </div>
                </div>

                <div className="df-panel-divider" style={{ margin: '10px 0' }} />

                {/* Auto Layout */}
                <div className="df-section-title">AUTO LAYOUT</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">FLOW</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      className={`df-tool-btn ${currentStyles.flexDirection === 'column' ? 'active' : ''}`}
                      style={{ width: '26px', height: '26px', fontSize: '11px' }}
                      onClick={() => updateProp('flexDirection', 'column')}
                      title="Vertical flow"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={`df-tool-btn ${currentStyles.flexDirection === 'row' ? 'active' : ''}`}
                      style={{ width: '26px', height: '26px', fontSize: '11px' }}
                      onClick={() => updateProp('flexDirection', 'row')}
                      title="Horizontal flow"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      className={`df-tool-btn ${currentStyles.display === 'grid' ? 'active' : ''}`}
                      style={{ width: '26px', height: '26px', fontSize: '11px' }}
                      onClick={() => updateProp('display', currentStyles.display === 'grid' ? 'flex' : 'grid')}
                      title="Grid flow"
                    >
                      ▦
                    </button>
                  </div>
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">GAP</span>
                  <input
                    type="number"
                    className="df-prop-input"
                    value={currentStyles.gap !== undefined ? currentStyles.gap : 16}
                    onChange={(e) => updateProp('gap', parseInt(e.target.value) || 0)}
                    style={{ width: '60px' }}
                  />
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">PADDING</span>
                  <input
                    type="number"
                    className="df-prop-input"
                    value={currentStyles.padding !== undefined ? currentStyles.padding : 0}
                    onChange={(e) => updateProp('padding', parseInt(e.target.value) || 0)}
                    style={{ width: '60px' }}
                  />
                </div>

                <div className="df-panel-divider" style={{ margin: '10px 0' }} />

                {/* Appearance */}
                <div className="df-section-title">APPEARANCE</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">OPACITY</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="df-prop-input"
                    value={currentStyles.opacity !== undefined ? Math.round(currentStyles.opacity * 100) : 100}
                    onChange={(e) => updateProp('opacity', (parseInt(e.target.value) || 0) / 100)}
                    style={{ width: '60px' }}
                  />
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">RADIUS</span>
                  <input
                    type="number"
                    min="0"
                    className="df-prop-input"
                    value={currentStyles.borderRadius !== undefined ? currentStyles.borderRadius : 0}
                    onChange={(e) => updateProp('borderRadius', parseInt(e.target.value) || 0)}
                    style={{ width: '60px' }}
                  />
                </div>

                <div className="df-panel-divider" style={{ margin: '10px 0' }} />

                {/* Fill */}
                <div className="df-section-title">FILL</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">COLOR</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={currentStyles.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateProp('backgroundColor', e.target.value)}
                      style={{ width: '22px', height: '22px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      className="df-prop-input"
                      value={currentStyles.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateProp('backgroundColor', e.target.value)}
                      style={{ width: '75px' }}
                    />
                  </div>
                </div>

                <div className="df-panel-divider" style={{ margin: '10px 0' }} />

                {/* Stroke */}
                <div className="df-section-title">STROKE</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">BORDER</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={currentStyles.borderColor || '#E6E6E6'}
                      onChange={(e) => {
                        updateProp('borderColor', e.target.value);
                        updateProp('border', `1px solid ${e.target.value}`);
                      }}
                      style={{ width: '22px', height: '22px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      className="df-prop-input"
                      value={currentStyles.borderColor || '#E6E6E6'}
                      onChange={(e) => {
                        updateProp('borderColor', e.target.value);
                        updateProp('border', `1px solid ${e.target.value}`);
                      }}
                      style={{ width: '75px' }}
                    />
                  </div>
                </div>

                <div className="df-panel-divider" style={{ margin: '10px 0' }} />

                {/* Typography (for text or general nodes) */}
                <div className="df-section-title">TYPOGRAPHY</div>
                <div className="df-prop-row">
                  <span className="df-prop-label">SIZE</span>
                  <input
                    type="number"
                    className="df-prop-input"
                    value={currentStyles.fontSize || 14}
                    onChange={(e) => updateProp('fontSize', parseInt(e.target.value) || 14)}
                    style={{ width: '60px' }}
                  />
                </div>
                <div className="df-prop-row">
                  <span className="df-prop-label">COLOR</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={currentStyles.color || '#1E1E1E'}
                      onChange={(e) => updateProp('color', e.target.value)}
                      style={{ width: '22px', height: '22px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      className="df-prop-input"
                      value={currentStyles.color || '#1E1E1E'}
                      onChange={(e) => updateProp('color', e.target.value)}
                      style={{ width: '75px' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
