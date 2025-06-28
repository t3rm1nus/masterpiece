import React from 'react';
import UiButton from '../ui/UiButton';
import { getCategoryGradient } from '../../utils/categoryPalette';
import useAppStore from '../../store/useAppStore';

/**
 * SpecialButtons: Botones especiales contextuales para categorías.
 * Incluye botón de Obras Maestras (masterpiece), Cine Español, Series Españolas y ahora idioma para podcasts/documentales.
 */

const SpecialButtons = ({
  selectedCategory,
  isSpanishCinemaActive,
  handleSpanishCinemaToggle,
  isMasterpieceActive,
  handleMasterpieceToggle,
  lang,
  isRecommendedActive,
  isMobile,
  isSpanishSeriesActive,
  handleSpanishSeriesToggle
}) => {
  // Nuevo: idioma activo para podcasts/documentales
  const activePodcastDocumentaryLanguage = useAppStore(s => s.activePodcastDocumentaryLanguage);
  const setActivePodcastDocumentaryLanguage = useAppStore(s => s.setActivePodcastDocumentaryLanguage);

  // Solo mostrar para podcasts/documentales
  const showLanguageButtons = selectedCategory === 'podcast' || selectedCategory === 'documentales';

  return (
    <div className="special-buttons-container" style={isMobile ? { display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', width: '100%', margin: '8px 0' } : {}}>
      {/* Botones de idioma para podcasts/documentales */}
      {showLanguageButtons && (
        <>
          <UiButton
            className={`subcategory-btn lang-btn${activePodcastDocumentaryLanguage === 'es' ? ' active' : ''}`}
            variant={activePodcastDocumentaryLanguage === 'es' ? 'contained' : 'outlined'}
            color="secondary"
            size="small"
            onClick={() => setActivePodcastDocumentaryLanguage(activePodcastDocumentaryLanguage === 'es' ? null : 'es')}
            sx={{
              margin: '0 4px',
              minWidth: 90,
              background: activePodcastDocumentaryLanguage === 'es' ? getCategoryGradient(selectedCategory) : '#fff',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: activePodcastDocumentaryLanguage === 'es' ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Español' : 'Spanish'}
          </UiButton>
          <UiButton
            className={`subcategory-btn lang-btn${activePodcastDocumentaryLanguage === 'en' ? ' active' : ''}`}
            variant={activePodcastDocumentaryLanguage === 'en' ? 'contained' : 'outlined'}
            color="secondary"
            size="small"
            onClick={() => setActivePodcastDocumentaryLanguage(activePodcastDocumentaryLanguage === 'en' ? null : 'en')}
            sx={{
              margin: '0 4px',
              minWidth: 90,
              background: activePodcastDocumentaryLanguage === 'en' ? getCategoryGradient(selectedCategory) : '#fff',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: activePodcastDocumentaryLanguage === 'en' ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Inglés' : 'English'}
          </UiButton>
        </>
      )}
      {selectedCategory === 'movies' && (
        <UiButton
          className={`subcategory-btn spanish-cinema${isSpanishCinemaActive ? ' active' : ''}`}
          variant={isSpanishCinemaActive ? 'contained' : 'outlined'}
          color="secondary"
          size="small"
          onClick={handleSpanishCinemaToggle}
          sx={{
            margin: '0 4px',
            minWidth: 90,
            background: isSpanishCinemaActive ? getCategoryGradient(selectedCategory) : '#fff',
            color: '#757575',
            borderColor: '#bdbdbd',
            fontWeight: isSpanishCinemaActive ? 700 : 500
          }}
        >
          {lang === 'es' ? 'Cine Español' : 'Spanish Cinema'}
        </UiButton>
      )}
      {/* Botón Obras Maestras (masterpiece) para cualquier categoría excepto 'all' */}
      {selectedCategory && selectedCategory !== 'all' && !isRecommendedActive && (
        <UiButton
          className={`subcategory-btn masterpiece-btn${isMasterpieceActive ? ' active' : ''}`}
          variant={isMasterpieceActive ? 'contained' : 'outlined'}
          color="secondary"
          size="small"
          onClick={handleMasterpieceToggle}
          sx={{
            margin: '0 4px',
            minWidth: 90,
            background: isMasterpieceActive ? getCategoryGradient(selectedCategory) : '#fff',
            color: '#757575',
            borderColor: '#bdbdbd',
            fontWeight: isMasterpieceActive ? 700 : 500
          }}
        >
          {lang === 'es' ? 'Obras Maestras' : 'Masterpieces'}
        </UiButton>
      )}
      {/* Botón Series Españolas solo en desktop y solo para series */}
      {selectedCategory === 'series' && !isMobile && (
        <UiButton
          className={`subcategory-btn test-btn${isSpanishSeriesActive ? ' active' : ''}`}
          variant={isSpanishSeriesActive ? 'contained' : 'outlined'}
          color="secondary"
          size="small"
          onClick={handleSpanishSeriesToggle}
          sx={{
            margin: '0 4px',
            minWidth: 90,
            background: isSpanishSeriesActive ? getCategoryGradient(selectedCategory) : '#fff',
            color: '#757575',
            borderColor: '#bdbdbd',
            fontWeight: isSpanishSeriesActive ? 700 : 500
          }}
        >
          {lang === 'es' ? 'Series Españolas' : 'Spanish Series'}
        </UiButton>
      )}
      {/* Botón Series Españolas solo en mobile y solo para series */}
      {selectedCategory === 'series' && isMobile && (
        <UiButton
          className={`subcategory-btn test-btn${isSpanishSeriesActive ? ' active' : ''}`}
          variant={isSpanishSeriesActive ? 'contained' : 'outlined'}
          color="secondary"
          size="small"
          onClick={handleSpanishSeriesToggle}
          sx={{
            margin: '0 4px',
            minWidth: 90,
            background: isSpanishSeriesActive ? getCategoryGradient(selectedCategory) : '#fff',
            color: '#757575',
            borderColor: '#bdbdbd',
            fontWeight: isSpanishSeriesActive ? 700 : 500
          }}
        >
          {lang === 'es' ? 'Series Españolas' : 'Spanish Series'}
        </UiButton>
      )}
    </div>
  );
};

export default SpecialButtons;
