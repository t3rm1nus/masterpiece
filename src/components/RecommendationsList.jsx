import React, { useMemo, useCallback } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData, useAppTheme } from '../store/useAppStore';
import { generateRecommendationKey } from '../utils/appUtils';
import MaterialContentWrapper from './MaterialContentWrapper';
import '../styles/components/cards.css';

// Función para obtener una imagen aleatoria de notfound
const getRandomNotFoundImage = () => {
  const notFoundImages = [
    'notfound.webp',
    'notfound2.webp', 
    'notfound3.webp',
    'notfound4.webp',
    'notfound5.webp',
    'notfound6.webp',
    'notfound7.webp',
    'notfound8.webp',
    'notfound9.webp',
    'notfound10.webp'
  ];
  
  const randomIndex = Math.floor(Math.random() * notFoundImages.length);
  return `/imagenes/notfound/${notFoundImages[randomIndex]}`;
};

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

const RecommendationsList = ({ recommendations, isHome, onItemClick }) => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  // Stores consolidados - SOLO VALORES PRIMITIVOS Y ACCIONES SEGURAS
  const { 
    isMobile, 
    isTablet,
    goToDetail,
    mobileHomeStyles,
    desktopStyles,
    baseRecommendationCardClasses
  } = useAppView();
  // Valores por defecto para evitar errores
  const safeDesktopStyles = desktopStyles || {
    cardStyle: { marginBottom: '16px' },
    categoryStyle: { fontWeight: 'bold', color: '#0078d4' },
    subcategoryStyle: { fontSize: '0.9em', color: '#666' },
    imageStyle: { width: '120px', height: '170px' },
    categoryContainer: { display: 'flex', gap: '8px', alignItems: 'center' }
  };
  
  const safeMobileHomeStyles = mobileHomeStyles || {
    cardStyle: { marginBottom: '8px' },
    imageStyle: { width: '80px', height: '110px' }
  };

  // Obtener la imagen not found del store de datos
  const { randomNotFoundImage } = useAppData();
  // Ejecutar la función para obtener la imagen
  const notFoundImageUrl = randomNotFoundImage ? randomNotFoundImage() : '/favicon.png';
  // Obtener configuración de estilos
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const badgeConfig = getMasterpieceBadgeConfig();

  // FUNCIONES UTILITARIAS LOCALES - SIN get() PARA EVITAR INFINITE LOOPS
  // Calcular clases de card dinámicamente usando las clases CSS definidas
  const getCardClasses = useCallback((item) => {
    let classes = 'recommendation-card';
    if (item && item.category) {
      classes += ` ${item.category}`;
    }
    if (item && item.masterpiece) {
      classes += ' masterpiece';
    }
    return classes;
  }, []);

  // Procesar título de forma segura - maneja objetos multiidioma
  const processTitle = useCallback((titleData) => {
    if (!titleData) return '';
    if (typeof titleData === 'object' && titleData !== null) {
      return titleData[lang] || titleData['es'] || titleData['en'] || Object.values(titleData)[0] || '';
    }
    return titleData.toString();
  }, [lang]);

  // Procesar descripción de forma segura - maneja objetos multiidioma
  const processDescription = useCallback((descriptionData) => {
    if (!descriptionData) return '';
    if (typeof descriptionData === 'object' && descriptionData !== null) {
      return descriptionData[lang] || descriptionData['es'] || descriptionData['en'] || Object.values(descriptionData)[0] || '';
    }
    return descriptionData.toString();
  }, [lang]);

  // Handler para hacer clic en un item (memoizado)
  const handleItemClick = useCallback((item) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      goToDetail(item);
    }
  }, [goToDetail, onItemClick]);

  // Función para recortar descripciones largas
  const truncateDescription = useCallback((description, category, maxLength = 150) => {
    if (!description) return '';
    if (description.length > maxLength) {
      return description.substring(0, maxLength).trim() + '...';
    }
    return description;
  }, []);

  // Memoizar el contenido de recomendaciones para evitar re-renders innecesarios
  const memoizedRecommendations = useMemo(() => {
    if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
      const notFoundImageUrl = getRandomNotFoundImage();
      return (
        <div className="no-results-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
          padding: '20px',
          width: '100%'
        }}>
          <img 
            src={notFoundImageUrl} 
            alt="No se encontraron resultados" 
            className="no-results-image"
            style={{
              maxWidth: '100%',
              width: '100%',
              height: 'auto',
              marginBottom: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              display: 'block',
              objectFit: 'contain',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
          <p className="no-results-text" style={{
            fontSize: '1.2em',
            color: '#666',
            marginTop: '16px'
          }}>
            {t?.no_results || 'No se encontraron resultados'}
          </p>
          <p className="no-results-subtext" style={{
            fontSize: '0.9em',
            color: '#999',
            marginTop: '8px'
          }}>
            Prueba con otros filtros o categorías
          </p>
        </div>
      );
    }
    return recommendations.map((rec, index) => {
      let normalizedRec = null;
      try {
        // Normalizar datos para compatibilidad entre diferentes estructuras
        normalizedRec = {
          ...rec,
          description: rec.description || rec.descripcion,
          subcategory: rec.subcategory || (rec.category !== 'documentales' ? rec.category : null),
          category: rec.category === 'documentales' ? 'documentales' : 
                   (rec.category && ['politics', 'history', 'science', 'nature', 'culture', 'crime', 'art'].includes(rec.category)) ? 'documentales' : 
                   rec.category,
          image: rec.image || '/favicon.png'
        };
        const title = processTitle(normalizedRec.title || normalizedRec.name);
        const description = processDescription(normalizedRec.description);
        const cardClasses = getCardClasses(normalizedRec);

        // SOLO un div con recommendation-card por item, y solo en el layout que lo necesita
        if (isHome && isMobile) {
          // Layout móvil para home
          return (
            <div
              key={generateRecommendationKey(normalizedRec, index)}
              className={getCardClasses(normalizedRec)}
              onClick={() => handleItemClick(normalizedRec)}
            >
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
              <div className="rec-home-media">
                <OptimizedImage
                  src={normalizedRec.image}
                  alt={title}
                  className="rec-home-img"
                />
                <div className="rec-home-info">
                  <h3 className="rec-home-title">{title}</h3>
                </div>
                <div className="rec-home-cats">
                  <span className="rec-home-cat">
                    {getCategoryTranslation(normalizedRec.category)}
                  </span>
                  {normalizedRec.subcategory && (
                    <span className="rec-home-subcat">
                      {getSubcategoryTranslation(normalizedRec.subcategory, normalizedRec.category)}
                    </span>
                  )}
                </div>
                <p className="rec-home-desc">{truncateDescription(description, normalizedRec.category)}</p>
              </div>
            </div>
          );
        }

        // Layout vertical SOLO para desktop en la home
        if (isHome && !isMobile) {
          return (
            <div
              key={generateRecommendationKey(normalizedRec, index)}
              className={getCardClasses(normalizedRec)}
              onClick={() => handleItemClick(normalizedRec)}
            >
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
              <OptimizedImage
                src={normalizedRec.image}
                alt={title}
                style={{ width: '70%' }}
                className="rec-home-img"
              />
              <div style={{ height: '8px' }} />
              <div className="category-label">
                {getCategoryTranslation(normalizedRec.category)}
              </div>
              <div style={{ height: '8px' }} />
              {normalizedRec.subcategory && (
                <div className="subcategory-label" style={{ fontSize: '0.95em', color: '#666', textAlign: 'center' }}>
                  {getSubcategoryTranslation(normalizedRec.subcategory, normalizedRec.category)}
                </div>
              )}
              <div style={{ height: '8px' }} />
              <p style={{ textAlign: 'center' }}>{truncateDescription(description, normalizedRec.category)}</p>
            </div>
          );
        }

        // Layout vertical para listados y resto de vistas desktop
        return (
          <div
            key={generateRecommendationKey(normalizedRec, index)}
            className={getCardClasses(normalizedRec)}
            onClick={() => handleItemClick(normalizedRec)}
          >
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
            <OptimizedImage
              src={normalizedRec.image}
              alt={title}
              className="rec-home-img"
              style={{ width: '70%' }}
            />
            <div style={{ height: '8px' }} />
            <h3 className="rec-home-title" style={{ textAlign: 'center', margin: 0 }}>{title}</h3>
            <div style={{ height: '8px' }} />
            <div className="category-label">
              {getCategoryTranslation(normalizedRec.category)}
            </div>
            <div style={{ height: '8px' }} />
            {normalizedRec.subcategory && (
              <div className="subcategory-label" style={{ fontSize: '0.95em', color: '#666', textAlign: 'center' }}>
                {getSubcategoryTranslation(normalizedRec.subcategory, normalizedRec.category)}
              </div>
            )}
            <div style={{ height: '8px' }} />
            <p style={{ textAlign: 'center' }}>{truncateDescription(description, normalizedRec.category)}</p>
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
  }, [recommendations, notFoundImageUrl, t.no_results, isMobile, handleItemClick, processTitle, processDescription, getCardClasses, badgeConfig, isHome, safeMobileHomeStyles, safeDesktopStyles, lang, truncateDescription]);

  return (
    <MaterialContentWrapper
      recommendations={recommendations}
      isHome={isHome}
    >
      <div
        className="recommendations-wrapper"
        style={
          !isMobile
            ? {
                width: '96vw',
                maxWidth: '1800px',
                margin: '0 auto',
                padding: '0 2vw',
              }
            : undefined
        }
      >
        <div
          className="recommendations-list"
          style={
            !isMobile
              ? {
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '32px 24px',
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }
              : undefined
          }
        >
          {memoizedRecommendations}
        </div>
      </div>
    </MaterialContentWrapper>
  );
};

export default RecommendationsList;