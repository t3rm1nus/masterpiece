import React from 'react';
import { Box } from '@mui/material';

export default function Chip({
  icon,
  label,
  variant,
  selected = false,
  className = '',
  children,
  sx = {},
  ...props
}) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        padding: '0.3em 1em',
        borderRadius: '16px',
        background: selected ? '#0078d4' : (variant === 'outlined' ? 'transparent' : '#f5f5f5'),
        color: selected ? '#fff' : '#333',
        fontSize: '0.95em',
        margin: '0 0.3em 0.3em 0',
        cursor: 'pointer',
        border: variant === 'outlined'
          ? '1.5px solid currentColor'
          : (selected ? '1px solid #0078d4' : '1px solid #e0e0e0'),
        transition: 'background 0.2s, border 0.2s, color 0.2s',
        '&:hover': {
          background: selected ? '#0078d4' : '#e3f2fd',
          borderColor: selected ? '#0078d4' : '#90caf9',
        },
        ...sx
      }}
      className={className}
      {...props}
    >
      {icon ? (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '0.45em',
            fontSize: '1.1em',
            verticalAlign: 'middle',
          }}
        >
          {icon}
        </Box>
      ) : null}
      {label !== undefined ? label : children}
    </Box>
  );
}
