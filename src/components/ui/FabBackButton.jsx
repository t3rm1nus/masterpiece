import React from 'react';
import { Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

/**
 * FabBackButton
 * Botón flotante de retroceso parametrizable.
 *
 * Props:
 * - icon: ReactNode (icono personalizado, default: ArrowBackIcon)
 * - color: string (color del botón, default: 'primary')
 * - size: 'small' | 'medium' | 'large' (tamaño, default: 'medium')
 * - sx: objeto de estilos MUI (posición, etc.)
 * - onClick: función (callback al hacer click)
 * - visible: boolean (si se muestra el botón, default: true)
 * - ariaLabel: string (accesibilidad, default: 'volver')
 * - ...props: cualquier otro prop de MUI Fab
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
        zIndex: 1000,
        ...sx
      }}
      {...props}
    >
      {icon || <ArrowBackIcon />}
    </Fab>
  );
};

export default FabBackButton;
