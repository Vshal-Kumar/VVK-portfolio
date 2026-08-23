import React from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      id="toastNotification"
      className={`toast-popup active ${isSuccess ? 'is-success' : 'is-error'}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {isSuccess ? (
          <Check className="toast-svg icon-success" size={18} strokeWidth={2.4} />
        ) : (
          <AlertCircle className="toast-svg icon-error" size={18} strokeWidth={2.4} />
        )}
      </div>
      <span className="toast-text" id="toastText">
        {toast.message}
      </span>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
