// Handlers and helpers for HomePage

export const handleCategoryClick = (
  setCategory: (category: string) => void,
  setActiveSubcategory: (subcategory: string | null) => void,
  setActiveLanguage: (lang: string) => void
) => (category: string) => {
  setCategory(category);
  setActiveSubcategory(null);
  setActiveLanguage('all');
};

export const handleSpanishCinemaToggle = (toggleSpanishCinema: () => void) => () => {
  toggleSpanishCinema();
};

export const handleMasterpieceToggle = (toggleMasterpiece: () => void) => () => {
  toggleMasterpiece();
};

export const handleItemClick = <T>(goToDetail: (item: T) => void) => (item: T) => {
  goToDetail(item);
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export const handleCloseDetail = (goBackFromDetail: () => void) => () => {
  goBackFromDetail();
}; 