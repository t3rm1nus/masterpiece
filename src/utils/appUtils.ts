/**
 * Utilidades comunes para la aplicación
 */
import { Language } from '../types';
import { Item } from '../types/data';

// Interfaz para items con ID global
interface ItemWithGlobalId {
  globalId: string;
  originalId?: string | number;
  [key: string]: any;
}

/**
 * Obtiene el título por defecto según el idioma
 * @param lang - El idioma actual ('es' o 'en')
 * @returns El título por defecto en el idioma especificado
 */
export const getDefaultTitle = (lang: Language): string => {
  return lang === 'en' ? 'Daily Recommendations' : 'Recomendaciones diarias';
};

/**
 * Función para determinar si un dispositivo es móvil basado en el ancho de la ventana
 * @param width - El ancho de la ventana en píxeles
 * @param threshold - El umbral que define cuando es un dispositivo móvil (por defecto 600px)
 * @returns true si es un dispositivo móvil, false en caso contrario
 */
export const isMobileDevice = (width: number, threshold: number = 600): boolean => {
  return width <= threshold;
};

/**
 * Genera un ID único para una recomendación
 * @param rec - La recomendación
 * @param idx - El índice de la recomendación en la lista
 * @returns Un ID único para la recomendación
 */
export const generateRecommendationKey = (rec: any, idx: number): string => {
  return `${rec.category}_${rec.id !== undefined ? rec.id : idx}_${idx}`;
};

/**
 * Obtiene una imagen aleatoria de "no encontrado" de la carpeta notfound
 * @returns La ruta de la imagen aleatoria
 */
export const getRandomNotFoundImage = (): string => {
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
 * @param item - El item (película, libro, etc.)
 * @returns Un ID único global
 */
export const generateUniqueId = (item: any): string => {
  // Si el item ya tiene un ID único global, lo devolvemos
  if (item.globalId) return item.globalId;
  
  // Si no tiene ID local, usar el título como fallback
  const localId = item.id !== undefined ? item.id : item.title?.es || item.title || 'unknown';
  
  // Crear ID único: categoria_idLocal
  return `${item.category}_${localId}`;
};

/**
 * Transforma un item para asegurar que tenga un ID único global
 * @param item - El item original
 * @param fallbackIndex - Índice como fallback si no hay otro ID
 * @returns El item con ID único garantizado
 */
export const ensureUniqueId = (item: any, fallbackIndex: number = 0): ItemWithGlobalId => {
  return {
    ...item,
    globalId: generateUniqueId(item),
    originalId: item.id // Preservar el ID original
  };
};

/**
 * Procesa una lista de items para asegurar IDs únicos
 * @param items - Lista de items
 * @returns Lista con IDs únicos garantizados
 */
export const processItemsWithUniqueIds = (items: any[]): ItemWithGlobalId[] => {
  // Validar que items sea un array
  if (!Array.isArray(items)) {
    console.error('processItemsWithUniqueIds: items no es un array:', items);
    return [];
  }
  
  return items.map((item, index) => ensureUniqueId(item, index));
};

/**
 * Busca un item por su ID único global
 * @param items - Lista de items
 * @param globalId - ID único global a buscar
 * @returns El item encontrado o null
 */
export const findItemByGlobalId = (items: any[], globalId: string): any | null => {
  return items.find(item => generateUniqueId(item) === globalId) || null;
};

/**
 * Extrae contenido localizado de un campo que puede ser string o objeto {es, en}
 * @param content - El contenido que puede ser string o objeto
 * @param lang - Idioma actual ('es' o 'en')
 * @returns El contenido en el idioma solicitado
 */
export const getLocalizedContent = (content: any, lang: Language = 'es'): string => {
  if (typeof content === 'string') {
    return content;
  }
  
  if (typeof content === 'object' && content !== null) {
    return content[lang] || content.es || content.en || '';
  }
  
  return '';
};

/**
 * Extrae el título localizado de un item
 * @param item - El item
 * @param lang - Idioma actual ('es' o 'en')
 * @returns El título en el idioma solicitado
 */
export const getLocalizedTitle = (item: any, lang: Language = 'es'): string => {
  return getLocalizedContent(item?.title, lang);
};

/**
 * Extrae la descripción localizada de un item
 * @param item - El item
 * @param lang - Idioma actual ('es' o 'en')
 * @returns La descripción en el idioma solicitado
 */
export const getLocalizedDescription = (item: any, lang: Language = 'es'): string => {
  return getLocalizedContent(item?.description, lang);
};

/**
 * Valida si un valor es un array válido y no vacío
 * @param value - El valor a validar
 * @returns true si es un array válido y no vacío
 */
export const isValidArray = (value: any): boolean => {
  return Array.isArray(value) && value.length > 0;
};

/**
 * Valida si un valor es un array válido (puede estar vacío)
 * @param value - El valor a validar
 * @returns true si es un array válido
 */
export const isArray = (value: any): boolean => {
  return Array.isArray(value);
};

/**
 * Obtiene un array seguro, devolviendo un array vacío si el valor no es válido
 * @param value - El valor a validar
 * @returns El array original si es válido, o un array vacío
 */
export const safeArray = <T>(value: any): T[] => {
  return Array.isArray(value) ? value : [];
};
