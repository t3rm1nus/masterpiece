import React from 'react';
import { Fab, FabProps } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * FabBackButton (Floating Action Back Button)
 * -----------------------------------------------------------------------------
 * Mobile-first floating action button for back navigation.
 * - Uses MUI Fab and ArrowBackIcon by default.
 * - Highly visible, fixed position for easy thumb reach on mobile.
 * - Customizable icon, color, size, and position.
 *
 * Performance & Mobile Optimizations:
 * - Only renders when visible=true (default).
 * - Fixed position for persistent access on mobile/desktop.
 * - Minimal logic, no unnecessary re-renders.
 *
 * Accessibility:
 * - ARIA label for screen readers (default: 'volver').
 * - Fully keyboard and screen reader accessible.
 *
 * Example usage:
 *   <FabBackButton onClick={...} />
 *
 * -----------------------------------------------------------------------------
 */

interface FabBackButtonProps extends Omit<FabProps, 'onClick'> {
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
  onClick?: () => void;
  visible?: boolean;
  ariaLabel?: string;
}

const FabBackButton: React.FC<FabBackButtonProps> = ({
  icon,
  color = 'primary',
  size = 'medium',
  sx = {},
  onClick,
  visible = true,
  ariaLabel = 'volver',
  ...props
}) => {
  const theme = useTheme();
  
  if (!visible) return null;
  
  return (
    <Fab
      color={color}
      size={size}
      aria-label={ariaLabel}
      onClick={onClick}
      sx={{
        position: 'fixed',
        top: '80px',
        left: '16px',
        zIndex: 1100, // FAB de volver - por encima del contenido pero por debajo del AppBar
        backgroundColor: theme.palette.primary.main,
        transition: 'none',
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
          transform: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
        },
        ...sx
      }}
      {...props}
    >
      {icon || <ArrowBackIcon />}
    </Fab>
  );
};

export default FabBackButton; 