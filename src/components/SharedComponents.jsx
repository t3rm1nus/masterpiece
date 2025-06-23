import React from 'react';

// Componente de imagen optimizada
export const OptimizedImage = ({ src, alt, className, style, loading = 'lazy', decoding = 'async', fallback, ...props }) => (
  <img 
    src={src}
    alt={alt}
    className={className}
    style={style}
    loading={loading}
    decoding={decoding}
    onError={e => { if (fallback) e.target.src = fallback; }}
    {...props}
  />
);

// Componente del badge de obra maestra
export const MasterpieceBadge = ({ config, tooltip = 'Obra maestra', size = 56, ...props }) => (
  <span className="masterpiece-badge" title={tooltip} {...props}>
    <svg
      width={size}
      height={size}
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
export const CategoryLabels = ({ category, subcategory, getCategoryTranslation, getSubcategoryTranslation, renderCategory, renderSubcategory, sx = {}, ...props }) => (
  <div style={sx} {...props}>
    {renderCategory
      ? renderCategory(category)
      : <div className="category-label">{getCategoryTranslation(category)}</div>}
    {subcategory && (
      renderSubcategory
        ? renderSubcategory(subcategory, category)
        : <div className="subcategory-label" style={{ fontSize: '0.95em', color: '#666', textAlign: 'center' }}>{getSubcategoryTranslation(subcategory, category)}</div>
    )}
  </div>
);

// Componente para vista "sin resultados"
export const NoResults = ({ t, randomNotFoundImage, image, text, subtext, children, sx = {}, ...props }) => {
  const notFoundImageUrl = image || (randomNotFoundImage?.() || '/favicon.png');
  return (
    <div className="no-results-container" style={sx} {...props}>
      <p className="no-results-text">{text || t?.no_results || 'No se encontraron resultados'}</p>
      <p className="no-results-subtext">{subtext || 'Prueba con otros filtros o categorías'}</p>
      <img 
        src={notFoundImageUrl} 
        alt="No se encontraron resultados" 
        className="no-results-image"
      />
      {children}
    </div>
  );
};