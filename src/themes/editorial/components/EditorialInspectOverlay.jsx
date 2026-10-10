import React, { useState, useEffect, useRef } from 'react';

/**
 * EditorialInspectOverlay
 * Figma / CAD style live inspector overlay.
 * Renders an 8px Swiss grid guide and dynamic measurement calipers & dimension badges
 * over hovered elements when Inspect Mode is active.
 */
export default function EditorialInspectOverlay({ isActive }) {
  const [hoveredRect, setHoveredRect] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setHoveredRect(null);
      setMetrics(null);
      return;
    }

    const handleMouseMove = (e) => {
      // Find element under cursor, ignoring the inspect overlay itself
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const target = elements.find(
        (el) =>
          !el.classList.contains('editorial-inspect-layer') &&
          !el.closest('.editorial-inspect-layer') &&
          !el.classList.contains('editorial-inspect-btn') &&
          !el.classList.contains('editorial-global-grid') &&
          !el.classList.contains('editorial-corner-ticks') &&
          !el.closest('.editorial-corner-ticks') &&
          !el.classList.contains('editorial-frame-column-grid') &&
          !el.closest('.editorial-frame-column-grid') &&
          !el.classList.contains('editorial-cad-crossbox') &&
          !el.closest('.editorial-cad-crossbox') &&
          !el.classList.contains('editorial-cad-reticle') &&
          !el.closest('.editorial-cad-reticle') &&
          el.closest('.editorial-window-frame')
      );

      if (target) {
        const rect = target.getBoundingClientRect();
        const cs = window.getComputedStyle(target);

        setHoveredRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });

        const tagName = target.tagName.toLowerCase();
        const className = target.classList[0] || '';
        const padding = `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`;
        const fontSize = cs.fontSize;
        const fontWeight = cs.fontWeight;
        const color = cs.color;

        setMetrics({
          label: `<${tagName}${className ? '.' + className : ''}>`,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          padding: cs.paddingTop !== '0px' ? cs.paddingTop : null,
          fontSize: cs.fontSize !== '0px' ? `${fontSize} / ${fontWeight}` : null,
          color: color
        });
      } else {
        setHoveredRect(null);
        setMetrics(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="editorial-inspect-layer" ref={overlayRef}>
      {/* 8px Swiss Grid & 12-Column Overlay */}
      <div className="editorial-inspect-grid-bg" />

      {/* Floating Status Pill */}
      <div className="editorial-inspect-status-bar">
        <span className="editorial-inspect-indicator">●</span>
        <span className="editorial-inspect-status-text">CAD INSPECTOR ACTIVE</span>
        <span className="editorial-inspect-badge">8PT BASELINE GRID</span>
        <span className="editorial-inspect-shortcut">ESC / ⌘K TO EXIT</span>
      </div>

      {/* Hover Bounding Box & Calipers */}
      {hoveredRect && metrics && (
        <>
          {/* Component Bounding Box */}
          <div
            className="editorial-inspect-box"
            style={{
              top: `${hoveredRect.top}px`,
              left: `${hoveredRect.left}px`,
              width: `${hoveredRect.width}px`,
              height: `${hoveredRect.height}px`
            }}
          >
            {/* Top dimension label */}
            <span className="editorial-inspect-dim-top">
              {metrics.width}px
            </span>

            {/* Right dimension label */}
            <span className="editorial-inspect-dim-right">
              {metrics.height}px
            </span>

            {/* Corner Caliper Ticks */}
            <div className="editorial-inspect-corner corner-tl" />
            <div className="editorial-inspect-corner corner-tr" />
            <div className="editorial-inspect-corner corner-bl" />
            <div className="editorial-inspect-corner corner-br" />
          </div>

          {/* Floating Spec Tooltip */}
          <div
            className="editorial-inspect-tooltip"
            style={{
              top: `${Math.max(12, hoveredRect.top - 38)}px`,
              left: `${Math.max(12, hoveredRect.left)}px`
            }}
          >
            <span className="editorial-inspect-tt-name">{metrics.label}</span>
            <span className="editorial-inspect-tt-sep">·</span>
            <span className="editorial-inspect-tt-dim">
              {metrics.width} × {metrics.height}px
            </span>
            {metrics.fontSize && (
              <>
                <span className="editorial-inspect-tt-sep">·</span>
                <span className="editorial-inspect-tt-spec">{metrics.fontSize}</span>
              </>
            )}
            {metrics.padding && (
              <>
                <span className="editorial-inspect-tt-sep">·</span>
                <span className="editorial-inspect-tt-spec">pad: {metrics.padding}</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
