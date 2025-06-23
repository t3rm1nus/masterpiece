import React from 'react';
import './Chip.css';

export default function Chip({
  icon,
  label,
  variant,
  selected = false,
  className = '',
  children,
  ...props
}) {
  return (
    <span
      className={`mp-chip${selected ? ' mp-chip--selected' : ''}${variant === 'outlined' ? ' mp-chip--outlined' : ''} ${className}`}
      {...props}
    >
      {icon ? <span className="mp-chip__icon">{icon}</span> : null}
      {label !== undefined ? label : children}
    </span>
  );
}
