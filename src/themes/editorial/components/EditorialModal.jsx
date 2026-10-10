import React, { useEffect, useRef } from 'react';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks, IconClose } from './EditorialIcons';

/**
 * EditorialModal
 * Accessible, reusable modal container matching Editorial technical aesthetic.
 * Focus trap, Escape-to-close, full responsive scaling, and SFX feedback.
 */
export default function EditorialModal({
  isOpen,
  onClose,
  title,
  shortcutHint = 'ESC',
  size = 'medium', // 'medium' | 'large'
  children
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on exit
    previousFocusRef.current = document.activeElement;
    editorialAudio.playOpen();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        editorialAudio.playClose();
        onClose();
        return;
      }

      // Trap focus inside modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll on background
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first focusable element or modal container
    setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 40);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="editorial-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          editorialAudio.playClose();
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className={`editorial-modal-container editorial-modal-${size}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editorial-modal-title"
        tabIndex={-1}
      >
        <EditorialCornerTicks />
        {/* Header bar */}
        <div className="editorial-modal-header">
          <div className="editorial-modal-header-left">
            <span className="editorial-modal-tag-pill">INTERACTIVE TOOL</span>
            <h2 id="editorial-modal-title" className="editorial-modal-title">
              {title}
            </h2>
          </div>

          <div className="editorial-modal-header-right">
            {shortcutHint && (
              <span className="editorial-modal-shortcut-badge">{shortcutHint}</span>
            )}
            <button
              type="button"
              className="editorial-modal-close-btn"
              onClick={() => {
                editorialAudio.playClose();
                onClose();
              }}
              aria-label="Close dialog"
            >
              <IconClose size={12} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="editorial-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
