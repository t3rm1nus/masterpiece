import React from 'react';

// Componente de imagen optimizada
export const OptimizedImage = ({ src, alt, className, style }) => (
  <img 
    src={src}
    alt={alt}
    className={className}
    style={style}
    loading="lazy"
    decoding="async"
  />
);

// Componente del badge de obra maestra
export const MasterpieceBadge = ({ config }) => (
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

// Componente para mostrar categorías
export const CategoryLabels = ({ category, subcategory, getCategoryTranslation, getSubcategoryTranslation }) => (
  <>
    <div className="category-label">
      {getCategoryTranslation(category)}
    </div>
    {subcategory && (
      <div className="subcategory-label" style={{ fontSize: '0.95em', color: '#666', textAlign: 'center' }}>
        {getSubcategoryTranslation(subcategory, category)}
      </div>
    )}
  </>
);

// Componente para vista "sin resultados"
export const NoResults = ({ t, randomNotFoundImage }) => {
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