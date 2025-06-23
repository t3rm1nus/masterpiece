import React from 'react';
import { Container, Box } from '@mui/material';

/**
 * UiLayout: Contenedor base para páginas y secciones.
 * Centraliza el layout principal. Extiende MUI Container.
 *
 * Props:
 * - maxWidth: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' (ancho máximo del contenedor, default: false)
 * - sx: object (estilos adicionales MUI sx)
 * - className: string (clase CSS adicional)
 * - children: contenido del layout
 *
 * Ejemplo de uso:
 * <UiLayout maxWidth="md" sx={{ bgcolor: '#fafafa' }}>Contenido</UiLayout>
 */
const UiLayout = ({ children, maxWidth = false, sx = {}, className = '', ...props }) => {
  // Detectar móvil
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: isMobile ? 0 : 3, // Quitar padding top solo en móviles
        width: '100vw',
        maxWidth: '100vw',
        px: 0,
        ...sx
      }}
      className={className}
      {...props}
    >
      <Box className="mp-ui-layout" sx={{ width: '100%' }}>
        {children}
      </Box>
    </Container>
  );
};

export default UiLayout;
