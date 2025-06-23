import React from 'react';
import { Button as MuiButton } from '@mui/material';

/**
 * UiButton: Botón base reutilizable para toda la app.
 * Centraliza estilos y variantes. Extiende MUI Button.
 *
 * Props:
 * - variant: 'contained' | 'outlined' | 'text' (variante visual del botón, default: 'contained')
 * - color: string (color del botón, default: 'primary')
 * - size: 'small' | 'medium' | 'large' (tamaño del botón, default: 'medium')
 * - icon: ReactNode (icono opcional a la izquierda del contenido)
 * - onClick: function (callback al hacer click)
 * - sx: object (estilos adicionales MUI sx)
 * - className: string (clase CSS adicional)
 * - children: contenido del botón
 *
 * Ejemplo de uso:
 * <UiButton variant="outlined" color="secondary" onClick={handleClick} icon={<MyIcon />}>Aceptar</UiButton>
 */
const UiButton = ({ children, variant = 'contained', color = 'primary', size = 'medium', icon, sx = {}, className = '', ...props }) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      className={className}
      startIcon={icon}
      sx={{
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: 'none',
        ...sx // sx debe ir al final para sobrescribir cualquier valor por defecto
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default UiButton;
