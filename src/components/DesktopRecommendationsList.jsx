import React, { useMemo, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData, useAppTheme } from '../store/useAppStore';
import { generateRecommendationKey } from '../utils/appUtils';
import { getCategoryGradient } from '../utils/categoryPalette';
import CategoryBar from './home/CategoryBar';
import SubcategoryBar from './home/SubcategoryBar';
import { NoResults } from './SharedComponents';
import MaterialRecommendationCard from './MaterialRecommendationCard';
import { randomNotFoundImage } from '../store/utils';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { CircularProgress, Box } from '@mui/material';

// =============================================
// DesktopRecommendationsList: Lista de recomendaciones para desktop
// Lista de recomendaciones para desktop, altamente parametrizable y reutilizable.
// Optimizada para performance, UX y soporte de infinite scroll y filtros avanzados.
// =============================================

/**
 * DesktopRecommendationsList
 * Lista de recomendaciones para desktop, altamente parametrizable y reutilizable.
 *
 * Props avanzados:
 * - items: array de recomendaciones a mostrar (alias de recommendations)
 * - renderItem: función para custom render de cada ítem `(item, idx) => ReactNode`
 * - onItemClick: callback al hacer click en un ítem
 * - loading: boolean (estado de carga)
 * - emptyComponent: ReactNode o función para custom empty state
 * - pagination: objeto de paginación `{ page, pageSize, onPageChange }`
 * - categories: array de categorías (para barra de categorías)
 * - selectedCategory: string (categoría activa)
 * - onCategoryClick: función para seleccionar categoría
 * - subcategories: array de subcategorías (para barra de subcategorías)
 * - activeSubcategory: string (subcategoría activa)
 * - onSubcategoryClick: función para seleccionar subcategoría
 * - renderCategoryButton: función para custom render de botón de categoría
 * - renderSubcategoryChip: función para custom render de chip de subcategoría
 * - categoryBarSx: estilos adicionales para CategoryBar
 * - subcategoryBarSx: estilos adicionales para SubcategoryBar
 * - showCategoryBar: boolean (mostrar barra de categorías, default: true)
 * - showSubcategoryBar: boolean (mostrar barra de subcategorías, default: true)
 * - ...props legacy (recommendations, etc.)
 *
 * Ejemplo de uso:
 * <DesktopRecommendationsList
 *   items={recs}
 *   categories={categories}
 *   selectedCategory={selectedCategory}
 *   onCategoryClick={setCategory}
 *   subcategories={subcategories}
 *   activeSubcategory={activeSubcategory}
 *   onSubcategoryClick={setActiveSubcategory}
 *   renderCategoryButton={...}
 *   renderSubcategoryChip={...}
 *   categoryBarSx={{ background: '#fafafa' }}
 *   subcategoryBarSx={{ background: '#eee' }}
 *   showCategoryBar={false} // <---
 *   showSubcategoryBar={false} // <---
 *   renderItem={(item, idx) => <MyCard item={item} key={item.id} />}
 *   onItemClick={item => setSelected(item)}
 *   loading={isLoading}
 *   emptyComponent={<div>No hay recomendaciones</div>}
 *   pagination={{ page, pageSize, onPageChange }}
 *   sx={{ background: '#fafafa' }}
 * />
 */
