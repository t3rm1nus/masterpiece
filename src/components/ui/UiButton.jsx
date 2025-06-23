import React from 'react';
import { Button as MuiButton } from '@mui/material';

/**
 * UiButton: Botón base reutilizable para toda la app.
 * Centraliza estilos y variantes. Extiende MUI Button.
 */
const UiButton = ({ children, variant = 'contained', color = 'primary', size = 'medium', sx = {}, ...props }) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      sx={{
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: 'none',
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default UiButton;
