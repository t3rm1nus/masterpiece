import React from 'react';
import { Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

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
const FabBackButton = ({
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
        ...sx
      }}
      {...props}
    >
      {icon || <ArrowBackIcon />}
    </Fab>
  );
};

export default FabBackButton;
