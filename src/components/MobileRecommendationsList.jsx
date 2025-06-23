import React, { useMemo, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData, useAppTheme } from '../store/useAppStore';
import { generateRecommendationKey } from '../utils/appUtils';
import MaterialContentWrapper from './MaterialContentWrapper';
import '../styles/components/cards.css';

// Componente de imagen optimizada
const OptimizedImage = ({ src, alt, className }) => (
  <img 
    src={src}
    alt={alt}
    className={className}
    loading="lazy"
    decoding="async"
  />
);

// Componente del badge de obra maestra
const MasterpieceBadge = ({ config }) => (
  <span className="masterpiece-badge" title="Obra maestra">
    <svg
      width={config.svg.width}
      height={config.svg.height}
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
  </span>
);

// Componente para vista "sin resultados"
const NoResults = ({ t, randomNotFoundImage }) => {
  const notFoundImageUrl = randomNotFoundImage?.() || '/favicon.png';
  
  return (
    <div className="no-results-container">
      <p className="no-results-text">
        {t?.no_results || 'No se encontraron resultados'}
      </p>
      <p className="no-results-subtext">
        Prueba con otros filtros o categorías
      </p>
      <img 
        src={notFoundImageUrl} 
        alt="No se encontraron resultados" 
        className="no-results-image"
      />
    </div>
  );
};

/**
 * MobileRecommendationsList
 * Lista de recomendaciones para móvil, altamente parametrizable.
 *
 * Props avanzados:
 * - items: array de recomendaciones a mostrar (alias de recommendations)
 * - renderItem: función para custom render de cada ítem `(item, idx) => ReactNode`
 * - onItemClick: callback al hacer click en un ítem
 * - loading: boolean (estado de carga)
 * - emptyComponent: ReactNode o función para custom empty state
 * - pagination: objeto de paginación `{ page, pageSize, onPageChange }`
 * - sx, className, style: estilos avanzados
 * - ...props legacy (recommendations, etc.)
 *
 * Ejemplo de uso:
 * <MobileRecommendationsList
 *   items={recs}
 *   renderItem={(item, idx) => <MyCard item={item} key={item.id} />}
 *   onItemClick={item => setSelected(item)}
 *   loading={isLoading}
 *   emptyComponent={<div>No hay recomendaciones</div>}
 *   pagination={{ page, pageSize, onPageChange }}
 *   sx={{ background: '#fafafa' }}
 * />
 */
const MobileRecommendationsList = ({
  items,
  renderItem,
  onItemClick,
  loading,
  emptyComponent,
  pagination,
  sx = {},
  className = '',
  style = {},
  // legacy/compatibilidad
  recommendations,
  isHome,
  categories,
  selectedCategory,
  onCategoryClick,
  ...rest
}) => {
  const data = items || recommendations;
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { goToDetail } = useAppView();
  const { randomNotFoundImage } = useAppData();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const badgeConfig = getMasterpieceBadgeConfig();

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

  // Renderizador específico para móvil
  const renderMobileCard = useCallback((rec, title, description) => (
    <div className="rec-home-media">
      <OptimizedImage
        src={rec.image}
        alt={title}
        className="rec-home-img"
      />
      <div className="rec-home-info">
        <h3 className="rec-home-title">{title}</h3>
      </div>
      <div className="rec-home-cats">
        <span className="rec-home-cat">
          {getCategoryTranslation(rec.category)}
        </span>
        {rec.subcategory && (
          <span className="rec-home-subcat">
            {getSubcategoryTranslation(rec.subcategory, rec.category)}
          </span>
        )}
      </div>
      <p className="rec-home-desc">{truncateDescription(description)}</p>
    </div>
  ), [getCategoryTranslation, getSubcategoryTranslation, truncateDescription]);

  // Render de cada ítem (custom o default)
  const renderRecommendationCard = useCallback((rec, index) => {
    if (renderItem) return renderItem(rec, index);
    try {
      const normalizedRec = normalizeRecommendation(rec);
      const title = processMultiLanguageField(normalizedRec.title || normalizedRec.name);
      const description = processMultiLanguageField(normalizedRec.description);
      const cardClasses = getCardClasses(normalizedRec);

      return (
        <div
          key={generateRecommendationKey(normalizedRec, index)}
          className={cardClasses}
          onClick={() => handleItemClick(normalizedRec)}
        >
          {normalizedRec.masterpiece && <MasterpieceBadge config={badgeConfig} />}
          {renderMobileCard(normalizedRec, title, description)}
        </div>
      );
    } catch (error) {
      console.error('[MobileRecommendationsList] Error rendering item', index + 1, ':', error);
      return (
        <div key={`error-${index}`} className="error-card">
          Error rendering item: {rec?.title || rec?.name || 'Unknown'}
        </div>
      );
    }
  }, [
    renderItem,
    normalizeRecommendation, 
    processMultiLanguageField, 
    getCardClasses, 
    handleItemClick, 
    badgeConfig,
    renderMobileCard
  ]);

  // Memoización del contenido principal
  const memoizedRecommendations = useMemo(() => {
    if (loading) return <div className="recommendations-loading">Cargando...</div>;
    if (!data?.length) {
      if (emptyComponent) {
        return typeof emptyComponent === 'function' ? emptyComponent() : emptyComponent;
      }
      return <NoResults t={t} randomNotFoundImage={randomNotFoundImage} />;
    }
    return data.map(renderRecommendationCard);
  }, [data, t, randomNotFoundImage, renderRecommendationCard, loading, emptyComponent]);

  return (
    <div className={`mobile-recommendations-list ${className}`} style={style} {...rest}>
      {memoizedRecommendations}
      {pagination && (
        <div className="pagination-container">
          <button 
            className="pagination-button" 
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {pagination.page} de {Math.ceil((data?.length || 0) / (pagination.pageSize || 1))}
          </span>
          <button 
            className="pagination-button" 
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil((data?.length || 0) / (pagination.pageSize || 1))}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileRecommendationsList;