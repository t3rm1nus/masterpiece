import React from 'react';
import './Alert.css';

export default function Alert({ children, type = 'info', className = '', ...props }) {
  return (
    <div className={`mp-alert mp-alert--${type} ${className}`} {...props}>
      {children}
    </div>
  );
}
