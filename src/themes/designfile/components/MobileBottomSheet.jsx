import React, { useState } from 'react';
import LeftSidebar from './LeftSidebar';
import RightInspector from './RightInspector';

export default function MobileBottomSheet({
  activePage,
  onPageChange,
  selectedId,
  selectedMeasure,
  onSelectLayer,
  isOpen,
  onToggleOpen,
  comments = [],
  onSwitchDefaultTheme
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('layers'); // 'layers' | 'properties' | 'comments'

  const sheetOpen = isOpen !== undefined ? isOpen : internalOpen;
  const toggleSheet = onToggleOpen || (() => setInternalOpen((prev) => !prev));

  const handleSelectLayerMobile = (layerId) => {
    if (onSelectLayer) onSelectLayer(layerId);
    // Smooth scroll to target element
    setTimeout(() => {
      const el = document.getElementById(layerId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
    setActiveTab('properties');
  };

  return (
    <div
      className={`df-mobile-bottom-sheet ${sheetOpen ? 'open' : 'closed'}`}
      aria-label="Mobile Navigation and Properties Sheet"
    >
      {/* 48px Collapsed Bar with drag handle + tabs */}
      <div
        className="df-sheet-handle-bar"
        onClick={toggleSheet}
        role="button"
        tabIndex={0}
        aria-expanded={sheetOpen}
        aria-label="Toggle Mobile Layers, Properties and Comments Sheet"
      >
        <div className="df-sheet-drag-pill" />
        <div className="df-sheet-tabs-row" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`df-sheet-tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('layers');
              if (!sheetOpen) toggleSheet();
            }}
          >
            Layers & Pages
          </button>
          <button
            type="button"
            className={`df-sheet-tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('properties');
              if (!sheetOpen) toggleSheet();
            }}
          >
            Properties
          </button>
          <button
            type="button"
            className={`df-sheet-tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('comments');
              if (!sheetOpen) toggleSheet();
            }}
          >
            Comments
          </button>
          <span
            className="df-sheet-toggle-indicator"
            onClick={toggleSheet}
            style={{ cursor: 'pointer', padding: '0 8px', color: '#888888', fontSize: '11px' }}
          >
            {sheetOpen ? '▼' : '▲'}
          </span>
        </div>
      </div>

      {/* Expanded Sheet Body: 50vh with own scroll */}
      {sheetOpen && (
        <div className="df-sheet-body">
          {activeTab === 'layers' ? (
            <LeftSidebar
              activePage={activePage}
              onPageChange={onPageChange}
              selectedId={selectedId}
              onSelectLayer={handleSelectLayerMobile}
              isEditMode={false}
            />
          ) : activeTab === 'properties' ? (
            <RightInspector
              selectedId={selectedId}
              selectedMeasure={selectedMeasure}
              activePage={activePage}
              isEditMode={false}
              activeTab="properties"
              onSwitchDefaultTheme={onSwitchDefaultTheme}
            />
          ) : (
            <RightInspector
              selectedId={selectedId}
              selectedMeasure={selectedMeasure}
              activePage={activePage}
              isEditMode={false}
              activeTab="comments"
              comments={comments}
              onSwitchDefaultTheme={onSwitchDefaultTheme}
            />
          )}
        </div>
      )}
    </div>
  );
}
