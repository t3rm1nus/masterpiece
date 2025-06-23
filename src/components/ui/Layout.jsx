import React from 'react';
import './Layout.css';

export default function Layout({ children, className = '', ...props }) {
  return (
    <div className={`mp-layout ${className}`} {...props}>
      {children}
    </div>
  );
}
