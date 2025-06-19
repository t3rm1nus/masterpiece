import React from 'react';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';
import useThemeStore from '../store/themeStore';
import MaterialItemDetail from './MaterialItemDetail';

const ItemDetail = ({ item, onClose, selectedCategory }) => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  
  // Stores consolidados
  const { 
    processTitle, 
    processDescription 
  } = useViewStore();
    const { getMasterpieceBadgeConfig } = useThemeStore();
  const badgeConfig = getMasterpieceBadgeConfig();
  
  // Usar el item pasado como prop en lugar del store
  const selectedItem = item;
  
  if (!selectedItem) return null;
  
  console.log('[ItemDetail] selectedItem.title:', selectedItem.title);
  console.log('[ItemDetail] selectedItem.name:', selectedItem.name);
  console.log('[ItemDetail] lang:', lang);
  
  // Función auxiliar para asegurar que siempre devuelva un string
  const ensureString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[lang] || value.es || value.en || JSON.stringify(value);
    }
    return String(value || '');
  };
  
  const rawTitle = processTitle(selectedItem.title || selectedItem.name, lang);
  const rawDescription = processDescription(selectedItem.description, lang);
  
  const title = ensureString(rawTitle);
  const description = ensureString(rawDescription);
  
  console.log('[ItemDetail] processed title:', title);
  console.log('[ItemDetail] processed description:', description);
  
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
      <MaterialItemDetail item={selectedItem} />
      
      {/* Vista clásica solo para desktop */}
      <div className="item-detail-page desktop-only">
        <div className="item-detail-container">
          <div className={`item-detail-content ${selectedItem.masterpiece ? 'masterpiece-item' : 'normal-item'} ${selectedItem.category}`}>
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
          
          <div className="item-detail-image-container">            <img 
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
              <strong>{t.director || 'Director'}:</strong> {ensureString(selectedItem.director)}
            </p>
          )}{selectedItem.year && (
            <p className="item-detail-year">
              <strong>{t.year || 'Año'}:</strong> {selectedItem.year}
            </p>
          )}
            {/* Datos específicos para documentales */}
          {selectedItem.category === 'documentales' && (
            <div className="documentales-specific-details">
              <div className="item-info">                {selectedItem.author && (
                  <div className="info-row">
                    <span className="info-label">{t.documentales?.author || 'Autor'}: </span>
                    <span className="info-value">{ensureString(selectedItem.author)}</span>
                  </div>
                )}
                {selectedItem.duration && (
                  <div className="info-row">
                    <span className="info-label">{t.documentales?.duration || 'Duración'}: </span>
                    <span className="info-value">{ensureString(selectedItem.duration)}</span>
                  </div>
                )}
                {selectedItem.language && (
                  <div className="info-row">
                    <span className="info-label">{t.documentales?.language || 'Idioma'}: </span>
                    <span className="info-value">{t.filters?.languages?.[selectedItem.language] || ensureString(selectedItem.language)}</span>
                  </div>
                )}
                {selectedItem.episodes && (
                  <div className="info-row">
                    <span className="info-label">{t.documentales?.episodes || 'Episodios'}: </span>
                    <span className="info-value">{ensureString(selectedItem.episodes)}</span>
                  </div>
                )}
                {selectedItem.year && (
                  <div className="info-row">
                    <span className="info-label">{t.documentales?.year || 'Año'}: </span>
                    <span className="info-value">{ensureString(selectedItem.year)}</span>
                  </div>
                )}
                {selectedItem.country && (
                  <div className="info-row">
                    <span className="info-label">{t.documentales?.country || 'País'}: </span>
                    <span className="info-value">{ensureString(selectedItem.country)}</span>
                  </div>
                )}
                {selectedItem.director && (
                  <div className="info-row">
                    <span className="info-label">{t.documentales?.director || 'Director'}: </span>
                    <span className="info-value">{ensureString(selectedItem.director)}</span>
                  </div>
                )}</div>

              {selectedItem.link && (
                <div className="item-detail-trailer">
                  <a 
                    href={selectedItem.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="trailer-link"
                  >
                    {t.documentales?.watch || 'Ver documental'}
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
                        ? ensureString(selectedItem.minPlayers) 
                        : `${ensureString(selectedItem.minPlayers)}-${ensureString(selectedItem.maxPlayers)}`)
                    : ensureString(selectedItem.minPlayers || selectedItem.maxPlayers)
                  }
                </p>
              )}
              
              {selectedItem.playTime && (
                <p className="item-detail-playtime">
                  <strong>{lang === 'es' ? 'Duración' : 'Play Time'}: </strong> {ensureString(selectedItem.playTime)} {lang === 'es' ? 'min' : 'min'}
                </p>
              )}
              
              {selectedItem.age && (
                <p className="item-detail-age">
                  <strong>{lang === 'es' ? 'Edad' : 'Age'}:</strong> {ensureString(selectedItem.age)}
                </p>
              )}
            </div>          )}
            {/* Datos específicos para videojuegos */}
          {selectedItem.category === 'videogames' && (
            <div className="videogame-details">
              {selectedItem.author && (
                <p className="item-detail-developer">
                  <strong>{lang === 'es' ? 'Desarrollador' : 'Developer'}:</strong> {ensureString(selectedItem.author)}
                </p>
              )}
              
              {selectedItem.platforms && (
                <p className="item-detail-platforms">
                  <strong>{lang === 'es' ? 'Plataformas' : 'Platforms'}:</strong> {ensureString(selectedItem.platforms)}
                </p>
              )}
            </div>
          )}
          
          {selectedItem.category === 'podcast' && selectedItem.author && (
            <p className="item-detail-author">
              <strong>{t.author || 'Autor'}:</strong> {ensureString(selectedItem.author)}
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
                className="spotify-link"              >
                Escuchar en Spotify
              </a>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
