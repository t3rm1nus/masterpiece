import React, { useMemo, useCallback, lazy } from 'react';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';
import useDataStore from '../store/dataStore';
import useThemeStore from '../store/themeStore';
import { generateRecommendationKey } from '../utils/appUtils';
import MaterialContentWrapper from './MaterialContentWrapper';

// Separar chunks por funcionalidad
const CoffeePage = lazy(() => 
  import('./CoffeePage' /* webpackChunkName: "coffee" */)
);

// Implementar imagen optimizada
const OptimizedImage = ({ src, alt, ...props }) => (
  <img 
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    {...props}
  />
);

const RecommendationsList = ({ recommendations, isHome, onItemClick }) => {  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
    // Stores consolidados
  const { 
    isMobile, 
    navigateToDetail,
    processTitle, 
    processDescription, 
    getRecommendationCardClasses,
    mobileHomeStyles,
    desktopStyles
  } = useViewStore();
  
  // Obtener la imagen not found del store de datos
  const { randomNotFoundImage } = useDataStore();
  
  // Obtener configuración de estilos
  const { getMasterpieceBadgeConfig } = useThemeStore();
  const badgeConfig = getMasterpieceBadgeConfig();  // Handler para hacer clic en un item (memoizado)
  const handleItemClick = useCallback((item) => {
    console.log('[RecommendationsList] Item clicked:', item?.title || item?.name, 'Category:', item?.category);
    if (onItemClick) {
      onItemClick(item);
    } else {
      navigateToDetail(item);
    }
  }, [navigateToDetail, onItemClick]);
  // Función para recortar descripciones largas
  const truncateDescription = useCallback((description, category, maxLength = 150) => {
    if (!description) return '';
    
    // Aplicar truncamiento a todas las categorías
    if (description.length > maxLength) {
      return description.substring(0, maxLength).trim() + '...';
    }
    
    return description;
  }, []);  // Memoizar el contenido de recomendaciones para evitar re-renders innecesarios
  const memoizedRecommendations = useMemo(() => {
    console.log('[RecommendationsList] Rendering with recommendations:', {
      count: recommendations?.length || 0,
      isArray: Array.isArray(recommendations),
      isHome: isHome,
      firstItem: recommendations?.[0]?.title || recommendations?.[0]?.name || 'N/A'
    });
    
    // Verificación más robusta para evitar errores con .map()
    if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
      console.log('[RecommendationsList] No recommendations to show, displaying no results message');
      return (
        <div className="no-results-container">
          <img 
            src={randomNotFoundImage} 
            alt="No se encontraron resultados" 
            className="no-results-image"
          />
          <p className="no-results-text">
            {t.no_results || 'No se encontraron resultados'}
          </p>
        </div>
      );
    }    console.log('[RecommendationsList] Rendering', recommendations.length, 'recommendation cards');

    return recommendations.map((rec, index) => {
      try {        // Normalizar datos para compatibilidad entre diferentes estructuras
        const normalizedRec = {
          ...rec,
          // Para documentales, usar 'descripcion' si no hay 'description'
          description: rec.description || rec.descripcion,
          // Para documentales, manejar subcategorías: usar subcategory si existe, sino usar category como subcategory
          subcategory: rec.subcategory || (rec.category !== 'documentales' ? rec.category : null),
          // La categoría principal debe determinarse por el contexto - si viene de documentales, es documentales
          category: rec.category === 'documentales' ? 'documentales' : 
                   (rec.category && ['politics', 'history', 'science', 'nature', 'culture', 'crime', 'art'].includes(rec.category)) ? 'documentales' : 
                   rec.category
        };
        
        const title = processTitle(normalizedRec.title || normalizedRec.name, lang);
        const description = processDescription(normalizedRec.description, lang);
        const cardClasses = getRecommendationCardClasses(normalizedRec, isHome, isMobile);
        
        console.log('[RecommendationsList] Processing item', index + 1, ':', title, 'Category:', normalizedRec.category, 'Subcategory:', normalizedRec.subcategory);
        
        return (
          <div 
            key={generateRecommendationKey(normalizedRec, index)}
            className={cardClasses}
            style={isHome && isMobile ? mobileHomeStyles.cardStyle : desktopStyles.cardStyle}
            onClick={() => handleItemClick(normalizedRec)}          >
            {normalizedRec.masterpiece && (
              <span className="masterpiece-badge" title="Obra maestra">
                    <svg 
                      width={badgeConfig.svg.width} 
                      height={badgeConfig.svg.height} 
                      viewBox={badgeConfig.svg.viewBox} 
                      fill={badgeConfig.svg.fill} 
                      xmlns={badgeConfig.svg.xmlns}
                    >
                      <circle 
                        cx={badgeConfig.circle.cx} 
                        cy={badgeConfig.circle.cy} 
                        r={badgeConfig.circle.r} 
                        fill={badgeConfig.circle.fill}
                      />
                      <path 
                        d={badgeConfig.star.d} 
                        fill={badgeConfig.star.fill}
                      />
                    </svg>
                  </span>
                )}
                
                {isHome && isMobile ? (
                  // Layout móvil para home
                  <div className="rec-home-content">
                    <div className="rec-home-media">
                      <OptimizedImage 
                        src={normalizedRec.image} 
                        alt={title} 
                        width={80} 
                        height={110} 
                        style={mobileHomeStyles.imageStyle} 
                      />
                      <div className="rec-home-cats" style={mobileHomeStyles.categoryContainer}>
                        <span className="rec-home-cat" style={mobileHomeStyles.categoryStyle}>
                          {getCategoryTranslation(normalizedRec.category)}
                        </span>
                        {normalizedRec.subcategory && (
                          <span className="rec-home-subcat" style={mobileHomeStyles.subcategoryStyle}>
                            {getSubcategoryTranslation(normalizedRec.subcategory, normalizedRec.category)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rec-home-info">
                      <p className="rec-home-desc">{truncateDescription(description, normalizedRec.category)}</p>
                    </div>
                  </div>
                ) : (
                  // Layout desktop y categorías
                  <>
                    <OptimizedImage 
                      src={normalizedRec.image} 
                      alt={title} 
                      width={120} 
                      height={170} 
                      style={desktopStyles.imageStyle} 
                    />
                    <h3>{title}</h3>
                    <div style={desktopStyles.categoryContainer}>                      <span style={{
                        ...desktopStyles.categoryStyle,
                        ...(normalizedRec.category === 'documentales' ? { color: '#9e9e9e' } : {})
                      }}>
                        {getCategoryTranslation(normalizedRec.category)}
                      </span>
                      {normalizedRec.subcategory && (
                        <span style={desktopStyles.subcategoryStyle}>
                          {getSubcategoryTranslation(normalizedRec.subcategory, normalizedRec.category)}
                        </span>
                      )}                    </div>
                    <p>{truncateDescription(description, normalizedRec.category)}</p>
                  </>
                )}
              </div>
            );
      } catch (error) {
        console.error('[RecommendationsList] Error rendering item', index + 1, ':', error, normalizedRec || rec);
        return (
          <div key={`error-${index}`} style={{ padding: '10px', color: 'red', border: '1px solid red' }}>
            Error rendering item: {normalizedRec?.title || normalizedRec?.name || rec?.title || rec?.name || 'Unknown'}
          </div>
        );
      }
    });
  }, [recommendations, randomNotFoundImage, t.no_results, isMobile, handleItemClick, processTitle, processDescription, getRecommendationCardClasses, badgeConfig, isHome, mobileHomeStyles, desktopStyles, lang, truncateDescription]);
  return (
    <MaterialContentWrapper
      recommendations={recommendations}
      isHome={isHome}
    >
      <div className="recommendations-wrapper">
        <div className="recommendations-list">
          {memoizedRecommendations}
        </div>
      </div>
    </MaterialContentWrapper>
  );
};

export default RecommendationsList;
