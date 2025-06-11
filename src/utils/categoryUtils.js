// Función para normalizar subcategorías
export const normalizeSubcategory = (subcategory, lang) => {
  if (!subcategory) return '';
  const normalizedSubcategory = subcategory.toLowerCase().trim();
  if (lang === 'es') {
    switch (normalizedSubcategory) {
      case 'action': return 'acción';
      case 'animation': return 'animación';
      case 'fantasy': return 'fantasía';
      case 'comedy': return 'comedia';
      case 'adventure': return 'aventura';
      default: return normalizedSubcategory;
    }
  } else {
    switch (normalizedSubcategory) {
      case 'acción': return 'action';
      case 'animación': return 'animation';
      case 'fantasía': return 'fantasy';
      case 'comedia': return 'comedy';
      case 'aventura': return 'adventure';
      default: return normalizedSubcategory;
    }
  }
};

// Función para filtrar items por subcategoría
export const filterItemsBySubcategory = (items, subcategory, lang) => {
  const normalizedSubcategory = normalizeSubcategory(subcategory, lang);
  return items.filter(item => 
    normalizeSubcategory(item.subcategory, lang) === normalizedSubcategory
  );
};

// Función para obtener subcategorías únicas
export const getUniqueSubcategories = (items, lang) => {
  const subcategories = new Set(
    items.map(item => normalizeSubcategory(item.subcategory, lang))
  );
  return Array.from(subcategories).filter(Boolean);
}; 