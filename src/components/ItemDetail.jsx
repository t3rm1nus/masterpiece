import React from 'react';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';
import useThemeStore from '../store/themeStore';
import MaterialItemDetail from './MaterialItemDetail';

const ItemDetail = () => {  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  
  // Stores consolidados
  const { 
    selectedItem, 
    goBackFromDetail,
    processTitle, 
    processDescription 
  } = useViewStore();
  
  const { getMasterpieceBadgeConfig } = useThemeStore();
  const badgeConfig = getMasterpieceBadgeConfig();
  
  if (!selectedItem) return null;
  
  const title = processTitle(selectedItem.title, lang);
  const description = processDescription(selectedItem.description, lang);
  
  // Determinar qué trailer mostrar según el idioma
  const getTrailerUrl = () => {
    if (!selectedItem.trailer) return null;
    
    // Priorizar el idioma actual, si no existe usar el disponible
    if (lang === 'es' && selectedItem.trailer.es) {
      return selectedItem.trailer.es;
    } else if (lang === 'en' && selectedItem.trailer.en) {
      return selectedItem.trailer.en;
    } else if (selectedItem.trailer.es) {
      return selectedItem.trailer.es;
    } else if (selectedItem.trailer.en) {
      return selectedItem.trailer.en;
    }
    return null;
  };
  
  const trailerUrl = getTrailerUrl();

  return (
    <>
      {/* Componente Material UI solo para móviles */}
      <MaterialItemDetail />
      
      {/* Vista clásica solo para desktop */}
      <div className="item-detail desktop-only" style={{ textAlign: 'center', padding: '2rem' }}>
        <button 
          onClick={goBackFromDetail}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'var(--hover-color)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← {t.back || 'Volver'}
        </button>
        
        <div style={{ position: 'relative', display: 'inline-block' }}>          {selectedItem.masterpiece && (
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
          
          <img 
            src={selectedItem.image} 
            alt={title}
            style={{
              maxWidth: '300px',
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}
          />
        </div>
        
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>{title}</h2>
        
        <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#666' }}>
          <span style={{ fontWeight: 'bold' }}>
            {getCategoryTranslation(selectedItem.category)}
          </span>
          {selectedItem.subcategory && (
            <span> - {getSubcategoryTranslation(selectedItem.subcategory)}</span>
          )}
        </div>
        
        {selectedItem.director && (
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            <strong>{t.director || 'Director'}:</strong> {selectedItem.director}
          </p>
        )}
        
        {selectedItem.year && (
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            <strong>{t.year || 'Año'}:</strong> {selectedItem.year}
          </p>
        )}
        
        <p style={{ 
          fontSize: '1.2rem', 
          lineHeight: '1.6', 
          marginBottom: '2rem',
          textAlign: 'left',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          {description}
        </p>
        
        {trailerUrl && (
          <div style={{ marginTop: '2rem' }}>
            <a 
              href={trailerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="trailer-link"
              style={{
                display: 'inline-block',
                padding: '0.8rem 1.5rem',
                background: '#0078d4',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              {t.watch_trailer || 'Ver Trailer'}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemDetail;
