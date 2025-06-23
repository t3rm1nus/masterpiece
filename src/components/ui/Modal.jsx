import React from 'react';
import './Modal.css';

export default function Modal({ open, onClose, children, className = '', ...props }) {
  if (!open) return null;
  return (
    <div className={`mp-modal-backdrop`} onClick={onClose}>
      <div className={`mp-modal ${className}`} onClick={e => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  );
}
