import React from 'react';
import UiButton from '../ui/UiButton';
import { getCategoryGradient } from '../../utils/categoryPalette';
import useAppStore from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

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
  handleSpanishSeriesToggle,
  musicFilterType,
  setMusicFilterType,
  activeSubcategory,
  battleFilterActive,
  setBattleFilterActive
}) => {
  const navigate = useNavigate();
  // Botones especiales para música (tipo canción/álbum)
  const showMusicButtons = selectedCategory === 'music';
  // Nuevo: idioma activo para podcasts/documentales
  const activePodcastDocumentaryLanguage = useAppStore(s => s.activePodcastDocumentaryLanguage);
  const setActivePodcastDocumentaryLanguage = useAppStore(s => s.setActivePodcastDocumentaryLanguage);

  // Solo mostrar para podcasts/documentales
  const showLanguageButtons = selectedCategory === 'podcast' || selectedCategory === 'documentales';

  return (
    <div className="special-buttons-container" style={isMobile ? { display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', width: '100%', margin: '8px 0' } : {}}>
      {/* Botones especiales para música: canción y álbum */}
      {showMusicButtons && (
        <>
          <UiButton
            className={`subcategory-btn music-btn${musicFilterType === 'song' ? ' active' : ''}`}
            variant={musicFilterType === 'song' ? 'contained' : 'outlined'}
            color="secondary"
            size="small"
            onClick={() => {
              setMusicFilterType(musicFilterType === 'song' ? null : 'song');
              if (battleFilterActive) setBattleFilterActive(false);
            }}
            sx={{
              margin: '0 4px',
              minWidth: 90,
              background: '#fff !important',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: musicFilterType === 'song' ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Canción' : 'Song'}
          </UiButton>
          <UiButton
            className={`subcategory-btn music-btn${musicFilterType === 'album' ? ' active' : ''}`}
            variant={musicFilterType === 'album' ? 'contained' : 'outlined'}
            color="secondary"
            size="small"
            onClick={() => {
              setMusicFilterType(musicFilterType === 'album' ? null : 'album');
              if (battleFilterActive) setBattleFilterActive(false);
            }}
            sx={{
              margin: '0 4px',
              minWidth: 90,
              background: '#fff !important',
              color: '#757575',
              borderColor: '#bdbdbd',
              fontWeight: musicFilterType === 'album' ? 700 : 500
            }}
          >
            {lang === 'es' ? 'Álbum' : 'Album'}
          </UiButton>
          {/* Botón especial Batalla/Battle solo si subcategoría rap activa */}
          {activeSubcategory === 'rap' && (
            <UiButton
              className={`subcategory-btn battle-btn${battleFilterActive ? ' active' : ''}`}
              variant={battleFilterActive ? 'contained' : 'outlined'}
              color="secondary"
              size="small"
              onClick={() => {
                setBattleFilterActive(!battleFilterActive);
                if (musicFilterType) setMusicFilterType(null);
              }}
              sx={{
                margin: '0 4px',
                minWidth: 90,
                background: '#fff !important',
                color: '#757575',
                borderColor: '#bdbdbd',
                fontWeight: battleFilterActive ? 700 : 500
              }}
            >
              {lang === 'es' ? 'Batalla' : 'Battle'}
            </UiButton>
          )}
          {/* Botón especial Sesión/Session solo si subcategoría electronica activa (acepta variantes de nombre) */}
          {['electronica', 'electronic', 'electrónica'].includes((activeSubcategory || '').toLowerCase()) && (
            <UiButton
              className={`subcategory-btn session-btn${musicFilterType === 'session' ? ' active' : ''}`}
              variant={musicFilterType === 'session' ? 'contained' : 'outlined'}
              color="secondary"
              size="small"
              onClick={() => {
                setMusicFilterType(musicFilterType === 'session' ? null : 'session');
                if (battleFilterActive) setBattleFilterActive(false);
              }}
              sx={{
                margin: '0 4px',
                minWidth: 90,
                background: '#fff !important',
                color: '#757575',
                borderColor: '#bdbdbd',
                fontWeight: musicFilterType === 'session' ? 700 : 500
              }}
            >
              {lang === 'es' ? 'Sesión' : 'Session'}
            </UiButton>
          )}
        </>
      )}
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
              background: '#fff !important', // Forzar fondo blanco incluso activo
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
              background: '#fff !important', // Forzar fondo blanco incluso activo
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
            minWidth: '90px !important',
            minHeight: '32px !important',
            fontSize: '0.95rem !important',
            padding: '4px 14px !important',
            background: '#fff !important',
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
            background: '#fff !important', // Forzar fondo blanco incluso activo
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
            background: '#fff !important',
            color: '#757575', // Gris siempre en móvil
            borderColor: '#bdbdbd',
            fontWeight: isSpanishSeriesActive ? 700 : 500
          }}
        >
          {lang === 'es' ? 'Series Españolas' : 'Spanish Series'}
        </UiButton>
      )}
      {/* Botón de donaciones (ejemplo, si existe) */}
      {/* <UiButton onClick={() => navigate('/donaciones')}>Donaciones</UiButton> */}
      {/* Botón de cómo descargar (ejemplo, si existe) */}
      {/* <UiButton onClick={() => navigate('/como-descargar')}>Cómo descargar</UiButton> */}
    </div>
  );
};

export default SpecialButtons;
