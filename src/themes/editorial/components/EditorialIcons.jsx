import React from 'react';

/**
 * Editorial Technical Design Lab Icon System
 * Strict 1px / 1.2px monochrome line-art SVG icons matching blueprint / CAD aesthetic.
 */

export function IconClose({ size = 12, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <line x1="2" y1="2" x2="12" y2="12" />
      <line x1="12" y1="2" x2="2" y2="12" />
    </svg>
  );
}

export function IconReticle({ size = 16, strokeWidth = 1.5, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="4.5" />
      <line x1="8" y1="1" x2="8" y2="3.5" />
      <line x1="8" y1="12.5" x2="8" y2="15" />
      <line x1="1" y1="8" x2="3.5" y2="8" />
      <line x1="12.5" y1="8" x2="15" y2="8" />
    </svg>
  );
}

export function IconFontSwapper({ size = 16, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 13L5.5 3.5L8.5 13" />
      <line x1="3.8" y1="9.8" x2="7.2" y2="9.8" />
      <circle cx="12" cy="10.8" r="2.2" />
      <line x1="14.2" y1="8.6" x2="14.2" y2="13" />
    </svg>
  );
}

export function IconSpeedTyping({ size = 16, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
      <line x1="4.5" y1="6.5" x2="4.51" y2="6.5" strokeWidth="1.8" />
      <line x1="8" y1="6.5" x2="8.01" y2="6.5" strokeWidth="1.8" />
      <line x1="11.5" y1="6.5" x2="11.51" y2="6.5" strokeWidth="1.8" />
      <line x1="5" y1="9.5" x2="11" y2="9.5" />
    </svg>
  );
}

export function IconAsciiArt({ size = 16, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="12" height="12" rx="1" />
      <line x1="6" y1="2" x2="6" y2="14" />
      <line x1="10" y1="2" x2="10" y2="14" />
      <line x1="2" y1="6" x2="14" y2="6" />
      <line x1="2" y1="10" x2="14" y2="10" />
    </svg>
  );
}

export function IconMusic({ size = 16, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 11.5V4l7-1.5v8" />
      <circle cx="4.5" cy="11.5" r="2" />
      <circle cx="11.5" cy="10.5" r="2" />
    </svg>
  );
}

export function IconBlueprintMode({ size = 16, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="4.5" width="13" height="7" rx="1" />
      <line x1="4.5" y1="4.5" x2="4.5" y2="7.5" />
      <line x1="7" y1="4.5" x2="7" y2="9" />
      <line x1="9.5" y1="4.5" x2="9.5" y2="7.5" />
      <line x1="12" y1="4.5" x2="12" y2="9" />
    </svg>
  );
}

export function IconUiSounds({ size = 16, className = '', isEnabled = false }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3.5L3.5 6.5H1.5v3h2L7 12.5V3.5z" />
      {isEnabled ? (
        <>
          <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5" />
          <path d="M12.5 3.5a6.5 6.5 0 0 1 0 9" />
        </>
      ) : (
        <>
          <line x1="10.5" y1="6.5" x2="13.5" y2="9.5" />
          <line x1="13.5" y1="6.5" x2="10.5" y2="9.5" />
        </>
      )}
    </svg>
  );
}

export function IconWin98({ size = 16, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2.5" width="12" height="9" rx="1" />
      <line x1="8" y1="11.5" x2="8" y2="14" />
      <line x1="5" y1="14" x2="11" y2="14" />
    </svg>
  );
}

export function IconCommand({ size = 13, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

export function IconArrow({ size = 12, className = '', direction = 'right' }) {
  const transform =
    direction === 'left'
      ? 'rotate(180deg)'
      : direction === 'up'
      ? 'rotate(-90deg)'
      : direction === 'down'
      ? 'rotate(90deg)'
      : undefined;

  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      style={transform ? { transform } : undefined}
    >
      <line x1="2" y1="7" x2="11" y2="7" />
      <polyline points="7 3 11 7 7 11" />
    </svg>
  );
}

export function IconPlus({ size = 10, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <line x1="5" y1="1" x2="5" y2="9" />
      <line x1="1" y1="5" x2="9" y2="5" />
    </svg>
  );
}

/**
 * EditorialCornerTicks
 * Technical 1px CAD corner crosshairs (+) placed precisely at the 4 corners of bordered containers.
 */
export function EditorialCornerTicks({ className = '', color = 'currentColor' }) {
  return (
    <div className={`editorial-corner-ticks ${className}`} aria-hidden="true">
      <svg className="corner-tick tick-tl" width="10" height="10" viewBox="0 0 10 10">
        <line x1="5" y1="0" x2="5" y2="10" stroke={color} strokeWidth="1" />
        <line x1="0" y1="5" x2="10" y2="5" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="corner-tick tick-tr" width="10" height="10" viewBox="0 0 10 10">
        <line x1="5" y1="0" x2="5" y2="10" stroke={color} strokeWidth="1" />
        <line x1="0" y1="5" x2="10" y2="5" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="corner-tick tick-bl" width="10" height="10" viewBox="0 0 10 10">
        <line x1="5" y1="0" x2="5" y2="10" stroke={color} strokeWidth="1" />
        <line x1="0" y1="5" x2="10" y2="5" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="corner-tick tick-br" width="10" height="10" viewBox="0 0 10 10">
        <line x1="5" y1="0" x2="5" y2="10" stroke={color} strokeWidth="1" />
        <line x1="0" y1="5" x2="10" y2="5" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  );
}

/**
 * CadCrossBox
 * Square architectural CAD cell with 1px diagonal crossing lines (☒) matching ChainGPT Labs reference.
 */
export function CadCrossBox({ size = 26, className = '' }) {
  return (
    <div className={`editorial-cad-crossbox ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
        <rect x="0.5" y="0.5" width="25" height="25" stroke="currentColor" strokeWidth="1" />
        <line x1="0.5" y1="0.5" x2="25.5" y2="25.5" stroke="currentColor" strokeWidth="1" />
        <line x1="25.5" y1="0.5" x2="0.5" y2="25.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

/**
 * CadReticleNode
 * CAD alignment node with concentric target rings and crosshairs (◎) matching ChainGPT Labs reference.
 */
export function CadReticleNode({ size = 24, className = '' }) {
  return (
    <div className={`editorial-cad-reticle ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="0.5" y="0.5" width="23" height="23" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
        <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}

/**
 * CadColumnGrid
 * Full-height continuous 6-column architectural gridlines running through the window frame.
 * Divides the layout into 6 equal structural columns (at 16.666%, 33.333%, 50%, 66.666%, 83.333%).
 */
export function CadColumnGrid({ className = '' }) {
  return (
    <div className={`editorial-frame-column-grid ${className}`} aria-hidden="true">
      <div className="editorial-col-line col-line-1" />
      <div className="editorial-col-line col-line-2" />
      <div className="editorial-col-line col-line-3" />
      <div className="editorial-col-line col-line-4" />
      <div className="editorial-col-line col-line-5" />
    </div>
  );
}

/**
 * IconDesignFile
 * Figma-style icon for Design File theme in tools dropdown & mobile drawer.
 */
export function IconDesignFile({ size = 16, className = '' }) {
  return (
    <svg
      className={`editorial-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect width="16" height="16" rx="2.5" fill="#F24E1E" />
      <path d="M4 4h4v4H4zM8 4h4v4H8zM4 8h4v4H4zM8 8h4v4H8z" fill="#FFFFFF" fillOpacity="0.85" />
    </svg>
  );
}

export default EditorialCornerTicks;
