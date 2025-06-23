import React from 'react';
import './Card.css';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`mp-card ${className}`} {...props}>
      {children}
    </div>
  );
}
