import React from 'react';
import './Layout.css';

// DEPRECATED: Usa UiLayout en vez de este componente para unificación de layouts.
export default function Layout({ children, className = '', ...props }) {
  return (
    <div className={`mp-layout ${className}`} {...props}>
      {children}
    </div>
  );
}
