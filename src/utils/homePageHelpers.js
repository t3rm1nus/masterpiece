// Handlers and helpers for HomePage

export const handleCategoryClick = (setCategory, setActiveSubcategory, setActiveLanguage) => category => {
  setCategory(category);
  setActiveSubcategory(null);
  setActiveLanguage('all');
};

export const handleSpanishCinemaToggle = toggleSpanishCinema => () => {
  toggleSpanishCinema();
};

export const handleMasterpieceToggle = toggleMasterpiece => () => {
  toggleMasterpiece();
};

export const handleItemClick = (goToDetail) => item => {
  goToDetail(item);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const handleCloseDetail = goBackFromDetail => () => {
  goBackFromDetail();
};
