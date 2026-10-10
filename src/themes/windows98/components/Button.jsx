import React, { useState } from 'react';

export default function Button({
  children,
  onClick,
  style = {},
  className = '',
  id,
  preferred = false,
  focused = false,
  disabled = false,
  autoFocus = false,
  type = 'button',
  ...rest
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [internalFocused, setInternalFocused] = useState(focused || autoFocus);

  const isActuallyFocused = focused || internalFocused;

  return (
    <button
      id={id}
      type={type}
      className={`win98-btn ${preferred ? 'btn-preferred' : ''} ${isActuallyFocused ? 'is-focused' : ''} ${isPressed ? 'is-pressed' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      style={style}
      disabled={disabled}
      autoFocus={autoFocus}
      onFocus={(e) => {
        setInternalFocused(true);
        if (rest.onFocus) rest.onFocus(e);
      }}
      onBlur={(e) => {
        setInternalFocused(false);
        if (rest.onBlur) rest.onBlur(e);
      }}
      onMouseDown={(e) => {
        if (!disabled) setIsPressed(true);
        if (rest.onMouseDown) rest.onMouseDown(e);
      }}
      onMouseUp={(e) => {
        setIsPressed(false);
        if (rest.onMouseUp) rest.onMouseUp(e);
      }}
      onMouseLeave={(e) => {
        setIsPressed(false);
        if (rest.onMouseLeave) rest.onMouseLeave(e);
      }}
      onTouchStart={(e) => {
        if (!disabled) setIsPressed(true);
        if (rest.onTouchStart) rest.onTouchStart(e);
      }}
      onTouchEnd={(e) => {
        setIsPressed(false);
        if (rest.onTouchEnd) rest.onTouchEnd(e);
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          setIsPressed(true);
        }
        if (rest.onKeyDown) rest.onKeyDown(e);
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          setIsPressed(false);
        }
        if (rest.onKeyUp) rest.onKeyUp(e);
      }}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-content">
        {children}
      </span>
      <span className="btn-focus-rect" aria-hidden="true" />
    </button>
  );
}
