/**
 * Utilidades comunes para la aplicación
 */

/**
 * Obtiene el título por defecto según el idioma
 * @param {string} lang - El idioma actual ('es' o 'en')
 * @returns {string} - El título por defecto en el idioma especificado
 */
export const getDefaultTitle = (lang) => {
  return lang === 'en' ? 'Daily Recommendations' : 'Recomendaciones diarias';
};

/**
 * Función para determinar si un dispositivo es móvil basado en el ancho de la ventana
 * @param {number} width - El ancho de la ventana en píxeles
 * @param {number} threshold - El umbral que define cuando es un dispositivo móvil (por defecto 600px)
 * @returns {boolean} - true si es un dispositivo móvil, false en caso contrario
 */
export const isMobileDevice = (width, threshold = 600) => {
  return width <= threshold;
};

/**
 * Genera un ID único para una recomendación
 * @param {Object} rec - La recomendación
 * @param {number} idx - El índice de la recomendación en la lista
 * @returns {string} - Un ID único para la recomendación
 */
export const generateRecommendationKey = (rec, idx) => {
  return `${rec.category}_${rec.id !== undefined ? rec.id : idx}_${idx}`;
};

/**
 * Obtiene una imagen aleatoria de "no encontrado" de la carpeta notfound
 * @returns {string} - La ruta de la imagen aleatoria
 */
export const getRandomNotFoundImage = () => {
  const notFoundImages = [
    'notfound.webp',
    'notfound2.webp',
    'notfound3.webp',
    'notfound4.webp',
    'notfound5.webp',
    'notfound6.webp',
    'notfound7.webp',
    'notfound8.webp',
    'notfound9.webp'
  ];
  
  const randomIndex = Math.floor(Math.random() * notFoundImages.length);
  return `/imagenes/notfound/${notFoundImages[randomIndex]}`;
};

/**
 * Genera un ID único global para cualquier item
 * @param {Object} item - El item (película, libro, etc.)
 * @returns {string} - Un ID único global
 */
export const generateUniqueId = (item) => {
  // Si el item ya tiene un ID único global, lo devolvemos
  if (item.globalId) return item.globalId;
  
  // Si no tiene ID local, usar el título como fallback
  const localId = item.id !== undefined ? item.id : item.title?.es || item.title || 'unknown';
  
  // Crear ID único: categoria_idLocal
  return `${item.category}_${localId}`;
};

/**
 * Transforma un item para asegurar que tenga un ID único global
 * @param {Object} item - El item original
 * @param {number} fallbackIndex - Índice como fallback si no hay otro ID
 * @returns {Object} - El item con ID único garantizado
 */
export const ensureUniqueId = (item, fallbackIndex = 0) => {
  return {
    ...item,
    globalId: generateUniqueId(item),
    originalId: item.id // Preservar el ID original
  };
};

/**
 * Procesa una lista de items para asegurar IDs únicos
 * @param {Array} items - Lista de items
 * @returns {Array} - Lista con IDs únicos garantizados
 */
export const processItemsWithUniqueIds = (items) => {
  return items.map((item, index) => ensureUniqueId(item, index));
};

/**
 * Busca un item por su ID único global
 * @param {Array} items - Lista de items
 * @param {string} globalId - ID único global a buscar
 * @returns {Object|null} - El item encontrado o null
 */
export const findItemByGlobalId = (items, globalId) => {
  return items.find(item => generateUniqueId(item) === globalId) || null;
};
