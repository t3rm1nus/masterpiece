// Handlers and helpers for HomePage

export const handleCategoryClick = (setSelectedCategory, setActiveSubcategory, setActiveLanguage) => category => {
  setSelectedCategory(category);
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

export function getCategoryColor(categoryKey) {
  switch (categoryKey) {
    case 'movies':
    case 'peliculas':
      return '#2196f3';
    case 'videogames':
    case 'videojuegos':
      return '#9c27b0';
    case 'books':
    case 'libros':
      return '#4caf50';
    case 'music':
    case 'musica':
      return '#00bcd4';
    case 'podcast':
    case 'podcasts':
      return '#8bc34a';
    case 'boardgames':
    case 'juegos de mesa':
      return '#e91e63';
    case 'comics':
      return '#ff9800';
    case 'documentales':
    case 'documentaries':
      return '#9e9e9e';
    default:
      return '#0078d4';
  }
}
