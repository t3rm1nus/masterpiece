import React from 'react';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';
import useThemeStore from '../store/themeStore';
import MaterialItemDetail from './MaterialItemDetail';

const ItemDetail = () => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  
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
  
  const title = processTitle(selectedItem.title || selectedItem.name, lang);
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
    <>      {/* Componente Material UI solo para móviles */}
      <MaterialItemDetail item={selectedItem} />{/* Vista clásica solo para desktop */}
      <div className="item-detail-page desktop-only">
        <div className={`item-detail-container ${selectedItem.masterpiece ? 'masterpiece-item' : 'normal-item'} ${selectedItem.category}`}>
          {selectedItem.masterpiece && (
            <span className="masterpiece-badge-container" title="Obra maestra">
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
          
          <div className="item-detail-image-container">
            <img 
              src={selectedItem.image} 
              alt={title}
              className="item-detail-image"
            />
          </div>
          <h2 className="item-detail-title">{title}</h2>
          
          {/* Solo mostrar categoría para otras categorías, no para juegos de mesa ni videojuegos */}
          {selectedItem.category !== 'boardgames' && selectedItem.category !== 'videogames' && (
            <div className="item-detail-category">
              <span className="category-name">
                {getCategoryTranslation(selectedItem.category)}
              </span>
              {selectedItem.subcategory && (
                <span className="subcategory-name">{getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}</span>
              )}
            </div>
          )}
          
          {selectedItem.director && (
            <p className="item-detail-director">
              <strong>{t.director || 'Director'}:</strong> {selectedItem.director}
            </p>
          )}          {selectedItem.year && (
            <p className="item-detail-year">
              <strong>{t.year || 'Año'}:</strong> {selectedItem.year}
            </p>
          )}
          
          {/* Datos específicos para documentales */}
          {selectedItem.category === 'documentales' && (
            <div className="item-detail">
              <div className="item-header">
                <h2>{title}</h2>
                <div className="item-meta">
                  <span className="item-category">
                    {t.categories[selectedItem.category]}
                  </span>
                  {selectedItem.subcategory && (
                    <span className="item-subcategory">
                      {t.subcategories.documentales[selectedItem.subcategory] || selectedItem.subcategory}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="item-info">
                {selectedItem.author && (
                  <div className="info-row">
                    <span className="info-label">{t.documentary.author}:</span>
                    <span className="info-value">{selectedItem.author}</span>
                  </div>
                )}
                {selectedItem.duration && (
                  <div className="info-row">
                    <span className="info-label">{t.documentary.duration}:</span>
                    <span className="info-value">{selectedItem.duration}</span>
                  </div>
                )}
                {selectedItem.language && (
                  <div className="info-row">
                    <span className="info-label">{t.documentary.language}:</span>
                    <span className="info-value">{t.filters.languages[selectedItem.language] || selectedItem.language}</span>
                  </div>
                )}
                {selectedItem.episodes && (
                  <div className="info-row">
                    <span className="info-label">{t.documentary.episodes}:</span>
                    <span className="info-value">{selectedItem.episodes}</span>
                  </div>
                )}
                {selectedItem.year && (
                  <div className="info-row">
                    <span className="info-label">{t.documentary.year}:</span>
                    <span className="info-value">{selectedItem.year}</span>
                  </div>
                )}
                {selectedItem.country && (
                  <div className="info-row">
                    <span className="info-label">{t.documentary.country}:</span>
                    <span className="info-value">{selectedItem.country}</span>
                  </div>
                )}
                {selectedItem.director && (
                  <div className="info-row">
                    <span className="info-label">{t.documentary.director}:</span>
                    <span className="info-value">{selectedItem.director}</span>
                  </div>
                )}
              </div>

              {selectedItem.description && (
                <div className="item-description">
                  <p>{selectedItem.description}</p>
                </div>
              )}

              {selectedItem.link && (
                <div className="item-actions">
                  <a 
                    href={selectedItem.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="watch-button"
                  >
                    {t.documentary.watch}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Datos técnicos para juegos de mesa */}
          {selectedItem.category === 'boardgames' && (
            <div className="boardgame-details">              {(selectedItem.minPlayers || selectedItem.maxPlayers) && (
                <p className="item-detail-players">
                  <strong>{lang === 'es' ? 'Jugadores' : 'Players'}:</strong>{' '}
                  {selectedItem.minPlayers && selectedItem.maxPlayers 
                    ? (selectedItem.minPlayers === selectedItem.maxPlayers 
                        ? selectedItem.minPlayers 
                        : `${selectedItem.minPlayers}-${selectedItem.maxPlayers}`)
                    : selectedItem.minPlayers || selectedItem.maxPlayers
                  }
                </p>
              )}
              
              {selectedItem.playTime && (
                <p className="item-detail-playtime">
                  <strong>{lang === 'es' ? 'Duración' : 'Play Time'}:</strong> {selectedItem.playTime} {lang === 'es' ? 'min' : 'min'}
                </p>
              )}
              
              {selectedItem.age && (
                <p className="item-detail-age">
                  <strong>{lang === 'es' ? 'Edad' : 'Age'}:</strong> {selectedItem.age}
                </p>
              )}
            </div>          )}
          
          {/* Datos específicos para videojuegos */}
          {selectedItem.category === 'videogames' && (
            <div className="videogame-details">
              {selectedItem.author && (
                <p className="item-detail-developer">
                  <strong>{lang === 'es' ? 'Desarrollador' : 'Developer'}:</strong> {selectedItem.author}
                </p>
              )}
              
              {selectedItem.platfomrs && (
                <p className="item-detail-platforms">
                  <strong>{lang === 'es' ? 'Plataformas' : 'Platforms'}:</strong> {selectedItem.platfomrs}
                </p>
              )}
            </div>
          )}
          
          {selectedItem.category === 'podcast' && selectedItem.author && (
            <p className="item-detail-author">
              <strong>{t.author || 'Autor'}:</strong> {selectedItem.author}
            </p>
          )}
            <p className={`item-detail-description ${selectedItem.category === 'boardgames' ? 'boardgame-description' : ''}`}>
            {description}
          </p>
            {trailerUrl && (
            <div className="item-detail-trailer">
              <a 
                href={trailerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="trailer-link"
              >
                {t.watch_trailer || 'Ver Trailer'}
              </a>
            </div>
          )}
          
          {selectedItem.category === 'podcast' && selectedItem.link && (
            <div className="item-detail-spotify">
              <a 
                href={selectedItem.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="spotify-link"
              >
                Escuchar en Spotify
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
