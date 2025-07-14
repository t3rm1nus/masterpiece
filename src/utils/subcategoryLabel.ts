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
  t: TranslationObject, 
  lang: string
): string {
  if (!subKey || !category || !t) return subKey;
  // Normaliza la key
  const key = normalizeKey(subKey);
  // Busca el literal en texts.json
  if (t.subcategories && t.subcategories[category] && t.subcategories[category][key]) {
    return t.subcategories[category][key];
  }
  // Fallback: solo la key
  return key;
} 