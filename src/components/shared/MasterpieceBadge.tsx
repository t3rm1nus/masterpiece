import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface MasterpieceBadgeProps {
  alt?: string;
  title?: string;
  sx?: SxProps<Theme>;
  absolute?: boolean;
  size?: number;
}

// =============================================
// MasterpieceBadge: Badge visual de obra maestra
// Badge visual para destacar una obra maestra. Optimizado para accesibilidad y visualización destacada.
// =============================================

/**
 * MasterpieceBadge
 * Badge visual para destacar una obra maestra sobre la imagen de detalle.
 * Props:
 * - alt: texto alternativo para accesibilidad
 * - title: tooltip accesible
 * - sx: estilos adicionales (opcional)
 * - absolute: si true, usa position absolute arriba a la derecha (por defecto true)
 * - size: tamaño del icono en px (por defecto 48)
 */
const MasterpieceBadge: React.FC<MasterpieceBadgeProps> = ({
  alt = 'Obra maestra',
  title = 'Obra maestra',
  sx = {},
  absolute = true,
  size = 48
}) => (
  <Box
    title={title}
    sx={{
      position: absolute ? 'absolute' : 'static',
      top: absolute ? -27 : undefined,
      right: absolute ? -23 : undefined,
      zIndex: 1201, // más alto que el detalle
      background: 'rgba(255,255,255,0.85)', // fondo blanco semitransparente
      border: '2px solid #ffd700', // borde dorado sutil
      borderRadius: '50%',
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)', // sombra suave
      p: 0.5,
      m: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: { xs: size + 8, sm: size + 16 },
      height: { xs: size + 8, sm: size + 16 },
      ...sx
    }}
  >
    <img
      src="https://github.com/t3rm1nus/masterpiece/raw/main/public/imagenes/masterpiece-star.png"
      alt={alt}
      style={{ width: '80%', height: '80%', display: 'block' }}
      loading="lazy"
    />
  </Box>
);

export default MasterpieceBadge; 