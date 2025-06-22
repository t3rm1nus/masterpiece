import React from 'react';

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
}) => (
  <div className="special-buttons-container" style={isMobile ? { display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', width: '100%', margin: '8px 0' } : {}}>
    {selectedCategory === 'movies' && (
      <button
        className={`subcategory-btn spanish-cinema${isSpanishCinemaActive ? ' active' : ''}`}
        onClick={handleSpanishCinemaToggle}
      >
        {lang === 'es' ? 'Cine Español' : 'Spanish Cinema'}
      </button>
    )}
    {selectedCategory === 'podcast' && (
      <div key="podcast-languages">
        <button
          className={`subcategory-btn podcast-language${activePodcastLanguages?.includes('es') ? ' active' : ''}`}
          onClick={() => togglePodcastLanguage('es')}
        >
          {lang === 'es' ? 'Español' : 'Spanish'}
        </button>
        <button
          className={`subcategory-btn podcast-language${activePodcastLanguages?.includes('en') ? ' active' : ''}`}
          onClick={() => togglePodcastLanguage('en')}
        >
          {lang === 'es' ? 'Inglés' : 'English'}
        </button>
      </div>
    )}
    {selectedCategory === 'documentales' && (
      <div key="documentales-controls">
        <button
          className={`subcategory-btn podcast-language${activeDocumentaryLanguages?.includes('es') ? ' active' : ''}`}
          onClick={() => toggleDocumentaryLanguage('es')}
        >
          {lang === 'es' ? 'Español' : 'Spanish'}
        </button>
        <button
          className={`subcategory-btn podcast-language${activeDocumentaryLanguages?.includes('en') ? ' active' : ''}`}
          onClick={() => toggleDocumentaryLanguage('en')}
        >
          {lang === 'es' ? 'Inglés' : 'English'}
        </button>
      </div>
    )}
    {!isRecommendedActive && selectedCategory && (
      <button
        className={`subcategory-btn masterpiece-btn${isMasterpieceActive ? ' active' : ''}`}
        onClick={handleMasterpieceToggle}
      >
        {lang === 'es' ? 'Obras Maestras' : 'Masterpieces'}
      </button>
    )}
  </div>
);

export default SpecialButtons;
