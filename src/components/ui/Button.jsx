import React from 'react';
import './Button.css';

// DEPRECATED: Usa UiButton en vez de este componente para unificación de botones.
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`mp-btn mp-btn--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
