import React from 'react';
import UiButton from '../ui/UiButton';
import { getCategoryGradient } from '../../utils/categoryUtils';

/**
 * SpecialButtons: Botones especiales contextuales para categorías.
 * Permite customizar estilos, callbacks, visibilidad y textos.
 *
 * Props:
 * - selectedCategory: string (categoría activa)
 * - isSpanishCinemaActive: boolean (estado del botón Cine Español)
 * - handleSpanishCinemaToggle: function (callback para alternar Cine Español)
 * - isMasterpieceActive: boolean (estado del botón Obras Maestras)
 * - handleMasterpieceToggle: function (callback para alternar Obras Maestras)
 * - activePodcastLanguages: array (idiomas activos en podcast)
 * - togglePodcastLanguage: function (callback para alternar idioma podcast)
 * - activeDocumentaryLanguages: array (idiomas activos en documentales)
 * - toggleDocumentaryLanguage: function (callback para alternar idioma documental)
 * - lang: string (idioma actual)
 * - isRecommendedActive: boolean (oculta botón Obras Maestras si true)
 * - isMobile: boolean (aplica estilos móviles)
 *
 * Ejemplo de uso:
 * <SpecialButtons
 *   selectedCategory="movies"
 *   isSpanishCinemaActive={true}
 *   handleSpanishCinemaToggle={() => {}}
 *   isMasterpieceActive={false}
 *   handleMasterpieceToggle={() => {}}
 *   lang="es"
 *   isMobile={false}
 * />
 */

const SpecialButtons = ({
  selectedCategory,
  isSpanishCinemaActive,
  handleSpanishCinemaToggle,
  isMasterpieceActive,
  handleMasterpieceToggle,
  activePodcastLanguages,
  togglePodcastLanguage,
  activeDocumentaryLanguages,
  toggleDocumentaryLanguage,
  lang,
  isRecommendedActive,
  isMobile
}) => {
  // Fallback visual: ELIMINADO. Los botones deben reflejar el estado real del array (ningún idioma activo = ambos blancos)
  let podcastLangs = activePodcastLanguages;
  let docuLangs = activeDocumentaryLanguages;

  return (
    <div className="special-buttons-container" style={isMobile ? { display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', width: '100%', margin: '8px 0' } : {}}>
      {selectedCategory === 'podcast' && (
        <>
          {console.log('activePodcastLanguages', podcastLangs)}
        </>
      )}
      {selectedCategory === 'documentales' && (
        <>
          {console.log('activeDocumentaryLanguages', docuLangs)}
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
      {selectedCategory === 'podcast' && (
        <div key="podcast-languages">
          <UiButton
            className={`subcategory-btn podcast-language${podcastLangs?.includes('es') ? ' active' : ''}`}
            variant="outlined"
            size="small"
            onClick={() => togglePodcastLanguage('es')}
            sx={{
              margin: '0 4px',
              minWidth: 80,
              background: podcastLangs?.includes('es') ? getCategoryGradient(selectedCategory) : '#fff !important',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: podcastLangs?.includes('es') ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Español' : 'Spanish'}
          </UiButton>
          <UiButton
            className={`subcategory-btn podcast-language${podcastLangs?.includes('en') ? ' active' : ''}`}
            variant="outlined"
            size="small"
            onClick={() => togglePodcastLanguage('en')}
            sx={{
              margin: '0 4px',
              minWidth: 80,
              background: podcastLangs?.includes('en') ? getCategoryGradient(selectedCategory) : '#fff !important',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: podcastLangs?.includes('en') ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Inglés' : 'English'}
          </UiButton>
        </div>
      )}
      {selectedCategory === 'documentales' && (
        <div key="documentales-controls">
          <UiButton
            className={`subcategory-btn podcast-language${docuLangs?.includes('es') ? ' active' : ''}`}
            variant="outlined"
            size="small"
            onClick={() => toggleDocumentaryLanguage('es')}
            sx={{
              margin: '0 4px',
              minWidth: 80,
              background: docuLangs?.includes('es') ? getCategoryGradient(selectedCategory) : '#fff !important',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: docuLangs?.includes('es') ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Español' : 'Spanish'}
          </UiButton>
          <UiButton
            className={`subcategory-btn podcast-language${docuLangs?.includes('en') ? ' active' : ''}`}
            variant="outlined"
            size="small"
            onClick={() => toggleDocumentaryLanguage('en')}
            sx={{
              margin: '0 4px',
              minWidth: 80,
              background: docuLangs?.includes('en') ? getCategoryGradient(selectedCategory) : '#fff !important',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: docuLangs?.includes('en') ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Inglés' : 'English'}
          </UiButton>
        </div>
      )}
      {!isRecommendedActive && selectedCategory && (
        <UiButton
          className={`subcategory-btn masterpiece-btn${isMasterpieceActive ? ' active' : ''}`}
          variant={isMasterpieceActive ? 'contained' : 'outlined'}
          color="secondary"
          size="small"
          onClick={handleMasterpieceToggle}
          sx={{ margin: '0 4px', minWidth: 110 }}
        >
          {lang === 'es' ? 'Obras Maestras' : 'Masterpieces'}
        </UiButton>
      )}
    </div>
  );
};

export default SpecialButtons;
