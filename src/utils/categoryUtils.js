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
// getCategoryColor centralizado aquí, eliminar duplicados en otros archivos
export function getCategoryColor(category, theme, intenseForSelect) {
  switch (category) {
    case 'movies':
    case 'peliculas':
      return '#90caf9'; // azul pastel claro
    case 'videogames':
    case 'videojuegos':
      return '#ce93d8'; // lila pastel
    case 'books':
    case 'libros':
      return '#a5d6a7'; // verde menta pastel
    case 'music':
    case 'musica':
      return '#80cbc4'; // verde agua pastel
    case 'podcast':
    case 'podcasts':
      return '#8bc34a'; // verde unificado
    case 'boardgames':
    case 'juegos de mesa':
      return '#f8bbd0'; // rosa pastel
    case 'comics':
      return '#ffcc80'; // naranja pastel suave
    case 'documentales':
    case 'documentaries':
      return '#ffab91'; // rojo pastel claro
    case 'series':
      return '#b39ddb'; // lavanda pastel
    default:
      return '#0078d4';
  }
}

// Función utilitaria para obtener el degradado de la categoría
import { getCategoryGradient as getCentralizedCategoryGradient } from './categoryPalette';

export function getCategoryGradient(category) {
  return getCentralizedCategoryGradient(category);
}

// Export alternativo para compatibilidad con imports antiguos
export { getCategoryColor as categoryColor };

// Exportar versión especial para selects
export function getCategoryColorForSelect(category, theme) {
  return getCategoryColor(category, theme, true);
}

// ...otros helpers de categorías a futuro...