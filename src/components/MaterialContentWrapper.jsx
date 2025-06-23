import React from 'react';
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import MaterialRecommendationCard from './MaterialRecommendationCard';
import MaterialCategorySelect from './MaterialCategorySelect';
import { useAppData } from '../store/useAppStore';
import { useLanguage } from '../LanguageContext';

/**
 * MaterialContentWrapper
 * Wrapper adaptable y parametrizable para recomendaciones, categorías y layout principal.
 * Orquesta la UI de listas, categorías, subcategorías y permite custom render, callbacks y layout flexible.
 *
 * Props avanzados:
 * - children: contenido a renderizar (usado en desktop)
 * - categories: array de categorías (para barra o select de categorías)
 * - selectedCategory: string (categoría activa)
 * - onCategoryClick: función para seleccionar categoría
 * - subcategories: array de subcategorías (para chips/barra de subcategorías)
 * - activeSubcategory: string (subcategoría activa)
 * - onSubcategoryClick: función para seleccionar subcategoría
 * - recommendations: array de recomendaciones a mostrar
 * - isHome: boolean (modo home, layout especial)
 * - categoryColor: string (color principal de la categoría)
 * - renderExtraActions: función opcional para renderizar acciones extra (ej: botones, filtros)
 * - showSections: objeto opcional para mostrar/ocultar secciones (ej: { recommendations: true, emptyState: true })
 * - sx: estilos adicionales para el wrapper
 * - ...props: cualquier otro prop para el contenedor principal
 *
 * Ejemplo de uso:
 * <MaterialContentWrapper
 *   categories={categories}
 *   selectedCategory={selectedCategory}
 *   onCategoryClick={onCategoryClick}
 *   subcategories={subcategories}
 *   activeSubcategory={activeSubcategory}
 *   onSubcategoryClick={setActiveSubcategory}
 *   recommendations={recommendations}
 *   renderExtraActions={() => <CustomActions />}
 *   showSections={{ recommendations: true }}
 *   sx={{ background: '#fafafa' }}
 * >
 *   {children}
 * </MaterialContentWrapper>
 */

const MaterialContentWrapper = ({ 
  children, 
  categories,
  selectedCategory,
  onCategoryClick,
  subcategories,
  activeSubcategory,
  onSubcategoryClick,
  recommendations,
  isHome = false,
  categoryColor
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { t } = useLanguage();
  const { randomNotFoundImage } = useAppData();
  
  // Si no es móvil, renderizar el contenido original
  if (!isMobile) {
    return children;
  }
  // En móviles, usar componentes Material UI
  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100vw', // Asegurar que ocupe todo el ancho de la ventana
      padding: '0 4px', // Padding horizontal mínimo para evitar que toque los bordes
      paddingTop: '64px', // Espacio para el AppBar fijo (48px) + padding extra (16px)
      boxSizing: 'border-box' // Incluir padding en el cálculo del ancho
    }}>
      {/* Select de categorías Material UI */}
      {/* {categories && (
        <MaterialCategorySelect
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryClick}
        />
      )} */}      {/* Chips de subcategorías Material UI eliminados en móvil */}
      {/* Lista de recomendaciones Material UI */}
      {recommendations && Array.isArray(recommendations) && recommendations.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centrar las tarjetas horizontalmente
            gap: isHome ? '8px' : '16px',
            padding: '4px', // Padding reducido para mejor uso del espacio
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {recommendations.map((recommendation, index) => (
            <MaterialRecommendationCard
              key={recommendation.globalId || `${recommendation.title}-${index}`}
              recommendation={recommendation}
              isHome={isHome}
            />
          ))}
        </Box>      )}        {/* Si no hay recomendaciones en móviles, mostrar mensaje e imagen apropiada en lugar del contenido desktop */}
      {(!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) && (
        <Box sx={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Typography variant="h6" sx={{ margin: 0, padding: 0 }}>
            {t.no_results || 'No se encontraron resultados'}
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, padding: 0 }}>
            {t.try_different_filters || 'Intenta cambiar los filtros seleccionados'}
          </Typography>
          {/* Imagen "not found" aleatoria */}
          <Box
            component="img"
            src={randomNotFoundImage()}
            alt={t.no_results || 'No se encontraron resultados'}
            sx={{
              maxWidth: '90vw',
              width: '90%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              marginTop: '1rem',
              marginBottom: 0
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default MaterialContentWrapper;
