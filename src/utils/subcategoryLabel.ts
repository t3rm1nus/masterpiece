// Utilidad para obtener el literal traducido de subcategoría
// Uso: getSubcategoryLabel(subKey, category, t, lang)
import { normalizeKey } from './stringUtils';

interface TranslationObject {
  subcategories?: {
    [category: string]: {
      [key: string]: string;
    };
  };
  [key: string]: any;
}

export function getSubcategoryLabel(
  subKey: string, 
  category: string, 
  t: any
): string {
  if (!subKey || !category || !t) return capitalize(subKey);
  // Normaliza la key
  const key = normalizeKey(subKey);
  // Busca el literal en t.subcategories[category][key]
  if (
    t.subcategories &&
    t.subcategories[category] &&
    t.subcategories[category][key]
  ) {
    return t.subcategories[category][key];
  }
  // Fallback: solo la key, capitalizada
  return capitalize(subKey);
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
} 