import { useEffect, useState } from 'react';

export function useFilteredItems({
  selectedCategory,
  activeSubcategory,
  activeLanguage,
  allData,
  recommendations,
  isSpanishCinemaActive,
  isMasterpieceActive,
  activePodcastLanguages,
  activeDocumentaryLanguages,
  updateFilteredItems,
  isDataInitialized,
}) {
  const [localFiltered, setLocalFiltered] = useState([]);

  useEffect(() => {
    if (!isDataInitialized) return;
    if (allData && Object.keys(allData).length > 0) {
      let filteredData = [];
      if (!selectedCategory || selectedCategory === 'all') {
        if (recommendations && recommendations.length > 0) {
          filteredData = recommendations;
        } else {
          // Fallback: tomar 14 items de allData si recommendations está vacío
          filteredData = Object.values(allData).flat().slice(0, 14);
        }
      } else {
        filteredData = allData[selectedCategory] || [];
      }
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'movies' && isSpanishCinemaActive) {
          filteredData = filteredData.filter(item => {
            const isSpanish =
              item.spanish_cinema === true ||
              item.spanishCinema === true ||
              (item.tags && item.tags.includes('spanish')) ||
              (item.director && [
                'Luis García Berlanga',
                'Pedro Almodóvar',
                'Alejandro Amenábar',
                'Fernando Trueba',
                'Icíar Bollaín',
                'Carlos Saura',
                'Víctor Erice',
              ].some(dir => item.director.includes(dir))) ||
              (item.country && item.country === 'España') ||
              (item.pais && item.pais === 'España') ||
              (item.description && (
                item.description.es?.includes('español') ||
                item.description.es?.includes('España')
              ));
            return isSpanish;
          });
        }
        if (isMasterpieceActive) {
          filteredData = filteredData.filter(item =>
            item.masterpiece === true || item.obra_maestra === true
          );
        }
        if (selectedCategory === 'podcast' && activePodcastLanguages.length > 0) {
          filteredData = filteredData.filter(item =>
            activePodcastLanguages.includes(item.language) ||
            activePodcastLanguages.includes(item.idioma)
          );
        }
        if (selectedCategory === 'documentales' && activeDocumentaryLanguages.length > 0) {
          filteredData = filteredData.filter(item =>
            activeDocumentaryLanguages.includes(item.language) ||
            activeDocumentaryLanguages.includes(item.idioma)
          );
        }
        if (activeSubcategory && activeSubcategory !== 'all') {
          filteredData = filteredData.filter(item =>
            (item.subcategory && item.subcategory.toLowerCase().trim() === activeSubcategory) ||
            (item.categoria && item.categoria.toLowerCase().trim() === activeSubcategory) ||
            (item.genre && item.genre.toLowerCase().trim() === activeSubcategory) ||
            (item.genero && item.generero.toLowerCase().trim() === activeSubcategory)
          );
        }
      }
      filteredData = filteredData.slice().sort((a, b) => {
        const titleA = typeof a.title === 'object' ? (a.title.es || a.title.en || Object.values(a.title)[0] || '') : (a.title || '');
        const titleB = typeof b.title === 'object' ? (b.title.es || b.title.en || Object.values(b.title)[0] || '') : (b.title || '');
        return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
      });
      setLocalFiltered(filteredData);
      updateFilteredItems(filteredData);
    }
  }, [
    selectedCategory,
    activeSubcategory,
    activeLanguage,
    allData,
    recommendations,
    isSpanishCinemaActive,
    isMasterpieceActive,
    activePodcastLanguages,
    activeDocumentaryLanguages,
    updateFilteredItems,
    isDataInitialized,
  ]);
  return localFiltered;
}
