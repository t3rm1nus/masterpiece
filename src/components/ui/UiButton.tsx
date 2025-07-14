import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

// =============================================
// UiButton: Botón de UI reutilizable y moderno
// Botón de UI reutilizable y moderno. Optimizado para UX, accesibilidad y consistencia visual en toda la app.
// =============================================

/**
 * UiButton: Botón base reutilizable para toda la app.
 * Migrado a CSS-in-JS usando sx para variantes, tamaños y estados.
 */

interface UiButtonProps extends Omit<ButtonProps, 'variant' | 'color' | 'size'> {
  children?: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
  className?: string;
}

const variantStyles: Record<string, SxProps<Theme>> = {
  contained: {
    background: 'linear-gradient(90deg, #0078d4 60%, #005ea6 100%)',
    color: '#fff',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
    '&:hover': {
      background: 'linear-gradient(90deg, #005ea6 60%, #0078d4 100%)',
      boxShadow: '0 4px 16px 0 rgba(0,0,0,0.13)'
    },
    '&:active': {
      background: '#005ea6',
      boxShadow: 'none'
    }
  },
  outlined: {
    background: 'transparent',
    color: '#0078d4',
    border: '2px solid #0078d4',
    '&:hover': {
      background: '#e3f2fd',
      borderColor: '#005ea6',
      color: '#000' // Cambiado a negro en hover
    },
    '&:active': {
      background: '#bbdefb',
      borderColor: '#005ea6',
      color: '#005ea6'
    }
  },
  text: {
    background: 'none',
    color: '#0078d4',
    '&:hover': {
      background: '#e3f2fd',
      color: '#005ea6'
    },
    '&:active': {
      background: '#bbdefb',
      color: '#005ea6'
    }
  }
};

const sizeStyles: Record<string, SxProps<Theme>> = {
  small: { fontSize: '0.95rem', padding: '4px 14px', minHeight: 32 },
  medium: { fontSize: '1.05rem', padding: '8px 20px', minHeight: 40 },
  large: { fontSize: '1.15rem', padding: '12px 28px', minHeight: 48 }
};

const UiButton: React.FC<UiButtonProps> = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium', 
  icon, 
  sx = {}, 
  className = '', 
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      className={className}
      startIcon={icon}
      disableElevation
      sx={{
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: 'none',
        transition: 'all 0.2s',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default UiButton; 