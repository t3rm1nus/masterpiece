import React, { useState, useEffect } from 'react';
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import MaterialRecommendationCard from './MaterialRecommendationCard';
import MaterialCategorySelect from './MaterialCategorySelect';
import MaterialSubcategoryChips from './MaterialSubcategoryChips';
import { useAppData } from '../store/useAppStore';
import { useLanguage } from '../LanguageContext';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import CircularProgress from '@mui/material/CircularProgress';
import { randomNotFoundImage } from '../store/utils';

// =============================================
// MaterialContentWrapper: Wrapper de contenido Material UI
// Gestiona layout responsive, animaciones y soporte para infinite scroll y empty states.
// Optimizado para móviles y desktop.
// =============================================

// --- Estilos centralizados ---
const wrapperSx = (propsSx = {}, isMobile = false) => ({
  width: '100%',
  maxWidth: '100vw',
  padding: '0 4px',
  boxSizing: 'border-box',
  ...(isMobile ? { position: 'relative', zIndex: 1 } : {}), // SOLO en móviles
  ...propsSx
});

const recommendationsListSx = isHome => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: isHome ? '12px' : '24px',
  padding: '4px',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box'
});

const sentinelSx = loaderColor => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 2,
  background: loaderColor + '22',
  border: `1px dashed ${loaderColor}`,
  borderRadius: 8,
  margin: 1
});

const emptyStateSx = isMobile => ({
  textAlign: 'center',
  padding: isMobile ? 0 : '2rem',
  color: 'text.secondary',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center', // <-- centrado vertical
  gap: isMobile ? 0 : '1rem',
  height: isMobile ? 'auto' : '100%', // asegura centrado vertical en desktop
});

const emptyImgSx = {
  maxWidth: '90vw',
  width: '100%',
  height: 'auto',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginTop: '1rem',
  marginBottom: 0,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

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
  onLoadMore, // NUEVO: callback para infinite scroll
  hasMore,    // NUEVO: si hay más para infinite scroll
  loadingMore, // NUEVO: si está cargando más
  onItemClick, // <-- NUEVO: handler de click en item
  currentPage = 1, // <--- NUEVA PROP para preservar estado de infinite scroll
  totalItems = 0, // <--- NUEVA PROP para preservar estado de infinite scroll
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { t, getTranslation } = useLanguage();
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
      if (isMobile && visibleIndexes.length === 0) {
        // Solo hacer animación secuencial si no hay índices visibles (primera carga)
        setVisibleIndexes([]);
        recommendations.forEach((_, idx) => {
          setTimeout(() => {
            setVisibleIndexes(prev => [...prev, idx]);
          }, 60 * idx);
        });
      } else if (!isMobile && visibleIndexes.length === 0) {
        // Desktop: animación secuencial solo en primera carga
        setVisibleIndexes([]);
        recommendations.forEach((_, idx) => {
          setTimeout(() => {
            setVisibleIndexes(prev => [...prev, idx]);
          }, 60 * idx);
        });
      }
    }
  }, [recommendations, isMobile, visibleIndexes.length, selectedCategory]);

  // Resetear animaciones cuando cambia la categoría
  useEffect(() => {
    if (recommendations && Array.isArray(recommendations)) {
      setVisibleIndexes([]);
    }
  }, [selectedCategory]);

  // Infinite scroll para móvil y desktop cuando hay categorías específicas
  const { sentinelRef } = useInfiniteScroll(
    onLoadMore || (() => {}),
    !!hasMore,
    !!loadingMore
  );

  // Forzar overflow visible y stacking alto SOLO en iPhone/iPad
  const isIphone = typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(window.navigator.userAgent);
  const wrapperSxFinal = {
    ...wrapperSx(props.sx, isMobile),
    ...(isIphone ? { overflow: 'visible !important', zIndex: 1, position: 'relative' } : {}), // Por debajo del menú superior (1200)
  };

  return (
    <Box sx={wrapperSxFinal} {...(() => {
      // Eliminar props que no deben ir al DOM
      const { showCategoryBar, showSubcategoryBar, showCategorySelect, showSubcategoryChips, ...restProps } = props;
      return restProps;
    })()}>
      {/* Select de categorías parametrizable SOLO en desktop o si showCategorySelect está forzado */}
      {(!isMobile && showCategorySelect && categories) && (
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
      {/* Chips de subcategorías SOLO en desktop o si showSubcategoryChips está forzado explícitamente */}
      {(!isMobile && showSubcategoryChips && subcategories) && (
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
        <Box sx={recommendationsListSx(isHome)}>
          {recommendations.map((recommendation, index) => (
            <MaterialRecommendationCard
              key={recommendation.globalId || `${recommendation.title}-${index}`}
              recommendation={recommendation}
              isHome={isHome}
              className={visibleIndexes.includes(index) ? '' : 'entering'}
              onClick={onItemClick ? () => onItemClick(recommendation) : undefined}
            />
          ))}
          {/* Sentinel para infinite scroll en móvil y desktop */}
          {(() => {
            if (hasMore) {
              // Normaliza el color: si no hay, usa naranja por defecto
              let loaderColor = categoryColor;
              if (!loaderColor || typeof loaderColor !== 'string' || loaderColor.trim() === '') loaderColor = '#ff9800';
              // Si el color viene en formato rgb(a) o similar, no le añadas transparencia con '22'
              let bgColor = loaderColor;
              if (/^#([0-9a-f]{3}){1,2}$/i.test(loaderColor)) {
                bgColor = loaderColor + '22'; // añade transparencia solo si es hex
              }
              return (
                <Box ref={sentinelRef} sx={sentinelSx(loaderColor)}>
                  <span style={{ color: loaderColor, fontWeight: 'bold', marginRight: 12, fontSize: 18 }}>
                    {getTranslation('ui.states.loading', 'Cargando / Loading')}
                  </span>
                  {loadingMore && <CircularProgress size={32} sx={{ color: loaderColor }} />}
                </Box>
              );
            }
            return null;
          })()}
        </Box>
      )}
      {/* Empty state */}
      {(!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) && (
        <Box sx={emptyStateSx(isMobile)}>
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
            sx={emptyImgSx}
          />
        </Box>
      )}
      {/* Render children (solo para desktop o casos especiales) */}
      {!isMobile && children}
    </Box>
  );
};

export default MaterialContentWrapper;
