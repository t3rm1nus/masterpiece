// Función para normalizar subcategorías (sin traducción)
export const normalizeSubcategoryInternal = (subcategory) => {
  if (!subcategory) return '';
  const normalized = subcategory.toLowerCase().trim();
  switch (normalized) {
    case 'action':
    case 'acción': return 'action';
    case 'animation':
    case 'animación': return 'animation';
    case 'fantasy':
    case 'fantasía': return 'fantasy';
    case 'comedy':
    case 'comedia': return 'comedy';
    case 'adventure':
    case 'aventura': return 'adventure';
    case 'sci-fi':
    case 'ciencia ficción': return 'sci-fi';
    default: return normalized;
  }
};

// Función para traducir subcategorías normalizadas
const translateSubcategory = (normalizedSubcategory, lang) => {
  if (lang === 'es') {
    switch (normalizedSubcategory) {
      case 'action': return 'acción';
      case 'animation': return 'animación';
      case 'fantasy': return 'fantasía';
      case 'comedy': return 'comedia';
      case 'adventure': return 'aventura';
      case 'sci-fi': return 'ciencia ficción';
      default: return normalizedSubcategory;
    }
  } else {
    switch (normalizedSubcategory) {
      case 'acción': return 'action';
      case 'animación': return 'animation';
      case 'fantasía': return 'fantasy';
      case 'comedia': return 'comedy';
      case 'aventura': return 'adventure';
      case 'ciencia ficción': return 'sci-fi';
      default: return normalizedSubcategory;
    }
  }
};

// Función para normalizar subcategorías (pública)
export const normalizeSubcategory = (subcategory, lang) => {
  const normalized = normalizeSubcategoryInternal(subcategory);
  return translateSubcategory(normalized, lang);
};

// Función para filtrar items por subcategoría
export const filterItemsBySubcategory = (items, subcategory, lang) => {
  const normalizedSubcategory = normalizeSubcategoryInternal(subcategory);
  return items.filter(item => 
    normalizeSubcategoryInternal(item.subcategory) === normalizedSubcategory
  );
};

// Función para obtener subcategorías únicas
export const getUniqueSubcategories = (items, lang) => {
  const subcategories = new Set(
    items.map(item => normalizeSubcategoryInternal(item.subcategory))
  );
  return Array.from(subcategories).filter(Boolean);
};

// Helpers para categorías y colores

export function getCategoryColor(category, theme) {
  switch (category) {
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
      return theme?.palette?.primary?.main || '#1976d2';
  }
}
// ...otros helpers de categorías a futuro...