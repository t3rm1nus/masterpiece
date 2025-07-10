import React from 'react';
import { Card, CardHeader, CardContent, CardActions, CardMedia, Box } from '@mui/material';

// =============================================================================
// UiCard (Reusable, Highly Customizable Card Component)
// -----------------------------------------------------------------------------
// Modern, modular, and highly customizable card for all app content.
// - Extends MUI Card for consistent design and performance.
// - Supports header, media, actions, footer, and flexible content.
// - Mobile-first, responsive, and accessible.
// - Optimized for performance and minimal re-renders.
//
// Example usage:
//   <UiCard header="Title" media={<img ... />} actions={<Button>Go</Button>}>
//     Content
//   </UiCard>
// -----------------------------------------------------------------------------
// =============================================================================

/**
 * UiCard: Tarjeta base reutilizable y altamente parametrizable para toda la app.
 * Centraliza estilos y variantes. Extiende MUI Card.
 *
 * Props:
 * - elevation: number (sombra de la tarjeta, default: 2)
 * - variant: 'elevation' | 'outlined' (variante visual, default: 'elevation')
 * - color: string (color de fondo, opcional)
 * - sx: object (estilos adicionales MUI sx)
 * - className: string (clase CSS adicional)
 * - style: object (estilos CSS adicionales)
 * - header: ReactNode (cabecera de la tarjeta, opcional)
 * - headerProps: object (props adicionales para CardHeader)
 * - media: ReactNode (zona de imagen/media, opcional)
 * - mediaProps: object (props adicionales para CardMedia o Box)
 * - actions: ReactNode (zona de acciones, opcional)
 * - actionsProps: object (props adicionales para CardActions)
 * - footer: ReactNode (pie de la tarjeta, opcional)
 * - footerProps: object (props adicionales para el footer)
 * - contentProps: object (props adicionales para CardContent)
 * - children: contenido principal de la tarjeta
 *
 * Ejemplo de uso:
 * <UiCard
 *   header={<span>Título</span>}
 *   media={<img src="/img.jpg" alt="img" style={{ width: '100%' }} />}
 *   actions={<Button>Acción</Button>}
 *   footer={<small>Pie</small>}
 * >Contenido</UiCard>
 */
const UiCard = ({
  children,
  elevation = 2,
  variant = 'elevation',
  color,
  sx = {},
  className = '',
  style = {},
  header,
  headerProps = {},
  media,
  mediaProps = {},
  actions,
  actionsProps = {},
  footer,
  footerProps = {},
  contentProps = {},
  ...props
}) => {
  // Permite forzar el background o backgroundImage según el valor de sx.background
  const mergedStyle = { ...style };
  if (color) mergedStyle.background = color;
  if (sx && sx.background) {
    if (typeof sx.background === 'string' && sx.background.startsWith('linear-gradient')) {
      mergedStyle.background = sx.background;
      mergedStyle.backgroundImage = sx.background;
    } else {
      mergedStyle.background = sx.background;
    }
  }
  if (style && style.backgroundImage && style.backgroundImage.startsWith('linear-gradient')) {
    mergedStyle.background = style.backgroundImage;
    mergedStyle.backgroundImage = style.backgroundImage;
  }
  return (
    <Card
      elevation={variant === 'elevation' ? elevation : 0}
      variant={variant}
      className={`mp-ui-card ${className}`}
      sx={{ borderRadius: 3, ...sx }}
      style={mergedStyle}
      {...props}
    >
      {header && <CardHeader {...headerProps} title={header} />}
      {media && (
        <Box {...mediaProps} sx={{ width: '100%', ...mediaProps.sx }}>{media}</Box>
      )}
      <CardContent {...contentProps}>{children}</CardContent>
      {actions && <CardActions {...actionsProps}>{actions}</CardActions>}
      {footer && <Box {...footerProps}>{footer}</Box>}
    </Card>
  );
};

export default UiCard;
