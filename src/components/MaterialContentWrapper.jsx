import React, { useState, useEffect } from 'react';
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
  categoryColor,
  renderCategoryButton,
  renderSubcategoryChip,
  categorySelectSx,
  subcategoryChipsSx,
  categorySelectProps = {},
  subcategoryChipsProps = {},
  visible = true,
  showCategorySelect = true,
  showSubcategoryChips = true,
  showCategoryBar, // ignorar si llega
  showSubcategoryBar, // ignorar si llega
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { t, getTranslation } = useLanguage();
  const { randomNotFoundImage } = useAppData();
  if (!visible) return null;
  // Si no es móvil, renderizar el contenido original
  if (!isMobile) {
    return children;
  }
  // En móviles, usar componentes Material UI parametrizables
  // Animación de entrada/salida para las cards en móvil
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  useEffect(() => {
    if (recommendations && Array.isArray(recommendations)) {
      // Animación de entrada secuencial
      setVisibleIndexes([]);
      recommendations.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleIndexes(prev => [...prev, idx]);
        }, 60 * idx);
      });
    }
  }, [recommendations]);

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100vw',
      padding: '0 4px',
      paddingTop: '64px',
      boxSizing: 'border-box',
      ...props.sx
    }} {...(() => {
      // Eliminar props que no deben ir al DOM
      const { showCategoryBar, showSubcategoryBar, showCategorySelect, showSubcategoryChips, ...restProps } = props;
      return restProps;
    })()}>
      {/* Select de categorías parametrizable */}
      {showCategorySelect && categories && (
        <MaterialCategorySelect
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryClick}
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          renderButton={renderCategoryButton}
          renderChip={renderSubcategoryChip}
          sx={categorySelectSx}
          {...categorySelectProps}
        />
      )}
      {/* Chips de subcategorías parametrizables (opcional, si se quiere mostrar además del select) */}
      {showSubcategoryChips && subcategories && (
        <MaterialSubcategoryChips
          subcategories={subcategories}
          value={activeSubcategory}
          onChange={onSubcategoryClick}
          renderChip={renderSubcategoryChip}
          sx={subcategoryChipsSx}
          {...subcategoryChipsProps}
        />
      )}
      {/* Lista de recomendaciones Material UI */}
      {recommendations && Array.isArray(recommendations) && recommendations.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isHome ? '12px' : '24px',
            padding: '4px',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {recommendations.map((recommendation, index) => (
            <div
              key={recommendation.globalId || `${recommendation.title}-${index}`}
              className={`recommendation-card${visibleIndexes.includes(index) ? '' : ' entering'}`}
              style={{ width: '100%' }}
            >
              <MaterialRecommendationCard
                recommendation={recommendation}
                isHome={isHome}
              />
            </div>
          ))}
        </Box>
      )}
      {/* Empty state */}
      {(!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) && (
        <Box sx={{ 
          textAlign: 'center', 
          padding: isMobile ? 0 : '2rem',
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? 0 : '1rem'
        }}>
          <Typography variant="h6" sx={{ margin: 0, padding: 0 }}>
            {t.no_results || 'No se encontraron resultados'}
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, padding: 0 }}>
            {t.try_different_filters || 'Intenta cambiar los filtros seleccionados'}
          </Typography>
          <Box
            component="img"
            src={randomNotFoundImage()}
            alt={getTranslation('ui.states.noResults', 'No se encontraron resultados')}
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
