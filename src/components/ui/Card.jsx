import React from 'react';
import './Card.css';

// DEPRECATED: Usa UiCard en vez de este componente para unificación de cards.
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`mp-card ${className}`} {...props}>
      {children}
    </div>
  );
}
