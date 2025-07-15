import React, { useMemo, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData, useAppTheme } from '../store/useAppStore';
import { generateRecommendationKey } from '../utils/appUtils';
import { getCategoryGradient } from '../utils/categoryPalette';
import CategoryBar from './home/CategoryBar';
import SubcategoryBar from './home/SubcategoryBar';
import { NoResults } from './SharedComponents';
import MaterialRecommendationCard from './MaterialRecommendationCard';
import type { Recommendation } from './MaterialRecommendationCard';
import { randomNotFoundImage } from '../store/utils';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Pagination {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

interface DesktopRecommendationsListProps {
  items?: Recommendation[];
  renderItem?: (item: Recommendation, idx: number) => React.ReactNode;
  onItemClick?: (item: Recommendation) => void;
  loading?: boolean;
  emptyComponent?: React.ReactNode | (() => React.ReactNode);
  pagination?: Pagination;
  sx?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  categoryColor?: string;
  recommendations?: Recommendation[];
  isHome?: boolean;
  categories?: any[];
  selectedCategory?: string;
  onCategoryClick?: (category: string) => void;
  subcategories?: any[];
  activeSubcategory?: string;
  onSubcategoryClick?: (subcategory: string) => void;
  renderCategoryButton?: (category: any, selected: boolean, idx: number) => React.ReactNode;
  renderSubcategoryChip?: (subcategory: any, selected: boolean, idx: number) => React.ReactNode;
  categoryBarSx?: React.CSSProperties;
  subcategoryBarSx?: React.CSSProperties;
  showCategoryBar?: boolean;
  showSubcategoryBar?: boolean;
  showCategorySelect?: boolean;
  showSubcategoryChips?: boolean;
  [key: string]: any;
}

const DesktopRecommendationsList: React.FC<DesktopRecommendationsListProps> = ({
  items,
  renderItem,
  onItemClick,
  loading,
  emptyComponent,
  pagination,
  sx = {},
  className = '',
  style = {},
  onLoadMore,
  hasMore,
  loadingMore,
  categoryColor,
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
  showCategorySelect,
  showSubcategoryChips,
  ...rest
}) => {
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
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const badgeConfig = getMasterpieceBadgeConfig();
  const navigate = useNavigate();

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll(
    onLoadMore || (() => {}),
    !!hasMore,
    !!loadingMore
  );

  // Funciones utilitarias
  const processMultiLanguageField = useCallback((field: any) => {
    if (!field) return '';
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field['es'] || field['en'] || Object.values(field)[0] || '';
    }
    return field.toString();
  }, [lang]);

  const truncateDescription = useCallback((description: string, maxLength = 150) => {
    if (!description) return '';
    return description.length > maxLength 
      ? description.substring(0, maxLength).trim() + '...'
      : description;
  }, []);

  const normalizeRecommendation = useCallback((rec: Recommendation) => ({
    ...rec,
    description: rec.description || rec.descripcion,
    subcategory: rec.subcategory !== undefined ? rec.subcategory : (rec.category !== 'documentales' ? (rec.category ?? null) : null),
    category: rec.category === 'documentales' ? 'documentales' : 
             (['politics', 'history', 'science', 'nature', 'culture', 'crime', 'art'].includes(rec.category ?? '')) 
               ? 'documentales' 
               : rec.category,
    image: rec.image || '/favicon.png'
  }), []);

  const getCardClasses = useCallback((item: Recommendation) => {
    let classes = 'recommendation-card';
    if (item?.category) classes += ` ${item.category}`;
    if (item?.masterpiece) classes += ' masterpiece';
    return classes;
  }, []);

  const handleItemClick = useCallback((item: Recommendation) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      navigate(`/detalle/${item.category}/${item.id}`);
    }
  }, [navigate, onItemClick]);

  // Render de cada ítem (custom o default)
  const renderRecommendationCard = useCallback((rec: Recommendation, index: number) => {
    if (renderItem) return renderItem(rec, index);
    try {
      const normalizedRec = normalizeRecommendation(rec);
      return (
        <MaterialRecommendationCard
          key={generateRecommendationKey(normalizedRec, index)}
          recommendation={normalizedRec as Recommendation}
          onClick={() => handleItemClick(normalizedRec)}
          sx={{
            '--card-gradient': getCategoryGradient(normalizedRec.category ?? '')
          }}
        />
      );
    } catch (error) {
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
  const wrapperStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '1800px',
    margin: '0 auto',
    padding: '0 2vw',
  };
  const listStyles: React.CSSProperties = {
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
          selectedCategory={selectedCategory ?? null}
          onCategoryClick={onCategoryClick ?? (() => {})}
          renderButton={renderCategoryButton}
          sx={categoryBarSx}
        />
      )}
      {/* Barra de subcategorías parametrizable */}
      {showSubcategoryBar && subcategories && (
        <SubcategoryBar
          selectedCategory={selectedCategory ?? null}
          categorySubcategories={subcategories}
          activeSubcategory={activeSubcategory ?? null}
          setActiveSubcategory={onSubcategoryClick ?? (() => {})}
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
const recHomeImgStyle: React.CSSProperties = {
  width: '70%',
  borderRadius: 12,
  marginBottom: 8,
  objectFit: 'cover',
};
const categoryLabelStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '1em',
  color: '#666',
  margin: '0 0 4px 0',
  textAlign: 'center',
};
const subcategoryLabelStyle: React.CSSProperties = {
  fontSize: '0.95em',
  color: '#666',
  textAlign: 'center',
};
const recHomeTitleStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: 0,
  fontWeight: 600,
  fontSize: '1.13rem',
};

export default DesktopRecommendationsList; 