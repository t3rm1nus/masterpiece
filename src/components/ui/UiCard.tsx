import React from 'react';
import { Card, CardHeader, CardContent, CardActions, CardMedia, Box, CardProps, CardHeaderProps, CardContentProps, CardActionsProps, BoxProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

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

interface UiCardProps extends Omit<CardProps, 'elevation' | 'variant'> {
  children?: React.ReactNode;
  elevation?: number;
  variant?: 'elevation' | 'outlined';
  color?: string;
  sx?: SxProps<Theme>;
  className?: string;
  style?: React.CSSProperties;
  header?: React.ReactNode;
  headerProps?: Partial<CardHeaderProps>;
  media?: React.ReactNode;
  mediaProps?: Partial<BoxProps>;
  actions?: React.ReactNode;
  actionsProps?: Partial<CardActionsProps>;
  footer?: React.ReactNode;
  footerProps?: Partial<BoxProps>;
  contentProps?: Partial<CardContentProps>;
}

const UiCard = React.forwardRef<HTMLDivElement, UiCardProps>(({
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
}, ref) => {
  // Permite forzar el background o backgroundImage según el valor de sx.background
  const mergedStyle: React.CSSProperties = { ...style };
  
  if (color) mergedStyle.background = color;
  
  if (sx && typeof sx === 'object' && 'background' in sx) {
    const backgroundValue = sx.background as string;
    if (typeof backgroundValue === 'string' && backgroundValue.startsWith('linear-gradient')) {
      mergedStyle.background = backgroundValue;
      mergedStyle.backgroundImage = backgroundValue;
    } else {
      mergedStyle.background = backgroundValue;
    }
  }
  
  if (style && style.backgroundImage && typeof style.backgroundImage === 'string' && style.backgroundImage.startsWith('linear-gradient')) {
    mergedStyle.background = style.backgroundImage;
    mergedStyle.backgroundImage = style.backgroundImage;
  }
  
  return (
    <Card
      ref={ref}
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
});

export default UiCard; 