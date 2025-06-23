import React from 'react';
import './Button.css';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`mp-btn mp-btn--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