const DesktopRecommendationsList = ({
  items,
  renderItem,
  onItemClick,
  loading,
  emptyComponent,
  pagination,
  sx = {},
  className = '',
  style = {},
  // Infinite scroll props
  onLoadMore,
  hasMore,
  loadingMore,
  categoryColor,
  // legacy/compatibilidad
  recommendations,
  isHome,
  categories,
  selectedCategory,
  onCategoryClick,
  subcategories,
  activeSubcategory,
  onSubcategoryClick,
  renderCategoryButton,
  renderSubcategoryChip,
  categoryBarSx = {},
  subcategoryBarSx = {},
  showCategoryBar = true,
  showSubcategoryBar = true,
  showCategorySelect, // props avanzados que no deben ir al DOM
  showSubcategoryChips, // props avanzados que no deben ir al DOM
  ...rest
}) => {
  // LOGS ELIMINADOS: activeLanguage, activePodcastLanguages, activeDocumentaryLanguages, filteredItems

  // Filtrar props que no deben ir al DOM
  const domSafeRest = { ...rest };
  delete domSafeRest.showCategorySelect;
  delete domSafeRest.showSubcategoryChips;
  delete domSafeRest.onLoadMore;
  delete domSafeRest.hasMore;
  delete domSafeRest.loadingMore;
  delete domSafeRest.categoryColor;

  const data = items || recommendations;
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation, getTranslation } = useLanguage();
  const { goToDetail } = useAppView();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const badgeConfig = getMasterpieceBadgeConfig();

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll(
    onLoadMore || (() => {}),
    !!hasMore,
    !!loadingMore
  );

  // Funciones utilitarias
  const processMultiLanguageField = useCallback((field) => {
    if (!field) return '';
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field['es'] || field['en'] || Object.values(field)[0] || '';
    }
    return field.toString();
  }, [lang]);

  const truncateDescription = useCallback((description, maxLength = 150) => {
    if (!description) return '';
    return description.length > maxLength 
      ? description.substring(0, maxLength).trim() + '...'
      : description;
  }, []);

  const normalizeRecommendation = useCallback((rec) => ({
    ...rec,
    description: rec.description || rec.descripcion,
    subcategory: rec.subcategory || (rec.category !== 'documentales' ? rec.category : null),
    category: rec.category === 'documentales' ? 'documentales' : 
             (['politics', 'history', 'science', 'nature', 'culture', 'crime', 'art'].includes(rec.category)) 
               ? 'documentales' 
               : rec.category,
    image: rec.image || '/favicon.png'
  }), []);

  const getCardClasses = useCallback((item) => {
    let classes = 'recommendation-card';
    if (item?.category) classes += ` ${item.category}`;
    if (item?.masterpiece) classes += ' masterpiece';
    return classes;
  }, []);

  const handleItemClick = useCallback((item) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      goToDetail(item);
    }
  }, [goToDetail, onItemClick]);

  // Renderizador para vista home de desktop (sin título)
  const renderDesktopHomeCard = useCallback((rec, title, description) => (
    <>
      <img
        src={rec.image}
        alt={title}
        style={recHomeImgStyle}
        loading="lazy"
        decoding="async"
      />
      <div style={{ height: '8px' }} />
      <div style={categoryLabelStyle}>
        {getCategoryTranslation(rec.category)}
      </div>
      {rec.subcategory && (
        <div style={subcategoryLabelStyle}>
          {getSubcategoryTranslation(rec.subcategory, rec.category)}
        </div>
      )}
      <div style={{ height: '8px' }} />
      <p style={{ textAlign: 'center' }}>
        {truncateDescription(description)}
      </p>
    </>
  ), [getCategoryTranslation, getSubcategoryTranslation, truncateDescription]);

  // Renderizador para vista de listado de desktop (con título)
  const renderDesktopListCard = useCallback((rec, title, description) => (
    <>
      <img
        src={rec.image}
        alt={title}
        style={recHomeImgStyle}
        loading="lazy"
        decoding="async"
      />
      <div style={{ height: '8px' }} />
      <h3 style={recHomeTitleStyle}>
        {title}
      </h3>
      <div style={{ height: '8px' }} />
      <div style={categoryLabelStyle}>
        {getCategoryTranslation(rec.category)}
      </div>
      {rec.subcategory && (
        <div style={subcategoryLabelStyle}>
          {getSubcategoryTranslation(rec.subcategory, rec.category)}
        </div>
      )}
      <div style={{ height: '8px' }} />
      <p style={{ textAlign: 'center' }}>
        {truncateDescription(description)}
      </p>
    </>
  ), [getCategoryTranslation, getSubcategoryTranslation, truncateDescription]);

  // Render de cada ítem (custom o default)
  const renderRecommendationCard = useCallback((rec, index) => {
    if (renderItem) return renderItem(rec, index);
    try {
      const normalizedRec = normalizeRecommendation(rec);
      return (
        <MaterialRecommendationCard
          key={generateRecommendationKey(normalizedRec, index)}
          recommendation={normalizedRec}
          onClick={() => handleItemClick(normalizedRec)}
          sx={{
            '--card-gradient': getCategoryGradient(normalizedRec.category)
          }}
        />
      );
    } catch (error) {
      console.error('[DesktopRecommendationsList] Error rendering item', index + 1, ':', error);
      return (
        <div key={`error-${index}`} className="error-card">
          Error rendering item: {rec?.title || rec?.name || 'Unknown'}
        </div>
      );
    }
  }, [
    renderItem,
    normalizeRecommendation, 
    handleItemClick
  ]);

  // Memoización del contenido principal
  const memoizedRecommendations = useMemo(() => {
    if (loading) return <div className="recommendations-loading">{getTranslation('ui.states.loading', 'Cargando...')}</div>;
    if (!data || !data.length) {
      if (emptyComponent) {
        return typeof emptyComponent === 'function' ? emptyComponent() : emptyComponent;
      }
      return <NoResults t={t} randomNotFoundImage={randomNotFoundImage} />;
    }
    return data.map(renderRecommendationCard);
  }, [data, t, randomNotFoundImage, renderRecommendationCard, loading, emptyComponent]);

  // Estilos del contenedor desktop
  const wrapperStyles = {
    width: '100%',
    maxWidth: '1800px',
    margin: '0 auto',
    padding: '0 2vw',
  };
  const listStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '20px 12px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <div className={`desktop-recommendations-list ${className}`} style={{ ...wrapperStyles, ...sx, ...style }} {...domSafeRest}>
      {/* Barra de categorías parametrizable */}
      {showCategoryBar && categories && (
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={onCategoryClick}
          renderButton={renderCategoryButton}
          sx={categoryBarSx}
        />
      )}
      {/* Barra de subcategorías parametrizable */}
      {showSubcategoryBar && subcategories && (
        <SubcategoryBar
          selectedCategory={selectedCategory}
          categorySubcategories={subcategories}
          activeSubcategory={activeSubcategory}
          setActiveSubcategory={onSubcategoryClick}
          renderChip={renderSubcategoryChip}
          sx={subcategoryBarSx}
        />
      )}
      <div className="recommendations-list desktop-list" style={listStyles}>
        {memoizedRecommendations}
      </div>
      
      {/* Infinite scroll sentinel para desktop */}
      {hasMore && (
        <Box
          ref={sentinelRef}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            minHeight: '60px',
            backgroundColor: categoryColor ? `${categoryColor}22` : '#ff980022',
            borderRadius: '8px',
            margin: '20px 0'
          }}
        >
          <span style={{ 
            color: categoryColor || '#ff9800', 
            fontWeight: 'bold', 
            marginRight: 12, 
            fontSize: 18 
          }}>
            {getTranslation('ui.states.loading', 'Cargando / Loading')}
          </span>
          {loadingMore && (
            <CircularProgress 
              size={32} 
              sx={{ color: categoryColor || '#ff9800' }} 
            />
          )}
        </Box>
      )}
      
      {pagination && (
        <div className="pagination-container">
          <button 
            className="pagination-button" 
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            {getTranslation('ui.pagination.previous', 'Anterior')}
          </button>
          <span className="pagination-info">
            {getTranslation('ui.pagination.page_of', 'Página')} {pagination.page} {getTranslation('ui.pagination.of', 'de')} {Math.ceil((data?.length || 0) / (pagination.pageSize || 1))}
          </span>
          <button 
            className="pagination-button" 
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil((data?.length || 0) / (pagination.pageSize || 1))}
          >
            {getTranslation('ui.pagination.next', 'Siguiente')}
          </button>
        </div>
      )}
    </div>
  );
};

// Migrar estilos internos a CSS-in-JS en DesktopRecommendationsList.jsx
const recHomeImgStyle = {
  width: '70%',
  borderRadius: 12,
  marginBottom: 8,
  objectFit: 'cover',
};
const categoryLabelStyle = {
  fontWeight: 700,
  fontSize: '1em',
  color: '#666',
  margin: '0 0 4px 0',
  textAlign: 'center',
};
const subcategoryLabelStyle = {
  fontSize: '0.95em',
  color: '#666',
  textAlign: 'center',
};
const recHomeTitleStyle = {
  textAlign: 'center',
  margin: 0,
  fontWeight: 600,
  fontSize: '1.13rem',
};

export default DesktopRecommendationsList;