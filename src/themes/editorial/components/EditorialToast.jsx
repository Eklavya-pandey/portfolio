import React from 'react';

export default function EditorialToast({ toast }) {
  if (!toast) return null;

  return (
    <div className="editorial-toast" role="status" aria-live="polite">
      <div className="editorial-toast-icon">✓</div>
      <div className="editorial-toast-content">
        <span className="editorial-toast-title">{toast.title || 'SYSTEM ACTION'}</span>
        <span className="editorial-toast-message">{toast.message}</span>
      </div>
      <div className="editorial-toast-progress" />
    </div>
  );
}
