import React, { useState, useEffect, useRef } from 'react';
import {
  PAGES,
  PAGE_LAYERS,
  VERSION_HISTORY,
  ASSETS_COMPONENTS,
  VARIABLES_TOKENS
} from '../designfileData';

export default function LeftSidebar({
  activePage = 'home',
  onPageChange,
  selectedId,
  onSelectLayer,
  onHoverLayer,
  isEditMode = false,
  activeView = 'file',
  onViewChange,
  onRestoreOriginal,
  onSwitchDefaultTheme,
  hiddenLayerIds = [],
  onToggleHideLayer,
  lockedLayerIds = [],
  onToggleLockLayer,
  customLayerNames = {},
  onRenameLayer,
  onRecordEasterEgg,
  isCollapsed = false,
  onToggleCollapse
}) {
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [editingLayerId, setEditingLayerId] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [pagesSearch, setPagesSearch] = useState('');

  const menuRef = useRef(null);
  const versionRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsFileMenuOpen(false);
      }
      if (versionRef.current && !versionRef.current.contains(e.target)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGroup = (groupId, e) => {
    e.stopPropagation();
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleStartRename = (nodeId, currentLabel, e) => {
    if (!isEditMode) return;
    e.stopPropagation();
    setEditingLayerId(nodeId);
    setEditNameValue(currentLabel);
  };

  const handleFinishRename = () => {
    if (editingLayerId && onRenameLayer) {
      onRenameLayer(editingLayerId, editNameValue.trim());
    }
    setEditingLayerId(null);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleFinishRename();
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
    }
  };

  const handleOpenVersionHistory = () => {
    setIsVersionDropdownOpen((prev) => !prev);
    setIsFileMenuOpen(false);
    if (onRecordEasterEgg) {
      onRecordEasterEgg(9); // Easter Egg 9: Version history
    }
  };

  const renderLayerNodes = (nodes, depth = 0) => {
    if (!nodes || nodes.length === 0) return null;

    return nodes.map((node) => {
      const isSelected = selectedId === node.id || selectedId === node.projectId;
      const hasChildren = node.children && node.children.length > 0;
      const isGroupCollapsed = !!collapsedGroups[node.id];
      const indentPx = 12 + depth * 16; // Exact 16px per level indent step
      const isHidden = hiddenLayerIds.includes(node.id) || hiddenLayerIds.includes(node.projectId);
      const isLocked = lockedLayerIds.includes(node.id) || lockedLayerIds.includes(node.projectId);
      const displayName = customLayerNames[node.id] || node.label;

      return (
        <div key={node.id} className="df-layer-group">
          <div
            className={`df-layer-row ${isSelected ? 'selected' : ''}`}
            style={{ paddingLeft: `${indentPx}px` }}
            onClick={() => {
              if (isLocked) return;
              onSelectLayer && onSelectLayer(node.projectId || node.id);
            }}
            onMouseEnter={() => onHoverLayer && onHoverLayer(node.projectId || node.id)}
            onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
            role="treeitem"
            aria-selected={isSelected}
            title={node.fullName || displayName}
          >
            {hasChildren ? (
              <button
                type="button"
                className={`df-layer-arrow ${isGroupCollapsed ? 'collapsed' : ''}`}
                onClick={(e) => toggleGroup(node.id, e)}
                aria-label={isGroupCollapsed ? 'Expand group' : 'Collapse group'}
              >
                ▼
              </button>
            ) : (
              <span className="df-layer-arrow-spacer" aria-hidden="true" />
            )}

            <span className={`df-layer-glyph ${node.type}`}>
              {node.type === 'frame' ? '#' : node.type === 'component' ? '❖' : 'T'}
            </span>

            {editingLayerId === node.id ? (
              <input
                type="text"
                className="df-prop-input"
                style={{ height: '22px', fontSize: '12px', flex: 1, textAlign: 'left' }}
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onBlur={handleFinishRename}
                onKeyDown={handleRenameKeyDown}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="df-layer-title"
                onDoubleClick={(e) => handleStartRename(node.id, displayName, e)}
                style={{ opacity: isHidden ? 0.4 : 1 }}
              >
                {displayName}
              </span>
            )}

            {/* Hover actions (Eye & Lock in edit mode only) */}
            {isEditMode && (
              <div className="df-layer-hover-actions">
                <button
                  type="button"
                  className="df-layer-action-btn"
                  title={isHidden ? 'Show layer' : 'Hide layer'}
                  aria-label={isHidden ? 'Show layer' : 'Hide layer'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleHideLayer && onToggleHideLayer(node.id);
                  }}
                >
                  {isHidden ? '🚫' : '👁'}
                </button>
                <button
                  type="button"
                  className="df-layer-action-btn"
                  title={isLocked ? 'Unlock layer' : 'Lock layer'}
                  aria-label={isLocked ? 'Unlock layer' : 'Lock layer'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLockLayer && onToggleLockLayer(node.id);
                  }}
                >
                  {isLocked ? '🔒' : '🔓'}
                </button>
              </div>
            )}
          </div>

          {hasChildren && !isGroupCollapsed && (
            <div className="df-layer-nested" role="group">
              {renderLayerNodes(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const currentLayers = PAGE_LAYERS[activePage] || PAGE_LAYERS.home;

  const filteredPages = pagesSearch
    ? PAGES.filter((p) => p.label.toLowerCase().includes(pagesSearch.toLowerCase()))
    : PAGES;

  return (
    <aside className={`df-left-panel ${isCollapsed ? 'collapsed' : ''}`} aria-label="Left Sidebar">
      {/* 1. Header with file name, chevron, v4.0 chip, and collapse icon */}
      <header className="df-left-header" ref={menuRef}>
        <div
          className="df-file-title-wrap"
          onClick={() => setIsFileMenuOpen((prev) => !prev)}
          title="File Menu"
          aria-haspopup="true"
          aria-expanded={isFileMenuOpen}
        >
          <span className="df-file-title-text">NAVEEN_PORTFOLIO.fig</span>
          <span className="df-file-chevron">▼</span>
        </div>

        {/* v4.0 version chip (Easter Egg 9) */}
        <div ref={versionRef} style={{ position: 'relative' }}>
          <span
            className="df-version-chip-v4"
            onClick={handleOpenVersionHistory}
            title="Version History (v4.0)"
            role="button"
            tabIndex={0}
          >
            v4.0
          </span>

          {/* Version History Dropdown */}
          {isVersionDropdownOpen && (
            <div className="df-version-history-dropdown" role="dialog" aria-label="Version History">
              <div className="df-version-history-title">Version History</div>
              {VERSION_HISTORY.map((ver) => (
                <div key={ver.version} className="df-version-entry">
                  <div>
                    <span className="df-version-tag">{ver.version}</span>
                    <span className="df-version-period">{ver.period}</span>
                  </div>
                  <div className="df-version-company">{ver.company}</div>
                  <div className="df-version-desc">{ver.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collapse Sidebar Icon */}
        <button
          type="button"
          className="df-collapse-btn"
          onClick={onToggleCollapse}
          title="Collapse Left Sidebar"
          aria-label="Collapse Left Sidebar"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor">
            <rect x="2" y="2" width="12" height="12" rx="2" strokeWidth="1.5" />
            <line x1="6" y1="2" x2="6" y2="14" strokeWidth="1.5" />
          </svg>
        </button>

        {/* File Menu Dropdown */}
        {isFileMenuOpen && (
          <div className="df-file-menu-dropdown" role="menu">
            <div
              className="df-file-menu-header"
              style={{
                padding: '8px 12px 6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#1E1E1E',
                borderBottom: '1px solid #E6E6E6',
                letterSpacing: '-0.01em'
              }}
            >
              NAVEEN_PORTFOLIO.fig
            </div>
            <button
              type="button"
              className="df-menu-item"
              role="menuitem"
              onClick={() => {
                setIsFileMenuOpen(false);
                onRestoreOriginal && onRestoreOriginal();
              }}
            >
              <span>Restore original</span>
            </button>
            <button
              type="button"
              className="df-menu-item"
              role="menuitem"
              onClick={() => {
                setIsFileMenuOpen(false);
                handleOpenVersionHistory();
              }}
            >
              <span>Version history</span>
            </button>
            <div className="df-menu-divider" />
            <button
              type="button"
              className="df-menu-item"
              role="menuitem"
              onClick={() => {
                setIsFileMenuOpen(false);
                onSwitchDefaultTheme && onSwitchDefaultTheme();
              }}
            >
              <span>Futuristic theme</span>
            </button>
            <a
              href="/assets/Naveen_Pandey_CV.pdf"
              download="Naveen_Pandey_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="df-menu-item"
              role="menuitem"
              style={{ textDecoration: 'none' }}
              onClick={() => setIsFileMenuOpen(false)}
            >
              <span>Download CV</span>
            </a>
          </div>
        )}
      </header>

      {/* 2. BODY CONTENT: 'file' (Pages & Layers), 'assets' (Components), or 'variables' (Tokens) */}
      {activeView === 'assets' ? (
        <div className="df-assets-panel-view">
          <div className="df-section-heading" style={{ marginBottom: '12px' }}>
            ASSETS & COMPONENTS
          </div>
          {ASSETS_COMPONENTS.map((item) => (
            <div key={item.id} className="df-assets-item-card">
              <div className="df-assets-item-header">❖ {item.name}</div>
              <div className="df-assets-item-preview">{item.preview}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{item.type}</div>
            </div>
          ))}
        </div>
      ) : activeView === 'variables' ? (
        <div className="df-variables-panel-view">
          <div className="df-section-heading" style={{ marginBottom: '12px' }}>
            VARIABLES & TOKENS
          </div>
          {VARIABLES_TOKENS.map((token, i) => (
            <div key={i} className="df-prop-row" style={{ borderBottom: '1px solid #F0F0F0', padding: '6px 0' }}>
              <span className="df-prop-label" style={{ textTransform: 'none', fontSize: '11px' }}>
                {token.name}
              </span>
              <span className="df-prop-value" style={{ fontSize: '11px', color: '#0066CC', fontWeight: 500 }}>
                {token.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* Standard Pages & Layers View */
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* PAGES Section */}
          <div className="df-panel-section df-pages-section">
            <div className="df-section-heading-row">
              <div className="df-section-heading">PAGES</div>
              <span style={{ fontSize: '11px', color: '#888' }}>5</span>
            </div>
            <ul className="df-page-nav-list" role="tablist">
              {filteredPages.map((page) => {
                const isActive = activePage === page.id;
                return (
                  <li
                    key={page.id}
                    className={`df-page-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => onPageChange && onPageChange(page.id)}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onPageChange && onPageChange(page.id);
                      }
                    }}
                  >
                    <span className="df-page-nav-icon">{page.icon}</span>
                    <span className="df-page-nav-label">{page.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="df-panel-divider" />

          {/* LAYERS Section */}
          <div
            className="df-panel-section df-layers-section"
            style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
          >
            <div className="df-section-heading-row">
              <div className="df-section-heading">LAYERS</div>
              {isEditMode && <span style={{ fontSize: '10px', color: '#0A78CC' }}>EDITABLE</span>}
            </div>
            <div className="df-layers-tree" role="tree">
              {renderLayerNodes(currentLayers, 0)}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
