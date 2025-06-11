// Función para normalizar subcategorías (sin traducción)
const normalizeSubcategoryInternal = (subcategory) => {
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