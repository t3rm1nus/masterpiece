// =============================================
// SharedComponents: Colección de componentes reutilizables y utilitarios
// Colección de componentes reutilizables y utilitarios para la app.
// Optimizados para modularidad, performance y accesibilidad.
// =============================================

import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Box, Typography, SxProps, Theme } from '@mui/material';

interface OptimizedImageProps {
  src: string;
  alt: string;
  sx?: SxProps<Theme>;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  fallback?: string;
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  [key: string]: any;
}

// Componente de imagen optimizada
export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  sx = {}, 
  loading = 'lazy', 
  decoding = 'async', 
  fallback, 
  border = false, 
  borderColor = '#eee', 
  borderWidth = 2, 
  ...props 
}) => (
  <Box
    sx={{
      display: 'inline-block',
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: 0,
      p: 0,
      m: 0,
      border: border ? `${borderWidth}px solid ${borderColor}` : undefined,
      ...sx
    }}
  >
    <Box
      component="img"
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => { 
        if (fallback) e.currentTarget.src = fallback; 
      }}
      sx={{
        display: 'block',
        width: '100%',
        height: 'auto',
        borderRadius: 3,
        m: 0,
        p: 0
      }}
      {...props}
    />
  </Box>
);

interface MasterpieceBadgeConfig {
  svg: {
    viewBox: string;
    fill: string;
    xmlns: string;
  };
  circle: {
    cx: number;
    cy: number;
    r: number;
    fill: string;
  };
  star: {
    d: string;
    fill: string;
  };
}

interface MasterpieceBadgeProps {
  config: MasterpieceBadgeConfig;
  tooltip?: string;
  size?: number;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

// Componente del badge de obra maestra
export const MasterpieceBadge: React.FC<MasterpieceBadgeProps> = ({ 
  config, 
  tooltip, 
  size = 56, 
  sx = {}, 
  ...props 
}) => {
  const { getTranslation } = useLanguage();
  return (
    <Box
      title={tooltip || getTranslation('ui.badges.masterpiece', 'Obra maestra')}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle', ...sx }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={config.svg.viewBox}
        fill={config.svg.fill}
        xmlns={config.svg.xmlns}
      >
        <circle
          cx={config.circle.cx}
          cy={config.circle.cy}
          r={config.circle.r}
          fill={config.circle.fill}
        />
        <path
          d={config.star.d}
          fill={config.star.fill}
        />
      </svg>
    </Box>
  );
};

interface CategoryLabelsProps {
  category: string;
  subcategory?: string;
  getCategoryTranslation: (category: string) => string;
  getSubcategoryTranslation: (subcategory: string, category: string) => string;
  renderCategory?: (category: string) => React.ReactNode;
  renderSubcategory?: (subcategory: string, category: string) => React.ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

// Componente para mostrar categorías
export const CategoryLabels: React.FC<CategoryLabelsProps> = ({ 
  category, 
  subcategory, 
  getCategoryTranslation, 
  getSubcategoryTranslation, 
  renderCategory, 
  renderSubcategory, 
  sx = {}, 
  ...props 
}) => (
  <Box sx={{ textAlign: 'center', ...sx }} {...props}>
    {renderCategory
      ? renderCategory(category)
      : <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>{getCategoryTranslation(category)}</Typography>}
    {subcategory && (
      renderSubcategory
        ? renderSubcategory(subcategory, category)
        : <Typography variant="caption" sx={{ fontSize: '0.95em', color: '#666', textAlign: 'center' }}>{getSubcategoryTranslation(subcategory, category)}</Typography>
    )}
  </Box>
);

interface NoResultsProps {
  t?: any; // Translation function (legacy)
  randomNotFoundImage?: () => string;
  image?: string;
  text?: string;
  subtext?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

// Componente para vista "sin resultados"
export const NoResults: React.FC<NoResultsProps> = ({ 
  t, 
  randomNotFoundImage, 
  image, 
  text, 
  subtext, 
  children, 
  sx = {}, 
  ...props 
}) => {
  const { getTranslation } = useLanguage();
  const notFoundImageUrl = image || (randomNotFoundImage?.() || '/favicon.png');
  return (
    <Box sx={{ textAlign: 'center', p: 2, color: 'text.secondary', ...sx }} {...props}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{text || getTranslation('ui.states.noResults', 'No se encontraron resultados')}</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{subtext || getTranslation('ui.states.try_other_filters', 'Prueba con otros filtros o categorías')}</Typography>
      <Box
        component="img"
        src={notFoundImageUrl}
        alt={getTranslation('ui.states.noResults', 'No se encontraron resultados')}
        sx={{ maxWidth: '90vw', width: '100%', height: 'auto', borderRadius: 2, boxShadow: 2, my: 2 }}
      />
      {children}
    </Box>
  );
};