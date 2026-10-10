import React, { useState, useRef, useCallback } from 'react';
import { editorialAudio } from '../editorialAudio';

/**
 * EditorialWireframeScrubber
 * Interactive Before & After / Wireframe-to-High-Fi Prototype Scrubber.
 * Allows visitors to drag a divider rule to compare low-fidelity architecture
 * against finished production UI with haptic/audio feedback.
 */
export default function EditorialWireframeScrubber({
  wireframeImage = '/editorial/project1.png',
  highFiImage = '/editorial/project1.png',
  title = 'Stock Trading Interface',
  wireframeLabel = '01 // WIREFRAME ARCHITECTURE',
  highFiLabel = '02 // PRODUCTION FINTECH UI'
}) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
    editorialAudio.playClick();
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    editorialAudio.playClick();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="editorial-scrubber-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* Top Specification Header */}
      <div className="editorial-scrubber-banner">
        <div className="editorial-scrubber-banner-left">
          <span className="editorial-scrubber-tag">INTERACTIVE UX SCRUBBER</span>
          <span className="editorial-scrubber-title">{title}</span>
        </div>
        <div className="editorial-scrubber-banner-right">
          <span>DRAG HANDLE OR HOVER TO COMPARE</span>
          <span className="editorial-scrubber-percent">{Math.round(sliderPosition)}% HIGH-FI</span>
        </div>
      </div>

      <div className="editorial-scrubber-viewport">
        {/* Layer 1: High-Fi Production UI (Background full) */}
        <div className="editorial-scrubber-layer high-fi-layer">
          <img src={highFiImage} alt="Production High-Fidelity UI" className="editorial-scrubber-img" />
          <div className="editorial-scrubber-badge right-badge">
            <span className="editorial-scrubber-dot dot-green" />
            <span>{highFiLabel}</span>
          </div>
        </div>

        {/* Layer 2: Wireframe Blueprint Architecture (Clipped with clip-path) */}
        <div
          className="editorial-scrubber-layer wireframe-layer"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
        >
          <img
            src={wireframeImage}
            alt="Wireframe Blueprint Architecture"
            className="editorial-scrubber-img wireframe-filter"
          />
          {/* Wireframe Blueprint Blueprint Grid Overlay */}
          <div className="editorial-scrubber-wireframe-grid" />
          <div className="editorial-scrubber-badge left-badge">
            <span className="editorial-scrubber-dot dot-orange" />
            <span>{wireframeLabel}</span>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="editorial-scrubber-divider"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="slider"
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin="0"
          aria-valuemax="100"
          tabIndex={0}
        >
          <div className="editorial-scrubber-line" />
          <div className="editorial-scrubber-handle">
            <span className="editorial-scrubber-arrow">◀</span>
            <span className="editorial-scrubber-handle-grip">||</span>
            <span className="editorial-scrubber-arrow">▶</span>
          </div>
          <div className="editorial-scrubber-line" />
        </div>
      </div>

      {/* Micro-annotations strip */}
      <div className="editorial-scrubber-footer">
        <div className="editorial-scrubber-stat">
          <span className="stat-lbl">STRUCTURAL TRANSFORMATION:</span>
          <span className="stat-val">Low-Fi Wireframe → 80+ Tokenized Figma Screens</span>
        </div>
        <div className="editorial-scrubber-stat">
          <span className="stat-lbl">USABILITY METRIC:</span>
          <span className="stat-val">-38% Reduction in Order Entry Friction</span>
        </div>
      </div>
    </div>
  );
}
