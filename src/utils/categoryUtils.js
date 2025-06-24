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
export function getCategoryGradient(category) {
  switch (category) {
    case 'movies':
    case 'peliculas':
      return 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)';
    case 'videogames':
    case 'videojuegos':
      return 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)';
    case 'books':
    case 'libros':
      return 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)';
    case 'music':
    case 'musica':
      return 'linear-gradient(135deg, #e0f2f1 0%, #80cbc4 100%)';
    case 'podcast':
    case 'podcasts':
      return 'linear-gradient(135deg, #dcedc8 0%, #8bc34a 100%)';
    case 'boardgames':
    case 'juegos de mesa':
      return 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)';
    case 'comics':
      return 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)';
    case 'documentales':
    case 'documentaries':
      return 'linear-gradient(135deg, #ffebee 0%, #ffab91 100%)'; // degradado rojo claro
    case 'series':
      return 'linear-gradient(135deg, #ede7f6 0%, #b39ddb 100%)';
    default:
      return 'linear-gradient(135deg, #f5fafd 0%, #bbdefb 100%)';
  }
}

// Export alternativo para compatibilidad con imports antiguos
export { getCategoryColor as categoryColor };

// Exportar versión especial para selects
export function getCategoryColorForSelect(category, theme) {
  return getCategoryColor(category, theme, true);
}

// ...otros helpers de categorías a futuro...