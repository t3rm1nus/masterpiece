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

const RecommendationsList = ({ recommendations, isHome }) => {  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
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
  const badgeConfig = getMasterpieceBadgeConfig();
  // Handler para hacer clic en un item (memoizado)
  const handleItemClick = useCallback((item) => {
    navigateToDetail(item);
  }, [navigateToDetail]);

  // Memoizar el contenido de recomendaciones para evitar re-renders innecesarios
  const memoizedRecommendations = useMemo(() => {    if (!recommendations || recommendations.length === 0) {
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
    }

    return recommendations.map((rec, index) => {
            const title = processTitle(rec.title, lang);
            const description = processDescription(rec.description, lang);
            const cardClasses = getRecommendationCardClasses(rec, isHome, isMobile);
            
            return (
              <div 
                key={generateRecommendationKey(rec, index)}
                className={cardClasses}
                style={isHome && isMobile ? mobileHomeStyles.cardStyle : desktopStyles.cardStyle}
                onClick={() => handleItemClick(rec)}
              >                {rec.masterpiece && (
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
                        src={rec.image} 
                        alt={title} 
                        width={80} 
                        height={110} 
                        style={mobileHomeStyles.imageStyle} 
                      />
                      <div className="rec-home-cats" style={mobileHomeStyles.categoryContainer}>
                        <span className="rec-home-cat" style={mobileHomeStyles.categoryStyle}>
                          {getCategoryTranslation(rec.category)}
                        </span>
                        <span className="rec-home-subcat" style={mobileHomeStyles.subcategoryStyle}>
                          {getSubcategoryTranslation(rec.subcategory)}
                        </span>
                      </div>
                    </div>                    <div className="rec-home-info">
                      <p className="rec-home-desc">{description}</p>
                    </div>
                  </div>
                ) : (
                  // Layout desktop y categorías
                  <>
                    <OptimizedImage 
                      src={rec.image} 
                      alt={title} 
                      width={120} 
                      height={170} 
                      style={desktopStyles.imageStyle} 
                    />
                    <div style={desktopStyles.categoryContainer}>
                      <span style={desktopStyles.categoryStyle}>
                        {getCategoryTranslation(rec.category)}
                      </span>
                      <span style={desktopStyles.subcategoryStyle}>
                        {getSubcategoryTranslation(rec.subcategory)}
                      </span>                    </div>                    <h3>{title}</h3>
                    <p>{description}</p>
                  </>
                )}
              </div>
            );
          });
  }, [recommendations, randomNotFoundImage, t.no_results, isMobile, handleItemClick, processTitle, processDescription, getRecommendationCardClasses, badgeConfig, isHome, mobileHomeStyles, desktopStyles, lang]);
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
